var fs = require("fs"); 
var AD = require("./AD");

var AD_KEY  = JSON.parse( fs.readFileSync("AD_KEY.json", "utf8") );
var AD_DATA = JSON.parse( fs.readFileSync("AD_DATA.json", "utf8") );


if ( AD_KEY.length !== AD_DATA.length ) {
	console.log("Record lengths do not match.. \n");
	console.log("AD_KEY => " + AD_KEY.length );
	console.log("AD_DATA => " + AD_DATA.length );
	throw new Error ("Record lengths do not match..");
}

var recordLen = ((AD_KEY.length + AD_DATA.length) / 2 );
console.log("Record Length : " + recordLen );

var CID_GROUPS_FACTORY = {
	groupKey : "client_id",
	groupSize : recordLen,
	needleSetKey : "AD_KEY",
	masterSetKey : "AD_DATA"
};

var CID_GROUPS, CID_GROUPS_STATIC;

CID_GROUPS = AD.createCIDGroups( AD_KEY, AD_DATA, CID_GROUPS_FACTORY );

CID_GROUPS_STATIC = JSON.parse( JSON.stringify( CID_GROUPS ) );


AD.santizeCID_GROUPS(
	CID_GROUPS,
	[
		"doctor",
		"geo",
		"service_content1",
		"service_content2",
		"service_content3",
		"homepage_title",
		"homepage_meta",
		"h1_content1",
		"service_page_title1",
		"service_page_meta1",
		"h1_content2",
		"service_page_title2",
		"service_page_meta2",
		"h1_content3",
		"service_page_title3",
		"service_page_meta3"
	],
	[
		'dr',
		'dds',
		"dmd"
	]
);

var outliers = AD.consistencyCheck( 

	CID_GROUPS, 

	{
		"doctor" : [
			"service_content1",
			"service_content2",
			"service_content3"
		],

		"geo" : [
			"service_content1",
			"service_content2",
			"service_content3",
			"homepage_title",
			"homepage_meta",
			"h1_content1",
			"service_page_title1",
			"service_page_meta1",
			"h1_content2",
			"service_page_title2",
			"service_page_meta2",
			"h1_content3",
			"service_page_title3",
			"service_page_meta3"
		]
	},

	CID_GROUPS_FACTORY
);


AD.compileOutliersAndSave( outliers, CID_GROUPS_STATIC, "OUTLIERS.json" );







