(function () {
  'use strict';

  angular
    .module('trendings')
    .controller('TrendingsListController', TrendingsListController);

  TrendingsListController.$inject = ['TrendingsService'];

  function TrendingsListController(TrendingsService) {
    var vm = this;

    vm.trendings = TrendingsService.query();
  }
}());
