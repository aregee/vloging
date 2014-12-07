'use strict';

angular.module('mean.articles')
  .config(function(hljsServiceProvider) {
    hljsServiceProvider.setOptions({
      // replace tab with 4 spaces
      tabReplace: '  '
    });
  })
  .directive('highlight', function($interpolate, $window) {
    return {
      restrict: 'EA',
      scope: true,
      compile: function(tElem, tAttrs) {
        var interpolateFn = $interpolate(tElem.html(), true);
        tElem.html(''); // disable automatic intepolation bindings

        return function(scope, elem, attrs) {
          scope.$watch(interpolateFn, function(value) {
            elem.html(hljs.highlight('html', value).value);
          });
        }
      }
    };
  })
  .service('fileUpload', ['$http', 'Articles', '$rootScope', function($http, Articles, $rootScope) {
    this.uploadFileToUrl = function(file, uploadUrl) {
      var fd = new FormData();
      console.log(file);
      fd.append('dest', '/file/photos/');
      fd.append('file', file);
      $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        })
        .success(function(data) {
          console.log(data);
          var article = new Articles({
            title: data.file.name,
            src: data.file.src
          });
          article.$save(function(response) {
            console.log(response);
            $rootScope.$broadcast('video-uploaded');
          });
        })
        .error(function() {});
    };
  }])
  .controller('VideoCtrl', ['$scope', '$stateParams', '$location', 'Global', 'Articles', '$timeout', '$rootScope', 'fileUpload',
    function($scope, $stateParams, $location, Global, Articles, $timeout, $rootScope, fileUpload) {
      $scope.global = Global;
      var videoblob;
      $scope.addBroadcast = function() {
        $scope.hideImage = true;
        $rootScope.$broadcast('START_WEBCAM');
      };
      $rootScope.$on('STOP_WEBCAM', function() {
        $scope.hideImage = false;
      });
      $scope.hasAuthorization = function(article) {
        if (!article || !article.user) return false;
        return $scope.global.isAdmin || article.user._id === $scope.global.user._id;
      };

      $scope.uploadFile = function(file) {
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = 'meanUpload/upload';
        fileUpload.uploadFileToUrl(file, uploadUrl);
      };

      $scope.customCb = function(stream) {
        var mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.mimeType = 'video/webm';
        mediaRecorder.ondataavailable = function(blob) {
          // POST/PUT "Blob" using FormData/XHR2
          //var blobURL = URL.createObjectURL(blob);
          videoblob = blob;
          videoblob.name = 'record.webm';
        };
        mediaRecorder.start(5000);
        $timeout(function() {
          console.log('timeout invoked');
          $rootScope.$broadcast('STOP_WEBCAM');
          mediaRecorder.stop();
          $scope.uploadFile(videoblob);
        }, 9000);
      };

      $scope.create = function(isValid) {
        if (isValid) {
          var article = new Articles({
            title: this.title,
            content: this.content,
            lat: this.lat,
            lng: this.lng,
            geo: [this.lat, this.lng]
          });
          article.$save(function(response) {
            $location.path('articles/' + response._id);
          });

          this.title = '';
          this.content = '';
          this.lat = '';
          this.lng = '';
        } else {
          $scope.submitted = true;
        }
      };

      $scope.remove = function(article) {
        if (article) {
          article.$remove();

          for (var i in $scope.articles) {
            if ($scope.articles[i] === article) {
              $scope.articles.splice(i, 1);
            }
          }
        } else {
          $scope.article.$remove(function(response) {
            $location.path('articles');
          });
        }
      };

      $scope.update = function(isValid) {
        if (isValid) {
          var article = $scope.article;
          if (!article.updated) {
            article.updated = [];
          }
          article.updated.push(new Date().getTime());

          article.$update(function() {
            $location.path('articles/' + article._id);
          });
        } else {
          $scope.submitted = true;
        }
      };

      $scope.find = function() {
        Articles.query(function(articles) {
          $scope.articles = articles;
        });
      };

      $scope.find();
      $rootScope.$on('video-uploaded', function() {
        $scope.find();
      });

      $scope.findOne = function() {
        Articles.get({
          articleId: $stateParams.articleId
        }, function(article) {
          $scope.article = article;
        });
      };
    }
  ]);