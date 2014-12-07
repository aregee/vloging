'use strict';

angular.module('mean.video').controller('VideoController', ['$scope', 'Global', 'Video',
  function($scope, Global, Video) {
    $scope.global = Global;
    $scope.package = {
      name: 'video'
    };
  }
]);
