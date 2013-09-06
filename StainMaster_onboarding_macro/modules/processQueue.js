var util            = require("./util");
var processes       = require("./processes");
var processWrappers = require("./processWrappers");


module.exports = function ( casper ) {

	processes.casper = casper;

	return {
		queue  : [],

		data  : null,

		addResource : function ( data ) {
			this.data = data;
			return this;
		},

		addProcesses : function ( processArr ) {
			var that = this;
			processArr.forEach(function(el, i, arr){
				that.queue.push( util.trim( el ) );
			});

			return this;	
		},

		compile : function () {
			var
			queue = [],

			verifyProcess = function ( process ) {
				return process && typeof process === "function";
			};

			this.queue.forEach(function( el, i, arr ){
				var before, after;

				if ( !( el in processWrappers ) ) {
					queue.push( processes[el] );
					return true;
				}

				before = processWrappers[el].before;
				after  = processWrappers[el].after;

				if ( verifyProcess(before) ) queue.push(before);
				if ( verifyProcess(processes[el]) ) queue.push( processes[el] );
				if ( verifyProcess(after) ) queue.push(after);
			});


			this.queue = queue;

			return this;
		},

		init : function () {
			var 
			that   = this,
			data   = that.data,
			casper = processes.casper;

			if ( !data || !data.length ) return;

			processes.casper.eachThen( data, function( data ){
				var casper = this;
				data = data.data;

				that.queue.forEach(function( el, i, arr ){
					if ( typeof el === "function" ) {
						el.call({
							record : data,
							casper : casper,
							kill   : function ( msg ) {
								casper.echo("Died @ " + casper.getCurrentUrl());
								casper.die( msg );
							}
						});
					}
				});	
			});
		}
	};
};