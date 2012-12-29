<?php

/****************************
/* Tasks
/***************************/

// GET route
$app->get( '/tasks/:id', function ( $id ) use ( $app, $db ) {
	$id = $db->sanitise( $id );
    echo json_encode( $db->select( "SELECT * FROM `tasks` WHERE `id` = $id AND `deleted` IS NULL", 'row' ) );
} );

// POST route
$app->post( '/tasks', function () use ( $app, $db ) {

	$request = json_decode( $app->request()->getBody() );

	$data = array(
		'data' => array(
			'list_id'      => $request->list_id,
			'user_id'      => $request->user_id,
			'summary'      => $request->summary,
			'details'      => $request->details,
		),
		'data_safe' => array(
			'created'      => 'NOW()',
		),
	);

	$id = $db->insert( 'tasks', $data, true );

	echo json_encode( $db->select( "SELECT * FROM `tasks` WHERE `id` = $id AND `deleted` IS NULL", 'row' ) );

} );

// PUT route
$app->put( '/tasks/:id', function ( $id ) use ( $app, $db ) {

	$request = json_decode( $app->request()->getBody() );

	$columns = array( 'summary', 'details', 'list_id' );
	$data_sql = array();
	foreach ( $request as $col => $val ) {
		if ( in_array( $col, $columns ) ) {
			$val = $db->sanitise( $val );
			$data_sql[] = "`$col` = $val";
		}
		if ( $col == 'completed' ) {
			if ( $val == 'now' ) {
				$data_sql[] = "`completed` = NOW()";
			}
			else if ( !$val ) {
				$data_sql[] = "`completed` = NULL";
			}
		}
	}
	$data_sql = implode( ',', $data_sql );

	$db->query( "UPDATE `tasks`
		SET $data_sql
		WHERE `id` = $id" );

	echo json_encode( $db->select( "SELECT * FROM `tasks` WHERE `id` = $id AND `deleted` IS NULL", 'row' ) );

} );

// DELETE route
$app->delete( '/tasks/:id', function ( $id ) use ( $app, $db ) {

	$id = $db->sanitise( $id );

	$db->query( "UPDATE `tasks` SET `deleted` = NOW() WHERE `id` = $id" );
	
	$app->response()->status( 204 );

} );