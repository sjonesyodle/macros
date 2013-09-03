module.exports = {

	trim : function ( str ) {
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	},

	merge : function ( obj1, obj2 ) {
		var i;

		for ( i in obj2 ) obj1[i] = obj2[i];

		return obj1;
	}
};