'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Trending = mongoose.model('Trending'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Trending
 */
exports.create = function(req, res) {
  var trending = new Trending(req.body);
  trending.user = req.user;

  trending.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trending);
    }
  });
};

/**
 * Show the current Trending
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var trending = req.trending ? req.trending.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  trending.isCurrentUserOwner = req.user && trending.user && trending.user._id.toString() === req.user._id.toString();

  res.jsonp(trending);
};

/**
 * Update a Trending
 */
exports.update = function(req, res) {
  var trending = req.trending;

  trending = _.extend(trending, req.body);

  trending.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trending);
    }
  });
};

/**
 * Delete an Trending
 */
exports.delete = function(req, res) {
  var trending = req.trending;

  trending.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trending);
    }
  });
};

/**
 * List of Trendings
 */
exports.list = function(req, res) {
  Trending.find().sort('-created').populate('user', 'displayName').exec(function(err, trendings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trendings);
    }
  });
};

/**
 * Trending middleware
 */
exports.trendingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Trending is invalid'
    });
  }

  Trending.findById(id).populate('user', 'displayName').exec(function (err, trending) {
    if (err) {
      return next(err);
    } else if (!trending) {
      return res.status(404).send({
        message: 'No Trending with that identifier has been found'
      });
    }
    req.trending = trending;
    next();
  });
};
