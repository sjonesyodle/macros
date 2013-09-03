var fs = require("fs");

var data = JSON.parse( fs.readFileSync("./resources/data.json") );

var results = "";

var dupes = {};

data.forEach(function( el ){

	if ( !dupes[el.referral] ) {
		dupes[el.referral] = true;
		results += el.referral + "\n";
	}
});

fs.writeFile("test.txt", results, "utf8");
 
