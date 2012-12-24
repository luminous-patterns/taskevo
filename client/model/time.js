taskevo.Models.Time = Backbone.Model.extend( {

	defaults: {
		init_time:       null,
	},

	initialize: function() {
		this.set( 'init_time', new Date() );
	},

	sinceInit: function() {
		return ( ( new Date() ).getTime() - this.get( 'init_time' ).getTime() ) / 1000;
	},

} );