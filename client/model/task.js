taskevo.Collections.Tasks = Backbone.Collection.extend( {

	model: taskevo.Models.Task,
	
} );

taskevo.Models.Task = Backbone.Model.extend( {

	urlRoot: '//server.taskevo.com/tasks',

	defaults: {
		id:                null,
		list_id:           null,
		user_id:           null,
		summary:           null,
		details:           null,
		created:           null,
		completed:         null,
		due:               null,
	},

	notes: null,
	timeEntries: null,
	commits: null,

	initialize: function() {

		this.notes = new taskevo.Collections.Notes();
		this.timeEntries = new taskevo.Collections.TimeEntries();
		this.commits = new taskevo.Collections.Commits();

	},

	createNote: function() {
		return this.notes.create();
	},

	getNote: function( noteID ) {
		return this.notes.get( noteID );
	},

	getNotes: function() {
		return this.notes;
	},

	createTimeEntry: function() {
		return this.timeEntries.create();
	},

	getTimeEntry: function( timeEntryID ) {
		return this.timeEntries.get( timeEntryID );
	},

	getTimeEntries: function() {
		return this.timeEntries;
	},

	createCommit: function() {
		return this.commits.create();
	},

	getCommit: function( commitID ) {
		return this.commits.get( commitID );
	},

	getCommits: function() {
		return this.commits;
	},

} );