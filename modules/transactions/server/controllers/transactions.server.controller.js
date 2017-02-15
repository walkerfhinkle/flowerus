'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Transaction = mongoose.model('Transaction'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Transaction
 */
exports.create = function(req, res) {
  var transaction = new Transaction(req.body);
  transaction.user = req.user;

  transaction.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(transaction);
    }
  });
};

/**
 * Show the current Transaction
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var transaction = req.transaction ? req.transaction.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  transaction.isCurrentUserOwner = req.user && transaction.user && transaction.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(transaction);
};

/**
 * Update a Transaction
 */
exports.update = function(req, res) {
  var transaction = req.transaction ;

  transaction = _.extend(transaction , req.body);

  transaction.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(transaction);
    }
  });
};

/**
 * Delete an Transaction
 */
exports.delete = function(req, res) {
  var transaction = req.transaction ;

  transaction.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(transaction);
    }
  });
};

/**
 * List of Transactions
 */
exports.list = function(req, res) { 
  Transaction.find().sort('-created').populate('user', 'displayName').exec(function(err, transactions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(transactions);
    }
  });
};

/**
 * Transaction middleware
 */
exports.transactionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Transaction is invalid'
    });
  }

  Transaction.findById(id).populate('user', 'displayName').exec(function (err, transaction) {
    if (err) {
      return next(err);
    } else if (!transaction) {
      return res.status(404).send({
        message: 'No Transaction with that identifier has been found'
      });
    }
    req.transaction = transaction;
    next();
  });
};
