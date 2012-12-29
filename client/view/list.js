taskevo.Views.List = Backbone.View.extend( {

	tagName: "div",

	className: "list",

	initialize: function() {

		var that = this;

		// Events
		this.model.on( 'load-tasks', this.onLoadTasks, this );
		this.model.tasks.on( 'add', this.onAddTask, this );
		// this.model.tasks.on( 'remove', this.onRemoveTask, this );

		// Task area
		var tasksEl = this.tasksEl = $( '<ol class="tasks"></ol>' );
		var addTaskFormEl = this.addTaskFormEl = $( '<form></form>' );
		var taskSummaryEl = this.taskSummaryEl = $( '<input value="" />' );
		var taskSubmitEl = this.taskSubmitEl = $( '<button>Create task</button>' );
		var deleteButtonEl = this.deleteButtonEl = $( '<button>Delete list</button>' );
		addTaskFormEl.on( 'submit', { view: that }, this.onSubmitTaskForm );
		deleteButtonEl.on( 'click', { view: that }, this.onClickDelete );

		addTaskFormEl
			.append( taskSummaryEl )
			.append( taskSubmitEl );

		$( this.el )
			.append( '<h1>' + this.model.get( 'title' ) + ' (#' + this.model.id + ')</h1>' )
			.append( deleteButtonEl )
			.append( addTaskFormEl )
			.append( tasksEl );

		this.model.load( 'tasks' );

		return this;

	},

	render: function() {
		return this;
	},

	onClickDelete: function( e ) {
		var view = e.data.view;
		var doDelete = window.confirm( "Confirm delete list ID# " + view.model.id );
		if ( doDelete ) {
			view.model.destroy();
			view.options.stage.closeList();
		}
		return this;
	},

	onSubmitTaskForm: function( e ) {

		e.preventDefault();

		var view = e.data.view;
		var summary = view.taskSummaryEl.val().trim();
		
		if ( !summary ) {
			return;
		}
		
		view.model.createTask( { summary: summary } );
		view.taskSummaryEl.val( '' );
		
		return this;
	
	},

	onAddTask: function( task ) {
		return this.addTaskEl( task );
	},

	addTaskEl: function( task ) {
		this.tasksEl.append( $( new taskevo.Views.Task( { model: task } ).render().el ) );
		return this;
	},

	onLoadTasks: function() {

		var tasksEl = this.tasksEl;
		var tasks = this.model.tasks;

		tasksEl.html( '' );

		for ( var i = 0; i < tasks.length; i++ ) {
			this.addTaskEl( tasks.at( i ) );
		}

		return this;

	},

} );