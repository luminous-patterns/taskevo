taskevo.Views.Task = Backbone.View.extend( {

	tagName: "li",

	className: "task",

	events: {
		'click':           'onClick',
		'click .delete':   'onClickDelete',
	},

	inputMinSize: 25,
	inputMaxSize: 100,

	initialize: function() {

		var that = this;

		// Events
		this.model.on( 'change', this.render, this );

		// Elements
		var deleteButtonEl = this.deleteButtonEl = $( '<a href="#" class="delete">DELETE</a>' );
		var summaryEl = this.summaryEl = $( '<div class="summary">' + this.model.get( 'summary' ) + '</div>' );
		var summaryInputEl = this.summaryInputEl = $( '<input type="text" value="' + this.model.get( 'summary' ) + '" />' );
		var statusEl = this.statusEl = $( '<span class="status ' + ( this.model.isComplete() ? '' : 'todo' ) + '">' + ( this.model.isComplete() ? 'DONE' : 'TODO' ) + '</span>' );

		summaryInputEl.bind( 'blur', { view: that }, this.onInputBlur );
		summaryInputEl.bind( 'keydown', { view: that }, this.onInputKeyDown );
		statusEl.bind( 'click', { view: that }, this.onClickStatus );

		$( this.el )
			.append( statusEl )
			.append( summaryEl )
			.append( summaryInputEl.hide() )
			.append( deleteButtonEl );

		return this;

	},

	render: function() {

		if ( this.model.id && !$( this.el ).hasClass( 'task-' + this.model.id ) ) {
			$( this.el ).addClass( 'task-' + this.model.id );
		}

		var summary = this.model.get( 'summary' );
		this.summaryEl.html( summary );
		this.summaryInputEl.val( summary );
		this.summaryInputEl.attr( 'size', Math.min( this.inputMaxSize, Math.max( this.inputMinSize, summary.length + Number( summary.length * 0.1 ) ) ) );
		if ( this.model.isComplete() ) {
			this.statusEl.html( 'DONE' );
			this.statusEl.removeClass( 'todo' );
		}
		else {
			this.statusEl.html( 'TODO' );
			this.statusEl.addClass( 'todo' );
		}

		return this;

	},

	onClickStatus: function( e ) {
		e.preventDefault();
		e.stopPropagation();
		var model = e.data.view.model;
		if ( model.isComplete() ) {
			model.clearCompleted();
		}
		else {
			model.setCompleted();
		}
		return this;
	},

	onInputBlur: function( e ) {
		e.data.view.saveSummary();
		return this;
	},

	onInputKeyDown: function( e ) {
		$( this ).attr( 'size', Math.min( e.data.view.inputMaxSize, Math.max( e.data.view.inputMinSize, $( this ).val().length + Number( $( this ).val().length * 0.1 ) ) ) );
		if ( e.which == 13 ) {
			e.data.view.saveSummary();
		}
		return this;
	},

	saveSummary: function() {
		var newSummary = this.summaryInputEl.val().trim();
		if ( this.model.get( 'summary' ) != newSummary ) {
			this.model.save( { summary: newSummary } );
		}
		this.finishedEditingSummary();
		return this;
	},

	editSummary: function() {
		this.summaryEl.hide();
		this.summaryInputEl.show().focus();
		return this;
	},

	finishedEditingSummary: function() {
		this.summaryInputEl.hide();
		this.summaryEl.show();
		return this;
	},

	onClick: function() {
		this.editSummary();
		return this;
	},

	onClickDelete: function( e ) {
		e.preventDefault();
		e.stopPropagation();
		var doDelete = window.confirm( "Confirm delete task ID# " + this.model.id );
		if ( doDelete ) {
			this.model.destroy();
			this.close();
		}
		return this;
	},

} );