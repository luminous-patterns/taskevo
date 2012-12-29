<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header( "Access-Control-Allow-Origin: *" );
header( "Access-Control-Allow-Methods: POST, GET, PUT, DELTE, OPTIONS" );
header( "Access-Control-Max-Age: 1000" );
header( "Access-Control-Allow-Headers: origin, x-csrftoken, content-type, accept" );

define( 'DB_HOST', 'localhost' );
define( 'DB_NAME', 'taskevo' );
define( 'DB_USER', 'root' );
define( 'DB_PASS', 'drmfslt0' );
define( 'DB_PREFIX', '' );

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim( array(
    'mode' => 'development',
) );

require 'database.php';
$db = new IWDB();

$app->contentType( "application/json" );

$app->options( '/', function () use ( $app ) {

    echo '';

} );

$object_types = array(
    'tasks',
    'users',
    'lists',
);

foreach ( $object_types as $type ) {
    include $type . '.php';
}

$app->run();
