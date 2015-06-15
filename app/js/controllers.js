'use strict';

/* Controllers */
angular.module('traces.controllers', [])
  .controller('statusBtn', ['$scope', function($scope) {
    $scope.navigate = function (button) {
      if (button.href) {
        document.location = button.href;
      }
    }
  	$scope.buttons = [
  		{status:'Choose a thesis', active: true, binding: 'thesis'},
  		{status:'Select quotes', active: false, binding: 'quote'},
  		{status:'Make an outline', active: false, binding: 'outline'}
    ];

  	$scope.selected = $scope.buttons[0];

    $scope.select= function(item) {
        $scope.selected = item;
    };

    $scope.isActive = function(item) {
        return $scope.selected === item;
    };

  }])