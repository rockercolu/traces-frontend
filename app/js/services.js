'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('traces.services', []).
  value('version', '0.1');

angular.module('traces.api', [
]).service('api', [ function (){
	var api = window.api = new EventEmitter();
	var data = api.data = {};
	api.on('load', function (){
		$.getJSON('../quotes.json', function (r) { $.extend(window.api.data, r); api.emit('ready') });
	});

	api.on('ready', function (){
		api.ready = true;
	})

	api.on('get_quotes', function (kw){
		api.emit('set_quotes', data.quotes.slice(0).map(function (x){ x.type = "quote"; x.id = (x.id || CryptoJS.SHA1(x.text).toString()); return x; }).filter(function (q){
			var go = false;
			((kw || $('#outline > .thesis').length ? JSON.parse($('#outline > .thesis').attr('data-keywords')) : []) || []).forEach(function (k) {
				go = go || q.keywords.indexOf(k) !== -1;
			})

			return go;
		}).filter(function (x){
			return !($('[data-id="'+x.id+'"]').length);
		}));
	});

	api.on('get_theses', function (){
		api.emit('set_theses', data.theses.slice(0).map(function (x){ x.type = "thesis"; x.id = (x.id || CryptoJS.SHA1(x.text).toString()); return x; }).filter(function (x){
			return !($('[data-id="'+x.id+'"]').length);
		}));
	});

	api.on('update_outline', function (ol){
		data.outline = api.data.outline = ol.map(function (x){
			delete x.$$hashKey;
			return x;
		});	
		api.emit('set_outline', data.outline);
	});

	api.emit('load');
	return api;
} ]);