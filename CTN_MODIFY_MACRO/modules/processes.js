var fs = require('fs'); 
module.exports = {

	validateRecord : function () {
		var that = this;
		that.casper.then(function(){
			this.echo( that.record );
		});

		return this;
	},

	goToCTOverviewGUI : function () {
		var casper = this.casper;
		casper.thenOpen("http://live.yodle.com/app/clientconfig/leadrouting?clientId=" + this.record.client_id, function(){
		});
	},

	findCTNAndGoToCfgGUI : function () {
		var 
		that   = this,
		casper = that.casper;

		casper.then(function(){
			var CTN = that.record.call_tracking_number;

			var nodeHref = this.evaluate(function( CTN ){
				var 
				ctns = document.querySelectorAll("a[href*='leadrouting/number/update?callTrackingNumberConfigurationId']"),
				num, i, l, nodeHref = false;

				CTN = CTN.trim();

				__utils__.echo( "CTN : " + CTN );

				i = 0;
				l = ctns.length;
				for ( ; i < l; i += 1 ) {
					num = (ctns[i].innerHTML).trim();

					__utils__.echo( i );
					__utils__.echo( num );

					if ( CTN === num ) {
						__utils__.echo( "MATCH!" );
						nodeHref = (ctns[i].href).trim();
						break;
					}
				}

				return nodeHref;

			}, CTN);

			if ( !nodeHref ) that.kill("CTN match for " + CTN + " was not found. Exiting." );
			that.record.cfgURI = nodeHref.trim();

		});
	},

	goToCtnCfgGUI : function () {
		var casper = this.casper;
		casper.thenOpen(this.record.cfgURI.trim(), function(){
		});
	},

	configureCTN : function () {
		var
		that   = this,
		casper = that.casper,

		setAttributionType = function () {
			var selectNode = "#attributionType", setVal = "CUSTOM", test;

			if ( !this.exists( selectNode ) ) that.kill("attribution type node doesnt exist");

			this.echo("setAttributionType()");

			test = this.evaluate(function(selectNode,setVal){
				var node = document.querySelectorAll(selectNode)[0];
				node.value = setVal;
				return node.value;
			},selectNode, setVal);

			if ( test !== setVal ) that.kill("error setting attribution type");
		},

		setCustomPhoneGroupDescription = function () {
			var data = that.record.description_custom_phone_group.trim();

			this.echo("setCustomPhoneGroupDescription()");

			var test = this.evaluate(function(data){
				var node = document.getElementById("customName");
				node.value = data;
				return node.value;
			}, data );

			if ( test !== data ) that.kill("error @ setCustomPhoneGroupDescription()");
		},

		setDescription = function () {
			var data = that.record.description.trim();

			this.echo("setDescription()");

			var test = this.evaluate(function(data){
				var node = document.getElementById("description");
				node.value = data;
				return node.value;
			}, data);

			if ( test !== data ) that.kill("error @ setDescription()");
		},

		setGroupId = function () {
			var data = that.record.custom_group_id.trim();

			this.echo("setGroupId()");

		    var test = this.evaluate(function(data){
		    	var node = document.getElementById("customId");
				node.value = (new Date().getTime()) + "_" + data; // must be unique so prepending a timestamp
				return node.value;
			}, data);

			if ( test.indexOf(data) < 0 ) that.kill("error @ setGroupId()");
		},

		selectLandingPageUrl = function () {

			this.echo("selectLandingPageUrl()");

			var test = this.evaluate(function(){
				var node = document.getElementById("customDetectionType1");
				node.checked = true;
				return node.checked;
			});

			if ( !test ) that.kill("error @ selectLandingPageUrl()");
		},

		setLandingPageUrl = function () {
			var data = that.record.landing_page_url.trim();

			this.echo("setLandingPageUrl()");

			var test = this.evaluate(function(data){
		    	var node = document.getElementById("urlDetectionKey");
				node.value = data;
				return node.value;
			}, data);

			if ( test !== data ) that.kill("error @ setLandingPageUrl()");

		},

		setUriParams = function () {
			this.click("#customDetectionType2");
			this.evaluate(function(){
				document.getElementById("parameterDetectionKey").value = "source";
				document.getElementById("parameterDetectionValue").value = "fx";
			});
		},

		turnOffWhisper = function () {

			this.echo("turnOffWhisper()");

			var test = this.evaluate(function(){
				var node = document.getElementById("whisperOn1");
				node.checked = false;
				return node.checked;
			});

			if ( !!test ) that.kill("error @ turnOffWhisper()");
		},

		setReferrals = function () {
			var referral     = that.record.referral.trim();
			var sub_referral = that.record.sub_referral.trim();
			var test;

			this.echo("setReferrals()");

			test = this.evaluate(function(referral){
				var node = document.getElementById("customPrimaryAttribution");
				node.value = referral;
				return node.value;
			},referral);

			if ( test !== referral ) that.kill("error @ setReferrals()");

			test = this.evaluate(function(sub_referral){
				var node = document.getElementById("customSecondaryAttribution")
				node.value = sub_referral;
				return node.value;
			},sub_referral);

			if ( test !== sub_referral ) that.kill("error @ setReferrals()");	
		},

		dontCountTowardsLeads = function () {
			this.echo("dontCountTowardsLeads()");

			var test = this.evaluate(function(){
				var node = document.getElementById("callTrackingOn2");
				node.checked = true;
				return node.checked;
			});

			if ( !test ) that.kill("error @ dontCountTowardsLeads()");
		},

		turnBillingOff = function () {
			var test;

			this.echo("turnBillingOff()");

			test = this.evaluate(function(){
				var node = document.getElementById("billedFor1");
				node.checked = false;
				return node.checked;
			});

			if ( !!test ) that.kill("error @ turnBillingOff()");

			test = this.evaluate(function(){
				var node = document.getElementById("test1");
				node.checked = false;
				return node.checked;
			});

			if ( !!test ) that.kill("error @ turnBillingOff()");
		},

		save = function () {
			this.echo("saving changes");
			this.click("#saveChanges");
		};

		casper.then(function(){
			this.echo("Working on " + that.record.client_id);
		});

		casper.then( setAttributionType );
		casper.wait(3000);
		casper.then( setCustomPhoneGroupDescription );
		casper.then( setGroupId );
		casper.then( selectLandingPageUrl );
		casper.then( setLandingPageUrl );
		casper.then( setReferrals );
		casper.then( setDescription );
		casper.then( turnOffWhisper );
		casper.then( dontCountTowardsLeads );
		casper.then( turnBillingOff );

		casper.then(save);

		casper.then(function(){
			this.capture("test.jpg");
		});

		casper.waitForUrl(/leadrouting\?clientId=/, function(){

		} , function(){
			that.kill("page timeout after configuration");
		}, 60000);
	}

};