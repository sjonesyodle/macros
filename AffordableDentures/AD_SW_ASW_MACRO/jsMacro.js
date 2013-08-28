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


// Execution Context
;(function(){
    var
    SF = {

        login : function ( creds ) {
            var macro;

            if ( !creds ) return;

            macro = Macro();

            macro
            .code([
                "URL GOTO=http://www.salesforce.com",
                "TAG POS=1 TYPE=A ATTR=ID:button-login",
                "TAG POS=1 TYPE=INPUT FORM=NAME:login ATTR=ID:username CONTENT="+ creds.user,
                "TAG POS=1 TYPE=INPUT FORM=NAME:login ATTR=ID:password CONTENT="+ creds.pass,
                "TAG POS=1 TYPE=BUTTON ATTR=ID:Login"
            ])
            .run();
        }

    };


    SF.login({ user : "sjones@yodle.com", pass : "sjYDL123!" });


}());



