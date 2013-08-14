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

// var data   = JSON.parse( fs.read("./ad.json", "utf8") );
var data   = require("./test");
var model  = require("./MASTER_MAP");
var macro  = require('./macro_processes')( casper );

macro.login( "AD_CMS" );

casper.each( data ,function( self, record ){
    macro
    .verifyOPOFieldsExist( record, model )
    .goToLocationEditor( record.cms_id )
    .verifyEditorFieldsExist( model )
    .doOPO( record, model )
    .saveOPO()
    .qualityCheck( record, model );
});

casper.run();