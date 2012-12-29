window.taskevo = {

	Models: new Object(),
	Views: new Object(),
	Collections: new Object(),

	model: new Object(),
	view: new Object(),
	collection: new Object(),

	events: null,

};

$( function() {

	// Events
	taskevo.events = new Object();
	_.extend( taskevo.events, Backbone.Events );

	// Load user details
	taskevo.user = new taskevo.Models.User( { id: 1 } );
	taskevo.user.fetch();
	taskevo.user.on( 'sync', function() {
		this.load( 'lists' );
	} ); 

	// Load stage view
	taskevo.stage = new taskevo.Views.Stage();
	$( 'body' ).append( $( taskevo.stage.render().el ) );

} );