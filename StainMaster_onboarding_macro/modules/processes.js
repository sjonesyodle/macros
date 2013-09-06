var fs = require('fs'); 
module.exports = {


	goToNewOpportunityScreen : function () {
		var 
		uri = "https://na4.salesforce.com/setup/ui/recordtypeselect.jsp?ent=Opportunity&retURL=%2F006%2Fo&save_new_url=%2F006%2Fe%3FretURL%3D%252F006%252Fo";

		this.casper.thenOpen( uri, function(){
			this.capture("testing.jpg");
		});
	},

	chooseOpportunityType : function () {
		var that = this;

		that.casper.then(function(){
			this.capture("testing2.jpg");


			// var
			// formNode = "#editPage";

			// this.echo( this.getCurrentUrl() );

			// this.capture("testing.jpg");

			// // if ( !this.exists(formNode) ) that.kill(formNode + " does not exist");

			// // this.fillSelectors("#editPage", {
			// // 	"#p3" : "012600000009YRE" // YBN - Initial Transaction
			// // }, true);
		});
	},


};