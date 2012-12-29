taskevo.Views.Lists = Backbone.View.extend( {

	tagName: "div",

	className: "list-container",

	initialize: function() {

		var that = this;

		// Lists area
		var listsEl = this.listsEl = $( '<ol class="lists"></ol>' );
		var addListFormEl = this.addListFormEl = $( '<form></form>' );
		var listTitleEl = this.listTitleEl = $( '<input value="" />' );
		var listSubmitEl = this.listSubmitEl = $( '<button>Create list</button>' );
		addListFormEl.on( 'submit', { view: that }, this.onSubmitListForm );

		addListFormEl
			.append( listTitleEl )
			.append( listSubmitEl );

		$( this.el )
			.append( addListFormEl )
			.append( listsEl );

		return this;

	},

	render: function() {
		return this;
	},

	onSubmitListForm: function( e ) {

		e.preventDefault();

		var view = e.data.view;
		var title = view.listTitleEl.val().trim();
		
		if ( !title ) {
			return;
		}
		
		taskevo.user.createList( { title: title } );
		view.listTitleEl.val( '' );
		
		return this;
	
	},

	onAddList: function( list ) {
		return this.addListEl( list );
	},

	addListEl: function( list ) {

		var that = this;
		var listsEl = this.listsEl;
		var listEl = $( '<li class="list-' + list.id + '">' + list.get( 'title' ) + '</li>' );

		var data = { list: list, view: that };
		var onClick = function( e ) {
			e.data.view.options.stage.tasks.loadTasks( e.data.list.id );
			console.log( 'clicked on list #' + e.data.list.id );
		};

		listEl.bind( 'click', data, onClick );

		listsEl.append( listEl );

		return this;

	},

	onLoadLists: function() {

		var listsEl = this.listsEl;
		var lists = taskevo.user.lists;

		listsEl.html( '' );

		for ( var i = 0; i < lists.length; i++ ) {
			this.addListEl( lists.at( i ) );
		}

		return this;

	},

} );