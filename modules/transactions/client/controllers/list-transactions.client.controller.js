(function () {
  'use strict';

  angular
    .module('transactions')
    .controller('TransactionsListController', TransactionsListController);

  TransactionsListController.$inject = ['TransactionsService'];

  function TransactionsListController(TransactionsService) {
    var vm = this;

    vm.transactions = TransactionsService.query();
  }
})();
