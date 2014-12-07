'use strict';

angular.module('mean.mymodule').controller('MymoduleController', ['$scope', 'Global', 'Mymodule',
  function($scope, Global, Mymodule) {
    $scope.global = Global;
    $scope.package = {
      name: 'mymodule'
    };
  }
]);
