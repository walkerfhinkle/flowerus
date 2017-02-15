(function () {
  'use strict';

  angular
    .module('transactions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('transactions', {
        abstract: true,
        url: '/transactions',
        template: '<ui-view/>'
      })
      .state('transactions.list', {
        url: '',
        templateUrl: 'modules/transactions/client/views/list-transactions.client.view.html',
        controller: 'TransactionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Transactions List'
        }
      })
      .state('transactions.create', {
        url: '/create',
        templateUrl: 'modules/transactions/client/views/form-transaction.client.view.html',
        controller: 'TransactionsController',
        controllerAs: 'vm',
        resolve: {
          transactionResolve: newTransaction
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Transactions Create'
        }
      })
      .state('transactions.edit', {
        url: '/:transactionId/edit',
        templateUrl: 'modules/transactions/client/views/form-transaction.client.view.html',
        controller: 'TransactionsController',
        controllerAs: 'vm',
        resolve: {
          transactionResolve: getTransaction
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Transaction {{ transactionResolve.name }}'
        }
      })
      .state('transactions.view', {
        url: '/:transactionId',
        templateUrl: 'modules/transactions/client/views/view-transaction.client.view.html',
        controller: 'TransactionsController',
        controllerAs: 'vm',
        resolve: {
          transactionResolve: getTransaction
        },
        data:{
          pageTitle: 'Transaction {{ articleResolve.name }}'
        }
      });
  }

  getTransaction.$inject = ['$stateParams', 'TransactionsService'];

  function getTransaction($stateParams, TransactionsService) {
    return TransactionsService.get({
      transactionId: $stateParams.transactionId
    }).$promise;
  }

  newTransaction.$inject = ['TransactionsService'];

  function newTransaction(TransactionsService) {
    return new TransactionsService();
  }
})();
