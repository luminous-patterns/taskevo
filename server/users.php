<?php

/****************************
/* Users
/***************************/

// GET route
$app->get( '/users/:id', function ( $id ) use ( $app, $db ) {
	$id = $db->sanitise( $id );
    echo json_encode( $db->select( "SELECT * FROM `users` WHERE `id` = $id", 'row' ) );
} );

$app->get( '/users/:id/lists', function ( $id ) use ( $app, $db ) {
	$id = $db->sanitise( $id );
	$results = $db->select( "SELECT * FROM `lists` WHERE `user_id` = " . $id . " AND `parent` IS NULL AND `deleted` IS NULL", 'rows' );
	echo json_encode( $results );
} );

// POST route
$app->post( '/users', function () use ( $app, $db ) {



} );

// PUT route
$app->put( '/users/:id', function ( $id ) use ( $app, $db ) {
    echo json_encode( array( 'id' => $id, 'request' => 'put' ) );
} );

// DELETE route
$app->delete( '/users/:id', function ( $id ) use ( $app, $db ) {
    echo json_encode( array( 'id' => $id, 'request' => 'delete' ) );
} );