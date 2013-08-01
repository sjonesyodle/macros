var processes = {

	login : require("./login"),

	goToWebsiteSpecs : function ( cid ) {
		var accountInfoPage = "http://live.yodle.com/app/internal/clientmanagement/accountinfo?clientId=" + cid;

		this.casper.thenOpenAndEvaluate( accountInfoPage , function( accountInfoPage ){
			__utils__.echo(" ---- Entered account page @ ----> " + accountInfoPage);
			__utils__.mouseEvent("click", "a[href*=websitespecs]");
		}, accountInfoPage);
	},

	setSiteImplementationType : function () {
		this.casper.then(function(){
			var page = this.getCurrentUrl();

			var domOperations = this.evaluate(function( page ){
				var
				util      = __utils__,

				updateNode = "#siteImplType",
				updateVal  = "CLIENT_HOSTED",

				passed = false;

				util.echo("--- Updating Implemetation Type @ --->" + page);

				if ( util.exists( updateNode ) ) {

					updateNode = util.findOne( updateNode );

					util.echo("Changing value to '" + updateVal + "'");

					updateNode.value = updateVal;

					util.echo("Change complete. New value is '"+ updateNode.value +"'");

					passed = true;
				}
				
				return passed;

			}, page );

			if ( !domOperations ) this.die("Failed @ --> " + page);

		});
	},

	saveImplementationType : function () {

		this.casper.thenEvaluate(function(){
			__utils__.mouseEvent("click", ".special button[onclick*='showModal']" );
		});

		this.casper.wait(5000, function(){
			this.capture("testing.jpg");
		});

		
		this.casper.waitUntilVisible("button.positive", function(){
			
			if ( this.click("button.positive") ) {
				this.echo("Save button clicked..");
			}

		}, function(){
			this.die("Modal window never showed. Dead.");
		}, 10000);


		this.casper.wait(8000, function(){

			var test = this.evaluate(function(){
				var val = (document.querySelectorAll("#implType")[0].innerHTML).toLowerCase();
				return val.indexOf("client") > -1;
			});

			if ( !test ) this.die("Update Failed");
			else this.echo("UPDATE COMPLETE :)");
		});

	}
};

module.exports = function ( casper ) {
	return { 
		casper                    : casper, 
		login                     : processes.login,
		goToWebsiteSpecs          : processes.goToWebsiteSpecs,
		setSiteImplementationType : processes.setSiteImplementationType,
		saveImplementationType    : processes.saveImplementationType
	};
};