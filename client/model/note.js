taskevo.Collections.Notes = Backbone.Collection.extend( {

	model: taskevo.Models.Note,
	
} );

taskevo.Models.Note = Backbone.Model.extend( {

	urlRoot: '//server.taskevo.com/notes',

	defaults: {
		id:            null,
		user_id:       null,
		task_id:       null,
		content:       null,
		created:       null,
	},

	initialize: function() {

	},

} );