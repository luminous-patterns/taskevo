taskevo.Models.TimeEntry = Backbone.Model.extend( {

	urlRoot: '//server.taskevo.com/timeentries',

	defaults: {
		id:              null,
		task_id:         null,
		user_id:         null,
		comment:         null,
		pause_seconds:   0,
		start:           null,
		end:             null,
	},

	isActive: false,
	isPaused: false,
	pauseTimerStart: null,
	pauseTimerEnd: null,

	initialize: function() {

	},

	start: function() {
		return this.save( { 
			start: 'now', 
		} );
	},

	pause: function() {

		var that = this;
		var paused = this.isPaused;

		if ( !paused ) {
			this.pauseTimerStart = taskevo.time.sinceInit();
			this.isPaused = true;
		}
		else {

			this.pauseTimerEnd = taskevo.time.sinceInit();

			var pauseTime = this.pauseTimerEnd - this.pauseTimerStart;

			this.isPaused = false;
			this.pauseTimerStart = null;
			this.pauseTimerEnd = null;

			this.save( {
				pause_seconds: that.get( 'pause_seconds' ) + pauseTime,
			} );

		}

		return this;

	},

	end: function() {
		taskevo.events.trigger( 'prompt-for-comment', this );
		return this.save( { 
			end: 'now', 
		} );
	},

} );

taskevo.Collections.TimeEntries = Backbone.Collection.extend( {

	model: taskevo.Models.TimeEntry,
	
} );