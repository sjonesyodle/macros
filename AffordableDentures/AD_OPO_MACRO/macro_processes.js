var util = {
	trim : function ( str ) {
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}
};

var processes = {

	login : require("./login"),

	goToLocationEditor : function ( entry_id ) {
		this.casper.thenOpen( "http://www.affordabledentures.com/system/index.php?S=0&C=edit&M=edit_entry&weblog_id=22&entry_id=" + util.trim( entry_id ) );
		return this;
	},

	verifyEditorFieldsExist : function ( model ) {
		this.casper.then(function(){

			var test = this.evaluate(function( model ){
				var i, prop, util = __utils__, err = [];

				for ( i in model ) {
					prop = model[i];

					if ( !!prop.required && prop.node ) {
						if ( !util.exists( prop.node ) ) {
							err.push( prop.node );
						}
					}
				}

				if ( err.length > 0 ) {
					i = 0;
					for ( ; i < err.length; i++ ) {
						util.echo("Node not found : " +  err[i] );
					}
					return false;
				}

				return true;
			}, model );

			if ( !test ) this.die("verifyEditorFieldsExist (test) FAILED! @ " + this.getCurrentUrl());
			else this.echo(" #verifyEditorFieldsExist (test) PASSED @ " + this.getCurrentUrl());
		});

		return this;
	},	

	verifyOPOFieldsExist : function ( record, model ) {
		this.casper.then(function(){

			var i, curr, err = [];

			for ( i in model ) {
				curr = model[i];

				if ( !!curr.required && !(i in record) ) {
					err.push( i );
				}
			}

			if ( err.length > 0 ) {

				this.echo("verifyOPOFieldsExist (test) FAILED @ " + this.getCurrentUrl());
				this.echo("Missing Fields ->");
				i = 0;
				for ( ; i < err.length; i++ ) {
					this.echo( err[i] );
				}

				this.die("STOPPING - MANUAL FIX NEEDED");
			}

			this.echo(" #verifyOPOFieldsExist (test) PASSED @ " + this.getCurrentUrl());

		});

		return this;
	},

	doOPO : function ( record, model ) {

		this.casper.then(function(){

			var o = {}, i, err = false;

			this.echo(" #Starting OPO @ " + this.getCurrentUrl());

			for ( i in model ) {
				if ( "node" in model[i] ) {
					o[ model[i].node ] = record[i];
				}
			}

			for ( i in o ) {
				if ( !this.exists( i ) ) {
					this.echo( i + " doesnt exist in dom!" );
					err = true;
				}
			}

			if ( !!err ) this.die("Nodes missing @ " + this.getCurrentUrl());

			this.fillSelectors("#entryform", o);
			this.echo(" #Finishing filling out fields...");

			return this;
		});

		return this;
	},

	saveOPO : function () {
		this.casper.then(function(){
			this.echo(" #Saving OPO @ " + this.getCurrentUrl());
			this.click(".submit");
		});

		return this;
	},

	qualityCheck : function ( record, model ) {
		this.casper.then(function(){
			var i, nodeVal, err = [];

			this.echo("test");

			for ( i in model ) {
				nodeVal = util.trim( document.querySelectorAll(model[i].node).innerHTML );
				this.echo( nodeVal );
			}

			return this;

		});
	}

};

module.exports = function ( casper ) {
	return { 
		casper                  : casper, 
		login                   : processes.login,
		goToLocationEditor      : processes.goToLocationEditor,
		verifyEditorFieldsExist : processes.verifyEditorFieldsExist,
		verifyOPOFieldsExist    : processes.verifyOPOFieldsExist,
		doOPO                   : processes.doOPO,
		saveOPO                 : processes.saveOPO,
		qualityCheck            : processes.qualityCheck
	};
};