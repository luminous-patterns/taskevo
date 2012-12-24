<?php

/****************************
/* Tasks
/***************************/

// GET route
$app->get( '/tasks/:id', function ( $id ) use ( $app, $db ) {
	$id = $db->sanitise( $id );
    echo json_encode( $db->select( "SELECT * FROM `tasks` WHERE `id` = $id", 'row' ) );
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

	echo json_encode( $db->select( "SELECT * FROM `tasks` WHERE `id` = $id", 'row' ) );

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
	}
	$data_sql = implode( ',', $data_sql );

	$db->query( "UPDATE `tasks`
		SET $data_sql
		WHERE `id` = $id" );

	echo json_encode( $db->select( "SELECT * FROM `tasks` WHERE `id` = $id", 'row' ) );

} );

// DELETE route
$app->delete( '/tasks/:id', function ( $id ) use ( $app, $db ) {
    echo json_encode( array( 'id' => $id, 'request' => 'delete' ) );
} );