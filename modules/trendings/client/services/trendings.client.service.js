// Trendings service used to communicate Trendings REST endpoints
(function () {
  'use strict';

  angular
    .module('trendings')
    .factory('TrendingsService', TrendingsService);

  TrendingsService.$inject = ['$resource'];

  function TrendingsService($resource) {
    return $resource('api/trendings/:trendingId', {
      trendingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
