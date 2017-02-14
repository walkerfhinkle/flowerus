(function () {
  'use strict';

  // Trendings controller
  angular
    .module('trendings')
    .controller('TrendingsController', TrendingsController);

  TrendingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'trendingResolve'];

  function TrendingsController ($scope, $state, $window, Authentication, trending) {
    var vm = this;

    vm.authentication = Authentication;
    vm.trending = trending;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Trending
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.trending.$remove($state.go('trendings.list'));
      }
    }

    // Save Trending
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.trendingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.trending._id) {
        vm.trending.$update(successCallback, errorCallback);
      } else {
        vm.trending.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('trendings.view', {
          trendingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
