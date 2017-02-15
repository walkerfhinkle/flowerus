'use strict';

/**
 * Module dependencies
 */
var transactionsPolicy = require('../policies/transactions.server.policy'),
  transactions = require('../controllers/transactions.server.controller');

module.exports = function(app) {
  // Transactions Routes
  app.route('/api/transactions').all(transactionsPolicy.isAllowed)
    .get(transactions.list)
    .post(transactions.create);

  app.route('/api/transactions/:transactionId').all(transactionsPolicy.isAllowed)
    .get(transactions.read)
    .put(transactions.update)
    .delete(transactions.delete);

  // Finish by binding the Transaction middleware
  app.param('transactionId', transactions.transactionByID);
};
