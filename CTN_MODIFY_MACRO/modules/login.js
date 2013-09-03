var accounts = {

	yodlelive : {
		uri : "http://live.yodle.com",

		creds : {
			un  : "sjones@yodle.com",
			pw  : "sjYDL123!!"
		},
		
		nodes : {
			root : "#loginForm",
			un   : "input[name='j_username']",
			pw   : "input[name='j_password']"
		}
	},

	salesforce : {
		uri : "https://login.salesforce.com",

		creds : {
			un  : "sjones@yodle.com",
			pw  : "sjYDL123!!"
		},
		
		nodes : {
			root : "form[name='login']",
			un   : "#username",
			pw   : "#password"
		}
	}
};

module.exports = function ( account, casper ) {
	if ( !( account in accounts ) ) return;

	account = accounts[account];

	casper
	.start( account.uri )
	.then(function(){
		this.echo(" #Entry Point @  " + this.getCurrentUrl() );	
	})
	.waitForSelector( account.nodes.root , function(){
			var login = {};
			login[ account.nodes.un ] = account.creds.un;
			login[ account.nodes.pw ] = account.creds.pw;
			return this.fillSelectors(account.nodes.root, login , true);
	})
	.then(function(){
		this.echo(" #Logged in @ " + this.getCurrentUrl() );
	});
};