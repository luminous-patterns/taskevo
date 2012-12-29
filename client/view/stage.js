taskevo.Views.Stage = Backbone.View.extend( {

	tagName: "div",

	className: "stage",

	nextListID: null,

	initialize: function() {

		var that = this;

		// Main elements
		var userBarEl = this.userBarEl = $( '<div class="user-bar"></div>' );
		var lists = this.lists = new taskevo.Views.Lists( { stage: that } );
		var tasks = this.tasks = new taskevo.Views.Tasks( { stage: that } );

		// Events
		taskevo.user.on( 'sync', this.onSyncUser, this );
		taskevo.user.lists.on( 'sync', lists.onLoadLists, lists );
		taskevo.user.lists.on( 'add', lists.onAddList, lists );

		taskevo.events.on( 'load-tasks', tasks.onLoadTasks, tasks );

		// Add elements
		$( this.el )
			.append( userBarEl )
			.append( $( lists.render().el ) )
			.append( $( tasks.render().el ) );

		return this;

	},

	render: function() {
		return this;
	},

	onSyncUser: function() {
		var user = taskevo.user;
		this.userBarEl.html( 'Logged in as: ' + user.get( 'firstname' ) + ' ' + user.get( 'lastname' ) );
	},

} );