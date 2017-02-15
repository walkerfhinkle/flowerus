//Transactions service used to communicate Transactions REST endpoints
(function () {
  'use strict';

  angular
    .module('transactions')
    .factory('TransactionsService', TransactionsService);

  TransactionsService.$inject = ['$resource'];

  function TransactionsService($resource) {
    return $resource('api/transactions/:transactionId', {
      transactionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

