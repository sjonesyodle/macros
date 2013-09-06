var fs     = require('fs');
var casper = require("casper").create({

	pageSettings: {
        loadImages:  true,
        loadPlugins: true        
    },

    logLevel: "info",           
    verbose: false,

    waitTimeout : 80000,
    stepTimeout : 80000

});

//--------------------------------------------------------------
var login  = require("./modules/login");
var util   = require("./modules/util");
var data   = JSON.parse(fs.read("./resources/data.json"));
var queue  = require('./modules/processQueue')( casper );

//--------------------------------------------------------------	
	
login("salesforce", casper);

queue
.addResource( data )
.addProcesses([
    "goToNewOpportunityScreen",
    "chooseOpportunityType"
])
.compile()
.init();

casper.run();
