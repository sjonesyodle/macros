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
var queue  = require('./modules/processQueue')( casper );
//--------------------------------------------------------------


//--------------------------------------------------------------
var comparisonCaseNums = [];
//--------------------------------------------------------------


	
login("salesforce", casper);


queue
.addResource("comparisonCaseNums", comparisonCaseNums)
.addProcesses([
    "gatherComparisonCaseNumbers",
    "filterOutComparisonsFromCatchAll"
])
.compile()
.init();

casper.run();