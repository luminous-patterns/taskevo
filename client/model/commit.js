taskevo.Models.Commit = Backbone.Model.extend( {

	defaults: {
		id:            null,
		task_id:       null,
	},

	initialize: function() {

	},

} );

taskevo.Collections.Commits = Backbone.Collection.extend( {

	model: taskevo.Models.Commit,

} );