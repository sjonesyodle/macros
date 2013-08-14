module.exports = {

	validateRecord : function () {
		var that = this;
		that.casper.then(function(){
			this.echo( that.record );
		});

		return this;
	},

	goToCallTrackingGUI : function () {
		var casper = this.casper;
		casper.thenOpen("http://live.yodle.com/app/clientconfig/leadrouting?clientId=" + this.record.client_id, function(){
			var btn = "a[onclick*='showAddNumberDialog']";

			this.echo("goToCallTrackingGUI @ " + this.getCurrentUrl() );

			if ( !(this.exists( btn )) ) this.die("Add a new number button does not exist");

			this.click(btn);
			this.echo("Opening call tracking popup...");

		});

	},

	provisionCTN : function () {
		var
		that   = this, 
		casper = this.casper,

		addDestNumber = function () {
			var test;
			this.echo("adding destination number");

			test = this.evaluate(function(primaryNumber){
				var node = document.querySelectorAll("#routingNumber")[0];
				node.value = primaryNumber;
				return node.value;
			}, primaryNumber);

			if ( test !== primaryNumber ) {
				that.kill("Destination number did not update");
			}
		},

		setBillingOption = function () {
			var test, setting = "false";
			this.echo("setting billing option");
			test = this.evaluate(function(setting){
				var node = document.querySelectorAll("#billedFor1")[0];
				node.value = setting;
				return node.value;
			}, setting);

			if ( test !== setting ) {
				that.kill("error setting billing option");
			}
		},	

		queryForLocalNum = function () {
			this.echo("Check for local numbers ->");

			if ( !this.exists("#radio-local") ) {
				that.kill("#radio-local does not exist");
			}

			if ( !this.exists("button[onclick*='retrieveFilteredCallTrackingNumbers']") ) {
				that.kill("button[onclick*='retrieveFilteredCallTrackingNumbers'] does not exist");
			}

			this.click("#radio-local");
			this.click("button[onclick*='retrieveFilteredCallTrackingNumbers']");
		},

		queryForTollFreeNum = function () {
			localAreaCode = false;

			this.echo("Check for toll free numbers ->");
			this.click("#radio-tollfree");
			this.click("button[onclick*='retrieveFilteredCallTrackingNumbers']");
			this.echo("Waiting for local numbers");
		},

		setAreaCode = function () {
			var localNum;

			if ( !this.exists("#area_code_entry") ) {
				that.kill("area code box not in dom");
			} 

			localNum = this.evaluate(function( localNum ) {
				var node = document.querySelectorAll("#area_code_entry")[0];
				node.value = localNum;
				return node.value;
			}, localAreaCode);

			if ( localNum !== localAreaCode ) {
				that.kill("Area code did not update");
			}

			this.echo( "local area code : " + localAreaCode );
		},

		checkQueryResults = function () {
			var test = this.evaluate(function( localAreaCode ){
				var 
				list = document.querySelectorAll(".phone-number label"),
				phoneVal, start, html;

				__utils__.echo( "list length " + list.length);

				// **first item in collection does not have a phone #**
				if ( !list || list.length < 2 ) return false;

				html     = (list[1].innerHTML).trim();
				start    = html.length - 10;
				phoneVal = html.slice( start ); // extract phone # from end of string

				return phoneVal;

			}, localAreaCode);

			if ( !!test ) {
				success = true;
				that.CTN = test;
				this.echo("Number to provision : " + that.CTN );
			}
			else {
				this.echo("checkQueryResults failed");
			}
		},

		attemptProvision = function () {
			var okBtn = "#ok-button";

			if ( !success ) return;

			if ( this.exists( okBtn ) ) {
				provisioned = true;
				this.click( okBtn );
				this.echo("---- Provisioning : " + that.CTN);
			}
		},

		moveToCTNConfigScreen = function () {
			var nodeHref = this.evaluate(function( CTN ){
				var 
				ctns = document.querySelectorAll("a[href*='leadrouting/number/update?callTrackingNumberConfigurationId']"),
				num, i, l, nodeHref;

				CTN = CTN.trim();

				__utils__.echo( "CTN : " + CTN );

				__utils__.echo( ctns.length );

				i = 0;
				l = ctns.length;
				for ( ; i < l; i += 1 ) {
					num = (ctns[i].innerHTML).trim();

					__utils__.echo( i );
					__utils__.echo( num );

					if ( CTN === num ) {
						__utils__.echo( "MATCH" );
						nodeHref = (ctns[i].href).trim();
						__utils__.echo( nodeHref );

						break;
					}
				}

				return nodeHref;

			}, that.CTN);

			this.capture("testing.jpg");


			if ( !!nodeHref ){
				casper.thenOpen( nodeHref );
			} 
			else {
				that.kill("Issue finding CTN in phone list");
			}

		},

		pause = function ( duration ) {
			casper.wait(duration);
		},

		primaryNumber = (this.record.primaryphonenumber).trim(),
		localAreaCode = (primaryNumber.slice(0,3)).trim(),
		success       = false,
		provisioned   = false;

		//--------------------------------------------

		casper.then( setAreaCode );
		casper.then( addDestNumber );	
		casper.then( setBillingOption );

		casper.then( queryForLocalNum );
		pause( 6000 );
		casper.then( checkQueryResults );
		casper.then( attemptProvision );

		casper.thenBypassIf(function(){
			return !!provisioned;
		}, 3);

		casper.then( queryForTollFreeNum );
		pause( 6000 );

		casper.then( checkQueryResults );
		casper.then( attemptProvision );

		// will fail here if last attempt fails since uri will not change
		casper.waitForUrl(/leadrouting\?status=/, moveToCTNConfigScreen , function(){
			that.kill("page timeout after provisioning");
		}, 60000);

		casper.then(function(){
			this.capture("testing.jpg");
		});

	},

	configureCTN : function () {
		var
		that   = this,
		casper = that.casper,

		setAttributionType = function () {
			var selectNode = "#attributionType", setVal = "CUSTOM", test;

			if ( !this.exists( selectNode ) ) that.kill("attribution type node doesnt exist");

			this.echo("setting attribution type");

			test = this.evaluate(function(selectNode,setVal){
				var node = document.querySelectorAll(selectNode)[0];
				node.value = setVal;
				return node.value;
			},selectNode, setVal);

			if ( test !== setVal ) that.kill("error setting attribution type");
		},

		setDescription = function () {
			this.evaluate(function(){
				__utils__.echo("setting description");
				document.getElementById("customName").value = "YDN3";
				document.getElementById("description").value = "YDN3";
			});
		},

		setGroupId = function () {
		    this.evaluate(function(){
		    	__utils__.echo("setting setGroupId");
				document.getElementById("customId").value = "YDN3";
			});
		},

		setUriParams = function () {
			this.click("#customDetectionType2");
			this.evaluate(function(){
				__utils__.echo("setting setUriParams");
				document.getElementById("parameterDetectionKey").value = "source";
				document.getElementById("parameterDetectionValue").value = "fx";
			});
		},

		setReferrals = function () {
			this.evaluate(function(){
				__utils__.echo("setting setReferrals");
				document.getElementById("customPrimaryAttribution").value = "paid";
				document.getElementById("customSecondaryAttribution").value = "fx";
			});
		},

		save = function () {
			this.echo("saving changes");
			this.click("#saveChanges");
		};

		casper.then( setAttributionType );
		casper.wait(3000);

		casper.then(setDescription);
		casper.then(setGroupId);
		casper.then(setUriParams);
		casper.then(setReferrals);
		casper.then(save);

		casper.waitForUrl(/leadrouting\?clientId=/, function(){
			this.capture("testing.jpg");
		} , function(){
			that.kill("page timeout after configuration");
		}, 60000);
	}

};