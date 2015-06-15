'use strict';
var sortableOptions = {
  connectWith: ".droppable"
};
// Declare app level module which depends on filters, and services
angular.module('traces', [
  'ngRoute',
  'traces.filters',
  'traces.services',
  'traces.directives',
  'traces.controllers',
  'traces.api',
  'ui.sortable',
  'xeditable',
  'textAngular'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/quotes.html', controller: 'MainPage'});
  $routeProvider.when('/draft', {templateUrl: 'partials/draft.html', controller: 'DraftPage'});
  $routeProvider.otherwise({redirectTo: '/'});
}])
.controller('MainPage', ['$scope', 'api', function ($scope, api){
  api.on('ready', function() { api.emit('get_theses') });
  if (api.ready) {
    setTimeout(function (){
       if (api.data.outline) {
        api.emit('existing_outline', api.data.outline);
      }
      api.emit('get_theses')
    }, 10);
  }
  $('[data-binding="draft"]').addClass('disabled').removeClass('active').siblings().removeClass('active');
  $('[data-binding="thesis"]').addClass('active');
  $('[data-binding="draft"]').pulse('destroy')
}])
.controller('DraftPage', ['$scope', function ($scope){
  $('[data-binding="draft"]').pulse('destroy')
  $('[data-binding="draft"]').removeClass('disabled').addClass('active').siblings().addClass('active')
}])
.controller('quotes', [ '$scope', '$element', 'api',function ($scope, $element, api) {
  $scope.sortableOptions = {
    connectWith: "#outline,#quotes"
  };
  $scope.sortableOptions.out = function (e, ui) {
   $(e.target).css('background-color', '#2b3e50');
  }
  $scope.sortableOptions.update = function(e, ui) {
    var target_list = $(ui.item.sortable.droptarget).attr('id');
    if (target_list === 'outline' && $('#outline > .thesis').length < 1) {
      ui.item.sortable.cancel();
    }
  };
  $scope.sortableOptions.over = function (e, ui) {
    $(e.target).css('background-color', '#3d5165');
  };
  $scope.quotes = [];
  api.on('set_quotes', function (quotes){
      $scope.$apply(function (){
        $scope.quotes = quotes
      });
  });
}])
.controller('theses', [ '$scope',  '$element', 'api', function ($scope, $element, api) {
  $scope.sortableOptions = {
    connectWith: "#outline,#theses"

  };
    $scope.sortableOptions.out = function (e, ui) {
      $(e.target).css('background-color', '#2b3e50');
    }
    $scope.sortableOptions.update = function(e, ui) {
      var target_list = $(ui.item.sortable.droptarget).attr('id');
      if (target_list === 'outline' && $('#outline > .thesis').length > 0) {
        ui.item.sortable.cancel();
      }
    };

    $scope.sortableOptions.over = function (e, ui) {
      $(e.target).css('background-color', '#3d5165');
    };
    
    api.on('set_theses', function (theses){
      $scope.$apply(function (){
        $scope.theses = theses
      });
    });
}])
.controller('outline', [ '$scope', '$element', 'api', function ($scope, $element, api) {
   
    api.on('existing_outline', function (outline){
      $scope.texts = outline;
      setTimeout(function () { api.emit('get_theses'); }, 2000)
    });
    $scope.sortableOptions = {
      connectWith: "#quotes,#outline,#theses"
    };
    $scope.mapping = {
      quote: 'quotes',
      thesis: 'theses'
    };

    $scope.sortableOptions.out = function (e, ui) {
      $(e.target).parent().css('background-color', '#2b3e50');
    }
    $scope.sortableOptions.update = function(e, ui) {
      var target_list = $(ui.item.sortable.droptarget).attr('id');
      if (target_list !== 'outline' && target_list !== $scope.mapping[$(ui.item).attr('data-type')]) {
        ui.item.sortable.cancel();
      } 

      api.emit('get_quotes');
      api.emit('update_outline', $scope.texts);
    }
    $scope.sortableOptions.change = function ( ) {
      setTimeout(function () {
        $('[data-binding="thesis"]').next()[($('#outline > .thesis').length > 0) ? 'addClass' : 'removeClass']('active');
        $('[data-binding="quote"]').next()[($('#outline > .quote').length > 0) ? 'addClass' : 'removeClass']('active');

        $('[data-binding="draft"]')[(($('#outline > .quote').length > 0) && ($('#outline > .thesis').length > 0)) ? 'removeClass' : 'addClass']('disabled');
        if ((($('#outline > .quote').length > 0) && ($('#outline > .thesis').length > 0))) {
          $('[data-binding="draft"]').pulse({
            backgroundColor: '#df9a1a'
          }, {
            pulses: -1,
            duration: 2000
          });
        } else {
          $('[data-binding="draft"]').pulse('destroy')
        }
      }, 500);
    }
    $scope.sortableOptions.over = function (e, ui) {
      $(e.target).parent().css('background-color', '#3d5165');
    };
    $scope.texts = [];
}])
.controller('draft', [ '$scope',  '$element', 'api', function ($scope, $element, api) {
  $scope.text = "";

  api.on('set_outline', function (outline) {
    $scope.mappings = {};

    outline.forEach(function (x){
      $scope.mappings[x.id] = x;
    });

    $scope.$watch('text', function (){
      var outline = [];
      if ($('span[data-bound]').length) {
        $('span[data-bound]').each(function () { 
          var o = $scope.mappings[$(this).attr('data-id')];
          o.text = $(this).text();
          outline.push(o);
        })
      }

      api.data.outline = ( outline || []);
       api.data.outline.forEach(function (o){
        api.data[(o.type === 'thesis' ? 'theses' : 'quotes' )].forEach(function (t){
          if (t.id === o.id) {
            t.text = o.text;
          }
        });
      })
    })

    $scope.text = (api.data.outline || []).map(function (text){
      return  '<span style="color: white;">' +text.id + '</span>';
    }).join('');
    setTimeout(function (){
       $('div[ng-model="html"] span[style="color: white;"]').each(function(){
          var obj = $scope.mappings[$(this).text().trim()];
          if (obj.text) {
            $(this)
                .replaceWith(
                  $('<p></p>')
                    .append(
                      $('<span></span>')
                      .text(obj.text)
                      .attr('data-id', obj.id)
                      .attr('data-type', obj.type)
                      .attr('data-bound', 'bound')
                      .css({
                        display: 'inline'
                      })
                    )
                );
          }
       });
    }, 500);
  });

  api.emit('set_outline', api.data.outline || []);

}]).run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});