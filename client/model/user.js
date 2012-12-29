taskevo.Models.User = Backbone.Model.extend( {

	urlRoot: '//server.taskevo.com/users',

	defaults: {
		id:                null,
		email:             null,
		firstname:         null,
		lastname:          null,
		created:           null,
	},

	lists: null,
	timeEntries: null,
	loaded: false,

	initialize: function() {

		var that = this;

		this.lists = new taskevo.Collections.Lists();
		this.lists.url = function() {
			return '//server.taskevo.com/users/' + that.id + '/lists';
		};

	},

	load: function( objType ) {

		if ( this.loaded && ( arguments.length < 2 || !arguments[1] ) ) {
			this.trigger( 'load-' + objType );
			taskevo.events.trigger( 'load-' + objType, this );
			return this;
		}

		var that = this;
		var collection = null;
		switch ( objType ) {
			case 'lists':
				collection = this.lists;
				break;
		}

		collection.fetch( {
			success: function() {
				that.trigger( 'load-' + objType );
				taskevo.events.trigger( 'load-' + objType, that );
				that.loaded = true;
			},
		} );

		return this;

	},

	createList: function( attributes ) {
		var that = this;
		return this.lists.create( _.extend( attributes, { user_id: that.id } ) );
	},

} );

taskevo.Collections.Users = Backbone.Collection.extend( {

	model: taskevo.Models.User,
	
} );