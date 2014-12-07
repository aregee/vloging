'use strict';

angular.module('mean.video').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('video example page', {
      url: '/video/example',
      templateUrl: 'video/views/index.html'
    });
  }
]);
