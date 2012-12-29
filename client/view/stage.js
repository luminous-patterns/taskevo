taskevo.Views.Stage = Backbone.View.extend( {

	tagName: "div",

	className: "stage",

	nextListID: null,

	initialize: function() {

		var that = this;

		// Main elements
		var userBarEl = this.userBarEl = $( '<div class="user-bar"></div>' );
		var lists = this.lists = new taskevo.Views.Lists( { stage: that } );

		// Events
		taskevo.user.on( 'sync', this.onSyncUser, this );
		taskevo.events.on( 'view-list', this.onViewList, this );

		// Add elements
		$( this.el )
			.append( userBarEl )
			.append( $( lists.render().el ) );

		return this;

	},

	render: function() {
		return this;
	},

	closeList: function() {

		if ( this.list ) {
			this.list.close();
		}

		this.list = null;

		return this;

	},

	onViewList: function( list_id ) {

		var that = this;
		var list = taskevo.user.lists.get( list_id );

		this.closeList();

		this.list = new taskevo.Views.List( { 
			model: list,
			stage: that,
		} );

		$( this.el ).append( $( this.list.render().el ) );

		return this;

	},

	onSyncUser: function() {
		var user = taskevo.user;
		this.userBarEl.html( 'Logged in as: ' + user.get( 'firstname' ) + ' ' + user.get( 'lastname' ) );
	},

} );