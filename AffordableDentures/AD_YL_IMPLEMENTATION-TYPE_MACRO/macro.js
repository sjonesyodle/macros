var fs = require('fs'); // fs belongs to phantom, not node directly*

var casper = require("casper").create({

	pageSettings: {
        loadImages:  true,
        loadPlugins: true        
    },

    logLevel: "info",           
    verbose: false,

    waitTimeout : 60000,
    stepTimeout : 60000

});

var data   = JSON.parse( fs.read("./ad.json", "utf8") );
var macro  = require('./macro_processes')( casper );

macro.login( "yodlelive" );

casper.each( data, function ( self, curr ){
    macro.goToWebsiteSpecs( curr.ID );
    macro.setSiteImplementationType();
    macro.saveImplementationType();
});

casper.run();