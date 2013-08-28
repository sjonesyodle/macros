Object.create = Object.create ? Object.create :
(function(){
    var F = function () {};
    return function ( o ) {
     F.prototype = o;
      return new F();
    };
}());

var Macro = (function () {
    var proto = {

        code : function ( command ) {
            var i, l, nl = "\n";

            if ( typeof command === "string" ) {
                this.queue.push( command + nl );
                return this;
            }

            if ( typeof command === "object" ) { // array of commands

                i = 0;
                l = command.length;
                for ( ; i < l; i += 1 ) {
                    this.queue.push( command[i] + nl );
                }
            }

            return this;
        },

        run : function () {
           iimPlay("CODE:" + this.queue.join(""));
        }

    };

    return function () {
        var macro = Object.create( proto );
            macro.queue = [];
        return macro;
    };

}());

//------------------------------------------------
//------------------------------------------------



//:::::::::::::::::::::
//CONSTANTS


var Yodle_Creds = {
    user : "kturk@yodle.com",
    pass : "Sebago1985"
};





//:::::::::::::::::::::
//Procedures ->


//Log in to Yodle Live
(function(){


}());



//User Roles
(function(){


}());



// Report Settings
(function(){


}());



// Call Tracking
(function(){


}());















