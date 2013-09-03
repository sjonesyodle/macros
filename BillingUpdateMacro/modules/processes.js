var fs = require('fs'); 
module.exports = {

	goToAccountInfoGUI : function () {
		var 
		that   = this,
		casper = that.casper,
		uri    = "http://live.yodle.com/app/internal/clientmanagement/accountinfo?clientId=" + (that.record.client_id).trim();

		casper.thenOpen( uri, function(){
			// this.echo(this.getCurrentUrl());
		});
	},

	openBillingEditPopup : function () {
		var 
		that   = this,
		casper = that.casper,
		node  = "button[onclick*='AdBudget']";

		casper.then(function(){

			if ( !this.exists( node ) ) {
				that.kill("Click Error -> " + node + " not found in DOM");
			}

			this.click("button[onclick*='AdBudget']");
			this.echo("Opening billing popup @ " + this.getCurrentUrl());
		});

		casper.wait(2000).waitUntilVisible("#newClientBillDay", function(){
			this.echo("Billing popup open @ " + this.getCurrentUrl());
		}, function(){
			that.kill("#newClientBillDay " + "never became visible in DOM");
		}, 6000); // wait for popup (manual)

	},

	setBillingDate : function () {
		var
		that     = this,
		casper   = that.casper,
		billDate =  "1",
		node     = "#newClientBillDay";

		casper.then(function(){
			if (!(this.exists(node))) that.kill(node+" does not exist in DOM");

			this.echo("Setting bill date..");

			var test = this.evaluate(function(node,val){
				var elem = document.querySelectorAll(node)[0];
				elem.value = val;
				return elem.value;
			}, node, billDate);

			if ( test !== billDate ) that.kill(node+" value was not updated to " + billDate);

			this.echo("Billing date updated");
		});
	},

	saveBillingChanges : function () {
		var
		that     = this,
		casper   = that.casper,
		node     = "button[onclick*='changeClientBilling']",
		updateMsgNode = "#clientBillingChangeMessage";

		casper.then(function(){
			if (!(this.exists(node))) that.kill(node+" does not exist in DOM");
			this.click(node);
			this.echo("Save billing updates..");
		});

		casper.wait(4000);

		casper.reload(function(){
			var 
			billDate =  "1",
			node     = "#newClientBillDay";

			var test = this.evaluate(function(node){
				return document.querySelectorAll(node)[0].value;
			}, node);

			this.echo("Billing date is " + test);

			if ( test !== billDate ) that.kill(node+" value was not updated to " + billDate);
		});
	}

};