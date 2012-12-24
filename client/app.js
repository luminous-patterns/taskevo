window.taskevo = {

	Models: new Object(),
	Views: new Object(),
	Collections: new Object(),

	model: new Object(),
	view: new Object(),
	collection: new Object(),

};

$( function() {

	var userDetailsEl = $( '<div></div>' );
	var onSyncUser = function() {
		userDetailsEl.html( 'Logged in as: ' + this.get( 'firstname' ) + ' ' + this.get( 'lastname' ) );
	};
	$( 'body' ).append( userDetailsEl );

	taskevo.user = new taskevo.Models.User( { id: 1 } );
	taskevo.user.on( 'sync', onSyncUser );
	taskevo.user.fetch();

} );