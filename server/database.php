<?php
/** 
 * The TaskEVO Database Object
 * 
 * @since 1.0.0
 */  
class IWDB {
	
	/**
	 * Database Instance
	 * @var object
	 */
	private $_db_connection;

	/**
	 * Database State
	 * @var boolean
	 */
	private $_db_state;
	
	/**
	 * Database Host
	 * @var string
	 */
	private $_db_host;

	/**
	 * Database Name
	 * @var string
	 */
	private $_db_name;

	/**
	 * Database Username
	 * @var string
	 */
	private $_db_user;

	/**
	 * Database Password
	 * @var string
	 */
	private $_db_pass;
	
	public function __construct() {

		$this->_db_host = DB_HOST;
		$this->_db_name = DB_NAME;
		$this->_db_user = DB_USER;
		$this->_db_pass = DB_PASS;
		
	}
	
	public function __destruct() {
		//if ( $this->_db_state ) mysql_close( $this->_db_connection );
	}
	
	/**
	 * Check the current connection and connect if required
	 * 
	 * @param string $query The database query
	 * @return boolean True if connected
	 **/
	public function check_connection() {
		
		if ( !isset( $this->_db_connection ) ) { 
			
			$this->_db_connection = mysql_connect( $this->_db_host, $this->_db_user, $this->_db_pass );
			
			if ( !$this->_db_connection ) throw new Exception( "Unable to connect to database" );
			
			$this->_db_state = mysql_select_db( $this->_db_name, $this->_db_connection );
			
			if ( !$this->_db_state ) throw new Exception( "Unable to connect to database" );
			
			mysql_query( "SET NAMES 'utf8'", $this->_db_connection );
			mysql_query( "SET CHARACTER SET utf8", $this->_db_connection );
			mysql_query( "SET CHARACTER_SET_CONNECTION=utf8", $this->_db_connection );
			mysql_query( "SET SQL_MODE = ''", $this->_db_connection );
			
		}
		
		return true;
		
	}
	
	/**
	 * Run an MySQL query
	 * 
	 * @param string $query The database query
	 * @return object MySQL database object
	 **/
	public function query( $query ) {
		
		$this->check_connection();
		
		$result = mysql_query( $query, $this->_db_connection );
		
		if ( mysql_errno( $this->_db_connection ) > 0 )
			throw new Exception( 'Database error: ( ' . mysql_error( $this->_db_connection ) . ' - ' . $query . ' ) ' . mysql_errno( $this->_db_connection ) ); 
		
		return $result;
		
	}
	
	/**
	 * Select from the database
	 * 
	 * @param string $query The database query
	 * @param string $result_format Result format (ie full, row, value, count)
	 * @return mixed The result
	 **/
	public function select( $query, $result_format = 'full' ) {
		
		$result = $this->query( $query );
		
		switch ( $result_format ) {
			case 'row':
				return mysql_fetch_assoc( $result );
			case 'rows':
				return $this->_getRows( $result );
			case 'value':
				return mysql_num_rows( $result ) > 0 ? mysql_result( $result, 0 ) : false;
			case 'count':
				return mysql_num_rows( $result );
			default:
			case 'full':
				$rows = $this->_getRows();
				return array(
					'rows' => $rows,
					'count' => count( $rows )
				);
		}
		
	}
	
	private function _getRows( $mysql_result ) {
		$result = array();
		while ( $row = mysql_fetch_assoc( $mysql_result ) ) $result[] = $row;
		return $result;
	}
	
	/**
	 * Sanitise a string for entry in to the database,
	 * prevents any SQL injection.
	 * 
	 * @param string $table Database table (no prefix)
	 * @param array $set Data to be set
	 * @return boolean Was the action successful?
	 **/
	public function replace( $table, $set ) {
		
		$set = $this->prepareValues( $set );
		
		$sql = " REPLACE `" . $this->tableName( $table ) . "` SET ";
		$sql .= join( ', ', $set );
		
		$result = $this->query( $sql );
		
		if ( $result ) return true;
		
		return false;
		
	}
	
	/**
	 * Sanitise a string for entry in to the database,
	 * prevents any SQL injection.
	 * 
	 * @param string $table Database table (no prefix)
	 * @param array $set Data to be set
	 * @param array $return_id Return unique ID?
	 * @return boolean Was the action successful?
	 **/
	public function insert( $table, $set, $return_id = false ) {
		
		$set = $this->prepareValues( $set );
		
		$sql = " INSERT INTO `" . $this->tableName( $table ) . "` SET ";
		$sql .= join( ', ', $set );
		
		$result = $this->query( $sql );
		
		if ( $result && $return_id ) return $this->_getLastId();
		elseif ( $result && !$return_id ) return true;
		
		return false;
		
	}
	
