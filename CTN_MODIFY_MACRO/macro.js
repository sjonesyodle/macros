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
var data   = require("./resources/data");
var queue  = require('./modules/processQueue')( casper );

//--------------------------------------------------------------	
	
login("yodlelive", casper);

queue
.addResource( data )
.addProcesses([
    "goToCtnCfgGUI",
    "configureCTN"
])
.compile()
.init();



casper.run();
