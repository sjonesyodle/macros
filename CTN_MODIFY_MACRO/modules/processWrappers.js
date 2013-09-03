module.exports = {

	// goToCallTrackingGUI : {

	// 	after : function () {
	// 		this.casper.then(function(){
	// 			this.echo("executing after goToCT_GUI");
	// 		});
	// 	}

	// }

	provisionCTN : {
		before : function () {
			var casper = this.casper;
			casper.waitUntilVisible("#addCallTrackingNumberForm", function(){
				this.echo("Call tracking form is open");
			}, function(){
				this.die("Call tracking popup never become visible!");
			}, 10000);
		}
	}

};