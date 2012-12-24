taskevo.Collections.Lists = Backbone.Collection.extend( {

	model: taskevo.Models.List,
	
} );

taskevo.Models.List = Backbone.Model.extend( {

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

	initialize: function() {

		this.tasks = new taskevo.Collections.Tasks();
		this.lists = new taskevo.Collections.Lists();

	},

	createTask: function() {
		return this.tasks.create();
	},

	getTask: function( taskID ) {
		return this.tasks.get( taskID );
	},

	getTasks: function() {
		return this.tasks;
	},

} );