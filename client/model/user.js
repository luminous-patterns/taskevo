taskevo.Collections.Users = Backbone.Collection.extend( {

	model: taskevo.Models.User,
	
} );

taskevo.Models.User = Backbone.Model.extend( {

	urlRoot: '//server.taskevo.com/users',

	defaults: {
		id:                null,
		email:             null,
		firstname:         null,
		lastname:          null,
		created:           null,
	},

	listGroups: null,
	timeEntries: null,

	initialize: function() {

	},

} );