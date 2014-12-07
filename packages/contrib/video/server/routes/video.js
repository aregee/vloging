'use strict';

// The Package is past automatically as first parameter
module.exports = function(Video, app, auth, database) {

  app.get('/video/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/video/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/video/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/video/example/render', function(req, res, next) {
    Video.render('index', {
      package: 'video'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
