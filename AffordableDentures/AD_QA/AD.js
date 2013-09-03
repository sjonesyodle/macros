var fs   = require("fs"); 
var util = require("./util");

module.exports = {

	createCIDGroups : function ( ad_key_set, ad_data_set, factory ) {
		var 
		composite = {}, i,
		F = factory;

		//create hash of client ids
		for ( i in ad_key_set ) {
			if ( ad_key_set[i][F.groupKey] ) {
				composite[ ad_key_set[i][F.groupKey] ] = {};
				composite[ ad_key_set[i][F.groupKey] ][F.needleSetKey] = ad_key_set[i];
			}
		}

		this.checkRecordLength( composite, F.groupSize );

		//push data from ad_data_set to relative group in composite
		for ( i in ad_data_set ) {
			if ( !( ad_data_set[i][F.groupKey] && (ad_data_set[i][F.groupKey] in composite) ) ) {
				throw new Error( F.masterSetKey + " record has not relevant record in composite" );
				return;
			}
			composite[ ad_data_set[i][F.groupKey] ][F.masterSetKey] = ad_data_set[i];
		}

		return composite;
	},

	checkRecordLength : function ( record, len ) {
		var recLen = record.length || util.objSize( record );

		if ( !(record && recLen === len) ) {
			throw new Error("Set Length is incorrect and should be " + len);
			return false;
		}
		return true;
	},

	santizeCID_GROUPS : function ( compositeRec, santizeKeys, removeTerms ) {
		var i, j, k;

		for ( i in compositeRec ) {
			for ( j in compositeRec[i] ) {
				for ( k in compositeRec[i][j] ) {
					if ( util.inArray( k, santizeKeys ) ) {
						compositeRec[i][j][k] = compositeRec[i][j][k].toString().trim().toLowerCase();
						compositeRec[i][j][k] = util.removeSpecChars( compositeRec[i][j][k], false );
						compositeRec[i][j][k] = util.removeTerms( compositeRec[i][j][k], removeTerms );
						compositeRec[i][j][k] = util.removeSpecChars( compositeRec[i][j][k], true );
					}
				}
			}
		}
	},

	consistencyCheck : function ( compositeRec, checkMap, factory ) {
		var 
		i, j, needle, testData,
		that     = this,
		outliers = {};

		for ( i in compositeRec ) {
			for ( j in checkMap ) {
				needle = compositeRec[i][factory.needleSetKey][j];

				checkMap[j].forEach(function(el){
					el       = el.trim();
					testData = compositeRec[i][factory.masterSetKey][el];
					if ( !that.consistencyTest( needle, testData ) ) {

						if ( !outliers[i] ) outliers[i] = [];
						outliers[i].push( j + "(" + needle  + ")" + " => " + el );
					}
				});	
			}
		}

		return outliers;
	},

	consistencyTest : function ( needle, haystack ) {
		return haystack.indexOf(needle) > -1;
	},

	compileOutliersAndSave : function ( checkObj, masterRec, fn ) {
		var outliers = [], i, rec;

		for ( i in checkObj ) {
			masterRec[i].AD_DATA.failures = checkObj[i];
			
			outliers.push( masterRec[i].AD_DATA );
		}

		outliers = JSON.stringify( outliers );

		fs.writeFileSync( fn, outliers );
	}	

};







