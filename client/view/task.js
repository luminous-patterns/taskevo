taskevo.Views.Task = Backbone.View.extend( {

	tagName: "li",

	className: "task",

	events: {
		'click':           'onClick',
		'click .delete':   'onClickDelete',
	},

	initialize: function() {

		var that = this;

		// Events
		this.model.on( 'change', this.render, this );

		// Elements
		var deleteButtonEl = this.deleteButtonEl = $( '<a href="#" class="delete">DELETE</a>' );

		$( this.el )
			.append( this.model.get( 'summary' ) )
			.append( deleteButtonEl );

		return this;

	},

	render: function() {

		if ( this.model.id && !$( this.el ).hasClass( 'task-' + this.model.id ) ) {
			$( this.el ).addClass( 'task-' + this.model.id );
		}

		return this;

	},

	onClick: function() {
		alert( 'clicked on task #' + this.model.id );
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