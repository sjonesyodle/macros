module.exports = {

	objSize : function (O) {
        var size = 0,
            i;
        for (i in O) {
            if (O.hasOwnProperty(i)) {
                size++;
            }
        }
        return size;
    },

    removeSpecChars : function ( str, nospaces ) {
        var regex = !nospaces ? /[^\w\s]/gi : /[^\w]/gi;
        return str.replace(regex, '');
    },

    removeTerms : function (str, terms) {
        str = str.split(" ");

        terms.forEach(function(term, i){
            term = term.trim();

            str.forEach(function(frag, i, arr){
                frag = frag.trim();

                if ( frag === term ) {
                    arr[i] = "";
                }
            });

        });
        return str.join(" ");
    },

    inArray : function (prop, arr) {
        var found = false;
        prop = prop.trim();
        arr.forEach(function(el, i, arr){
            el = el.trim();
            if ( prop === el ) found = true;
        });
        return found;
    }
	
};	