	/**
	 * Sanitise a string for entry in to the database,
	 * prevents any SQL injection.
	 * 
	 * @param string $table Database table (no prefix)
	 * @param array $set Data to be set
	 * @param array $where Where statements
	 * @param integer $limit Max number of rows to update ( 0 = all )
	 * @param boolean $return_affected Return number of rows affected
	 * @return mixed Boolean success or affected rows number
	 **/
	public function update( $table, $set, $where, $limit = 0, $return_affected = false ) {
		
		$set = $this->prepareValues( $set );
		$where = $this->prepareValues( $where );
		
		$sql = " UPDATE `" . $this->tableName( $table ) . "` SET ";
		$sql .= join( ', ', $set );
		if ( count( $where ) > 0 ) {
			$sql .= " WHERE ";
			$sql .= join ( ' AND ', $where );
		}
		
		if ( $limit > 0 ) $sql .= " LIMIT $limit ";
		
		$result = $this->query( $sql );
		
		if ( $result && $return_affected ) return $this->_countAffected();
		if ( $result ) return true;
		
		return false;
		
	}
	
	/**
	 * Sanitise a string for entry in to the database,
	 * prevents any SQL injection.
	 * 
	 * @param string $table Database table (no prefix)
	 * @param array $set Data to be set
	 * @param array $where Where statements
	 * @param integer $limit Max number of rows to update ( 0 = all )
	 * @param boolean $return_affected Return number of rows affected
	 * @return mixed The sanitised value
	 **/
	public function remove( $table, $where, $limit = 0, $return_affected = false ) {
		
		$where = $this->prepareValues( $where );
		
		$sql = " DELETE FROM `" . $this->tableName( $table ) . "` WHERE ";
		$sql .= join( ' AND ', $where );
		
		if ( $limit > 0 ) $sql .= " LIMIT $limit ";
		
		$result = $this->query( $sql );
		
		if ( $result && $return_affected ) return $this->_countAffected();
		if ( $result && !$return_affected ) return true;
		
		return false;
		
	}
	
	/**
	 * Accepts array of values for the database and sanitises
	 * any values that need to be sanitised.
	 * 
	 * @param array $values Array of values to sanitise
	 * @return mixed The array of values
	 **/
	public function prepareValues( $values ) {
		
		$prepared_lines = array();
		
		foreach ( $values as $type => $array ) {
			
			switch ( $type ) {
				case 'data_safe':
					$sanitise = false;
					$add_quotes = false;
					break;
				case 'data':
				default:
					$sanitise = true;
					$add_quotes = true;
					break;
			}
			
			foreach ( $array as $column => $value ) {
				if ( !is_array( $value ) ) {
					$value = trim( $value );
					$value = ( $sanitise ) ? $this->sanitise( $value, $add_quotes ) : $value;
					$value = " = $value ";
				}
				else {
					$values = array();
					foreach ( $value as $single_value )
						array_push( $values, ( $sanitise ) ? $this->sanitise( $single_value, $add_quotes ) : $single_value );
					$value = " IN ( " . join( ', ', $values ) . " ) ";
				}
				array_push( $prepared_lines, " `$column` $value " );
			}
			
		}
		
		return $prepared_lines;
		
	}
	
	/**
	 * Sanitise a string for entry in to the database,
	 * prevents any SQL injection.
	 * 
	 * @param mixed $value Order ID
	 * @return mixed The sanitised value
	 **/
	public function sanitise( $value, $add_quotes = true ) {
		$this->check_connection();
		if ( is_int( $value ) ) return $value;
		$value = ( $add_quotes ) ? "'" . mysql_real_escape_string( $value, $this->_db_connection ) . "'" : $value;
		return $value;
	}
	
	/**
	 * Adds any required prefix/suffix to table name
	 * 
	 * @param string $table The table name
	 * @return string The prefixed table name
	 **/
	public function tableName( $table ) {
		return DB_PREFIX . $table;
	}
	
	private function _getLastId() {
		return mysql_insert_id( $this->_db_connection );
	}
	
	public function _countAffected() {
		return mysql_affected_rows( $this->_db_connection );
	}
	
}

?>