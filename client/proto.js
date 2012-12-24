/*  
 *  Array prototype additions
 */

Array.prototype.diff = function( a ) {
    return this.filter( function( i ) { return !( a.indexOf( i ) > -1 ); } );
};

Array.prototype.alphanumSort = function( caseInsensitive ) {

	for ( var z = 0, t; t = this[z]; z++ ) {
		this[z] = [];
		var x = 0, y = -1, n = 0, i, j;
		while (i = ( j = t.charAt( x++ ) ).charCodeAt( 0 ) ) {
			var m = ( i == 46 || ( i >=48 && i <= 57 ) );
			if ( m !== n ) {
				this[z][++y] = "";
				n = m;
			}
			this[z][y] += j;
		}
	}

	this.sort( function( a, b ) {
		for ( var x = 0, aa, bb; ( aa = a[x] ) && ( bb = b[x] ); x++ ) {
			if ( caseInsensitive ) {
				aa = aa.toLowerCase();
				bb = bb.toLowerCase();
			}
			if ( aa !== bb ) {
				var c = Number( aa ), d = Number( bb );
				if ( c == aa && d == bb ) {
					return c - d;
				} else {
					return ( aa > bb ) ? 1 : -1;
				}
			}
		}
		return a.length - b.length;
	} );

	for ( var z = 0; z < this.length; z++ ) {
		this[z] = this[z].join( "" );
	}

}

/*  
 *  String prototype additions
 */

String.prototype.repeat = function( num ) {
	return new Array( num + 1 ).join( this );
}

/*  
 *  Backbone prototype overrides
 */

// Re-define view prototype function 'close'
Backbone.View.prototype.close = function() {

	this.remove();
	this.undelegateEvents();

	if ( this.onClose ) {
		this.onClose();
	}

	if ( this.destroy ) {
		this.destroy();
	}

};

// Re-define collection prototype function 'fetch'
var bbCollectionFetch = Backbone.Collection.prototype.fetch;
Backbone.Collection.prototype.fetch = function( options ) {
	bbCollectionFetch.apply( this, arguments );
};

// Re-define model prototype function 'fetch'
var bbModelFetch = Backbone.Model.prototype.fetch;
Backbone.Model.prototype.fetch = function( options ) {
	bbModelFetch.apply( this, arguments );
};

// Re-define collection prototype function 'parse'
Backbone.Collection.prototype.parse = function( resp, xhr ) {
	return resp;
};

// Re-define model prototype function 'parse'
Backbone.Model.prototype.parse = function( resp, xhr ) {
	return resp;
};

// var bbSync = Backbone.prototype.sync;
// Backbone.sync = function( method, model, options ) {
// 	return bbSync.apply( this, arguments );
// };