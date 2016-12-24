/**
 * Support for localStorage
 */
/* global phantom: true */
'use strict';

exports.version = '1.2';

exports.module = function(phantomas) {

	var localVarsJar = phantomas.getParam('localVars', [], 'object');
	var LOCALVAR_SEPARATOR = '|';

	// setup localVars handling
	function initlocalVars() {
		// TODO: localVar handling via command line and config.json
		phantom.LocalStorageEnabled = true;

	}

	// add localVars, if any
	function injectlocalVars() {
		if (localVarsJar && localVarsJar.length > 0) {
			// @see http://nodejs.org/docs/latest/api/url.html
			var parseUrl = phantomas.require('url').parse;

			localVarsJar.forEach(function(localVar) {
				// phantomjs required attrs: *name, *value, *domain
				if (!localVar.name || !localVar.value) {
					throw 'this localVar is missing a name or value property: ' + JSON.stringify(localVar);
				}

				//http://stackoverflow.com/questions/35267191/phantomjs-open-page-with-localstorage-by-default

				if (!window.localStorage.setItem(localVar.name,localVar.value)) {
					// In PhantomJS 2.1, the addCookie function always returns false (#597).
					//throw 'PhantomJS could not add localVar: ' + JSON.stringify(localVar);
				}

				var testVar =  window.localStorage.getItem(localVar.name);
				phantomas.log('testVar: '+JSON.stringify(testVar));

				phantomas.log('localVars: set ' + JSON.stringify(localVar));
			});
		}
	}

	initlocalVars();
	phantomas.on('pageBeforeOpen', injectlocalVars);
};
