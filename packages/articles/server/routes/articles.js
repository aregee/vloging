'use strict';

var articles = require('../controllers/articles');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.article.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};
var editAuthorization = function(req, res, next) {
  if(req.article.user.id !== req.user.id) {
    return res.send(401, 'User not Authorized');
  }
  next();
};

module.exports = function(Articles, app, auth) {

  app.route('/articles')
    .get(auth.requiresLogin, hasAuthorization, articles.all)
    .post(auth.requiresLogin, articles.create);
  app.route('/articles/nearme')
    .get(articles.nearme);
  app.route('/articles/:articleId')
    .get(auth.requiresLogin, hasAuthorization, articles.show)
    .put(auth.requiresLogin, editAuthorization, articles.update)
    .delete(auth.requiresLogin, hasAuthorization, articles.destroy);

  // Finish with setting up the articleId param
  app.param('articleId', articles.article);
};
