(function () {
  'use strict';

  angular
    .module('trendings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('trendings', {
        abstract: true,
        url: '/trendings',
        template: '<ui-view/>'
      })
      .state('trendings.list', {
        url: '',
        templateUrl: 'modules/trendings/client/views/list-trendings.client.view.html',
        controller: 'TrendingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Trendings List'
        }
      })
      .state('trendings.create', {
        url: '/create',
        templateUrl: 'modules/trendings/client/views/form-trending.client.view.html',
        controller: 'TrendingsController',
        controllerAs: 'vm',
        resolve: {
          trendingResolve: newTrending
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Trendings Create'
        }
      })
      .state('trendings.edit', {
        url: '/:trendingId/edit',
        templateUrl: 'modules/trendings/client/views/form-trending.client.view.html',
        controller: 'TrendingsController',
        controllerAs: 'vm',
        resolve: {
          trendingResolve: getTrending
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Trending {{ trendingResolve.name }}'
        }
      })
      .state('trendings.view', {
        url: '/:trendingId',
        templateUrl: 'modules/trendings/client/views/view-trending.client.view.html',
        controller: 'TrendingsController',
        controllerAs: 'vm',
        resolve: {
          trendingResolve: getTrending
        },
        data: {
          pageTitle: 'Trending {{ trendingResolve.name }}'
        }
      });
  }

  getTrending.$inject = ['$stateParams', 'TrendingsService'];

  function getTrending($stateParams, TrendingsService) {
    return TrendingsService.get({
      trendingId: $stateParams.trendingId
    }).$promise;
  }

  newTrending.$inject = ['TrendingsService'];

  function newTrending(TrendingsService) {
    return new TrendingsService();
  }
}());
