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

		var that = this;

		this.notes = new taskevo.Collections.Notes();
		this.notes.url = function() {
			return '//server.taskevo.com/tasks/' + that.id + '/notes';
		};

		this.timeEntries = new taskevo.Collections.TimeEntries();
		this.timeEntries.url = function() {
			return '//server.taskevo.com/tasks/' + that.id + '/timeentries';
		};

		this.commits = new taskevo.Collections.Commits();
		this.commits.url = function() {
			return '//server.taskevo.com/tasks/' + that.id + '/commits';
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
			case 'notes':
				collection = this.notes;
				break;
			case 'timeEntries':
				collection = this.timeEntries;
				break;
			case 'commits':
				collection = this.commits;
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

taskevo.Collections.Tasks = Backbone.Collection.extend( {

	model: taskevo.Models.Task,
	
} );