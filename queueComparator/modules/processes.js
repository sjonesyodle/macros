var util      = require("./util");
var SF_QUEUES = require("./SF_QUEUES"); 

module.exports = {

	_getCaseNums : function ( nodeIndex ) {
		var caseNumCol = nodeIndex("a[href*='CASE_NUMBER']", 1);
		var evenRows   = document.querySelectorAll("tr.even");
		var oddRows    = document.querySelectorAll("tr.odd");
		var caseNumsArr  = [];

		var extractCaseNums = function ( nodeList ) {
			var 
			i = 0, l = nodeList.length, cell;
		
			for ( ; i < l; i += 1 ) {
				cell = nodeList[i].querySelectorAll("td")[ caseNumCol ];
				cell = (cell.querySelector("a").innerHTML).trim();
				caseNumsArr.push( cell );
			}

		};

		if ( !caseNumCol || caseNumCol < 0 ) return false;

		extractCaseNums( evenRows );
		extractCaseNums( oddRows );

		return caseNumsArr;
	},

	gatherComparisonCaseNumbers : function () {
		var that = this;
		var comparisons = SF_QUEUES.comparisons;

		this.casper.eachThen( comparisons, function ( res ) {

			this.thenOpen(res.data.trim(), function(){

				var caseNums = this.evaluate(function( nodeIndex, getCaseNums ){
					return getCaseNums( nodeIndex );
				}, util.nodeIndex, that.context._getCaseNums );

				var i, l;

				this.echo("total case numbers @ " + this.getCurrentUrl() + " => " + caseNums.length );

				if ( caseNums && caseNums.length && caseNums.length > 0 ) {	
					i = 0;
					l = caseNums.length;
					for ( ; i < l; i += 1 ) {
						that.data.comparisonCaseNums.push( caseNums[i] );
					}
				}

			});
		});
	},

	filterOutComparisonsFromCatchAll : function () {
		var 
		that               = this,
		comparisonCaseNums = that.data.comparisonCaseNums; // convert array to object literal for easy lookups

		this.casper.thenOpen( SF_QUEUES.catchall.trim(), function (){
			var caseNums = this.evaluate(function( nodeIndex, getCaseNums ){
				return getCaseNums( nodeIndex );
			}, util.nodeIndex, that.context._getCaseNums );

			var comparisonCaseNumsHash = util.arr2Obj( comparisonCaseNums );
			var caseNumsHash = util.arr2Obj( caseNums );

			if ( caseNums.length < comparisonCaseNums.length ) {
				that.kill("Error - comparisonCaseNums (" + comparisonCaseNums.length + ")" + " > Catchall Case Nums (" + caseNums.length + ")");
			}

			var i, remainder = [];

			this.echo("Comparison Collection (" + comparisonCaseNums.length +")\n" + comparisonCaseNums + "\n\n");

			this.echo("Catchall Collection (" + caseNums.length  + ")\n"+ caseNums + "\n\n");


			for ( i in caseNumsHash ) {
				i = i.trim();
				if ( !(i in comparisonCaseNumsHash) ) {
					remainder.push( i );
				}
			}

			this.echo("Remainder Collection (" + remainder.length + ")\n" + remainder + "\n\n");

		});

	}
};

