<?php

/****************************
/* Tasks
/***************************/

// GET route
$app->get( '/lists/:id', function ( $id ) use ( $app, $db ) {
	
	$id = $db->sanitise( $id );

	$list = $db->select( "SELECT * FROM `lists` WHERE `id` = $id", 'row' );

	if ( !$list ) {
		die('invalid');
	}

	$tasks = $db->select( "SELECT * FROM `tasks` WHERE `list_id` = " . $list['id'] . " AND `deleted` IS NULL", 'rows' );

	$list['tasks'] = count( $tasks ) > 0 ? $tasks : null;

    echo json_encode( $list );

} );

// GET route
$app->get( '/lists/:id/:content', function ( $id, $content ) use ( $app, $db ) {
	
	$id = $db->sanitise( $id );

	$list = $db->select( "SELECT * FROM `lists` WHERE `id` = $id", 'row' );

	if ( !$list ) {
		die('invalid');
	}

	switch ( $content ) {

		case 'tasks':
			$results = $db->select( "SELECT * FROM `tasks` WHERE `list_id` = " . $list['id'] . " AND `deleted` IS NULL", 'rows' );
			break;

		case 'lists':
			$results = $db->select( "SELECT * FROM `lists` WHERE `parent` = " . $list['id'] . " AND `deleted` IS NULL", 'rows' );
			break;

	}

	// $results_by_id = array();
	// foreach ( $results as $result ) {
	// 	$results_by_id[$result['id']] = $result;
	// }

	if ( !$results || count( $results ) < 1 ) {
		$app->response()->status( 204 );
		return;
	}

	echo json_encode( $results );

} );

// POST route
$app->post( '/lists', function () use ( $app, $db ) {

	$request = json_decode( $app->request()->getBody() );

	$data = array(
		'data' => array(
			'user_id'        => $request->user_id,
			'parent'         => $request->parent,
			'title'          => $request->title,
			'description'    => $request->description,
		),
		'data_safe' => array(
			'created'      => 'NOW()',
		),
	);

	if ( !$request->parent ) {
		$data['data_safe']['parent'] = 'NULL';
		unset( $data['data']['parent'] );
	}

	$id = $db->insert( 'lists', $data, true );

	echo json_encode( $db->select( "SELECT * FROM `lists` WHERE `id` = $id", 'row' ) );

} );

// PUT route
$app->put( '/lists/:id', function ( $id ) use ( $app, $db ) {

	$request = json_decode( $app->request()->getBody() );

	$columns = array( 'parent', 'title', 'description' );
	$data_sql = array();
	foreach ( $request as $col => $val ) {
		if ( in_array( $col, $columns ) ) {
			$val = $db->sanitise( $val );
			$data_sql[] = "`$col` = $val";
		}
	}
	$data_sql = implode( ',', $data_sql );

	$db->query( "UPDATE `lists`
		SET $data_sql
		WHERE `id` = $id" );

	echo json_encode( $db->select( "SELECT * FROM `lists` WHERE `id` = $id", 'row' ) );

} );

// DELETE route
$app->delete( '/lists/:id', function ( $id ) use ( $app, $db ) {
    echo json_encode( array( 'id' => $id, 'request' => 'delete' ) );
} );