'use strict';

/**
 * Module dependencies
 */
var trendingsPolicy = require('../policies/trendings.server.policy'),
  trendings = require('../controllers/trendings.server.controller');

module.exports = function(app) {
  // Trendings Routes
  app.route('/api/trendings').all(trendingsPolicy.isAllowed)
    .get(trendings.list)
    .post(trendings.create);

  app.route('/api/trendings/:trendingId').all(trendingsPolicy.isAllowed)
    .get(trendings.read)
    .put(trendings.update)
    .delete(trendings.delete);

  // Finish by binding the Trending middleware
  app.param('trendingId', trendings.trendingByID);
};
