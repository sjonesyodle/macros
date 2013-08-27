module.exports = {

	nodeIndex : function ( selector, levelsUp ) {
		var node, i;
   
	    if ( !selector ) return -1;
	    
	    node = document.querySelectorAll( selector.trim() )[0];
	    
	    if ( !node ) return -1;
	    
	    if ( typeof levelsUp === "number" ) {
	        
	        while( levelsUp > 0 ) {
	            levelsUp--;
	            node = node.parentNode;
	        }
	        
	    }
	    
	    i = 0;
	    while ( node.previousSibling ) {
	        i++;
	        node = node.previousSibling;
	    }

	    return i;
	},

	arr2Obj : function ( arr ) {
		var i = 0, l = arr.length, ret = {};
		for ( ; i < l ; i++ ) {
			ret[ arr[i] ] = i;
		}
		return ret;
	}

};