module.exports = {

    objValsToStrings : function ( obj ) {
        var i;
        for ( i in obj ) {
            obj[i] = obj[i].toString();
        }
        return obj;
    }

};