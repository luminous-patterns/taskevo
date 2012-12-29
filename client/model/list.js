taskevo.Models.List = Backbone.Model.extend( {

	urlRoot: '//server.taskevo.com/lists',

	defaults: {
		id:                null,
		user_id:           null,
		parent:            null,
		title:             null,
		description:       null,
		start:             null,
		due:               null,
		created:           null,
	},

	tasks: null,
	lists: null,
	loaded: false,

	initialize: function() {

		var that = this;

		this.tasks = new taskevo.Collections.Tasks();
		this.tasks.url = function() {
			return '//server.taskevo.com/lists/' + that.id + '/tasks';
		};

		this.lists = new taskevo.Collections.Lists();
		this.lists.url = function() {
			return '//server.taskevo.com/lists/' + that.id + '/lists';
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
			case 'tasks':
				collection = this.tasks;
				break;
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

	createTask: function( attributes ) {
		var that = this;
		return this.tasks.create( _.extend( attributes, { user_id: taskevo.user.id, list_id: that.id } ) );
	},

	getTask: function( taskID ) {
		return this.tasks.get( taskID );
	},

	getTasks: function() {
		return this.tasks;
	},

	createList: function( attributes ) {
		var that = this;
		return this.lists.create( _.extend( attributes, { user_id: taskevo.user.id, parent: that.id } ) );
	},

	getList: function( taskID ) {
		return this.lists.get( taskID );
	},

	getLists: function() {
		return this.lists;
	},

} );

taskevo.Collections.Lists = Backbone.Collection.extend( {

	model: taskevo.Models.List,
	
} );