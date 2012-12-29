taskevo.Views.Tasks = Backbone.View.extend( {

	tagName: "div",

	className: "list",

	initialize: function() {

		var that = this;

		// Task area
		var tasksEl = this.tasksEl = $( '<ol class="tasks"></ol>' );
		var addTaskFormEl = this.addTaskFormEl = $( '<form></form>' );
		var taskSummaryEl = this.taskSummaryEl = $( '<input value="" />' );
		var taskSubmitEl = this.taskSubmitEl = $( '<button>Create task</button>' );
		addTaskFormEl.on( 'submit', { view: that }, this.onSubmitTaskForm );

		addTaskFormEl
			.append( taskSummaryEl )
			.append( taskSubmitEl );

		$( this.el )
			.append( addTaskFormEl )
			.append( tasksEl );

		return this;

	},

	render: function() {
		return this;
	},

	onSubmitTaskForm: function( e ) {

		e.preventDefault();

		var view = e.data.view;
		var summary = view.taskSummaryEl.val().trim();
		
		if ( !summary ) {
			return;
		}
		
		taskevo.user.lists.get( view.options.stage.nextListID ).createTask( { summary: summary } );
		view.taskSummaryEl.val( '' );
		
		return this;
	
	},

	loadTasks: function( list_id ) {
		if ( this.options.stage.nextListID ) {
			taskevo.user.lists.get( this.options.stage.nextListID ).tasks.unbind( 'add', this.onAddTask, this );
		}
		this.options.stage.nextListID = list_id;
		taskevo.user.lists.get( list_id ).load( 'tasks' );
		taskevo.user.lists.get( list_id ).tasks.bind( 'add', this.onAddTask, this );
		return this;
	},

	onAddTask: function( task ) {
		return this.addTaskEl( task );
	},

	addTaskEl: function( task ) {

		var that = this;
		var tasksEl = this.tasksEl;
		var taskEl = $( '<li class="task-' + task.id + '">' + task.get( 'summary' ) + '</li>' );

		var data = { task: task };
		var onClick = function( e ) {
			alert( 'clicked on task #' + e.data.task.id );
		};

		taskEl.bind( 'click', data, onClick );

		tasksEl.append( taskEl );

		return this;

	},

	onLoadTasks: function( list ) {

		if ( list.id != this.options.stage.nextListID ) {
			return this;
		}

		var tasksEl = this.tasksEl;
		var tasks = list.tasks;

		tasksEl.html( '' );

		for ( var i = 0; i < tasks.length; i++ ) {
			this.addTaskEl( tasks.at( i ) );
		}

		return this;

	},

} );