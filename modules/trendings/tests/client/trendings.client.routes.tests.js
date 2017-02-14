(function () {
  'use strict';

  describe('Trendings Route Tests', function () {
    // Initialize global variables
    var $scope,
      TrendingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TrendingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TrendingsService = _TrendingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('trendings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/trendings');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TrendingsController,
          mockTrending;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('trendings.view');
          $templateCache.put('modules/trendings/client/views/view-trending.client.view.html', '');

          // create mock Trending
          mockTrending = new TrendingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Trending Name'
          });

          // Initialize Controller
          TrendingsController = $controller('TrendingsController as vm', {
            $scope: $scope,
            trendingResolve: mockTrending
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:trendingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.trendingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            trendingId: 1
          })).toEqual('/trendings/1');
        }));

        it('should attach an Trending to the controller scope', function () {
          expect($scope.vm.trending._id).toBe(mockTrending._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/trendings/client/views/view-trending.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TrendingsController,
          mockTrending;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('trendings.create');
          $templateCache.put('modules/trendings/client/views/form-trending.client.view.html', '');

          // create mock Trending
          mockTrending = new TrendingsService();

          // Initialize Controller
          TrendingsController = $controller('TrendingsController as vm', {
            $scope: $scope,
            trendingResolve: mockTrending
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.trendingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/trendings/create');
        }));

        it('should attach an Trending to the controller scope', function () {
          expect($scope.vm.trending._id).toBe(mockTrending._id);
          expect($scope.vm.trending._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/trendings/client/views/form-trending.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TrendingsController,
          mockTrending;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('trendings.edit');
          $templateCache.put('modules/trendings/client/views/form-trending.client.view.html', '');

          // create mock Trending
          mockTrending = new TrendingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Trending Name'
          });

          // Initialize Controller
          TrendingsController = $controller('TrendingsController as vm', {
            $scope: $scope,
            trendingResolve: mockTrending
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:trendingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.trendingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            trendingId: 1
          })).toEqual('/trendings/1/edit');
        }));

        it('should attach an Trending to the controller scope', function () {
          expect($scope.vm.trending._id).toBe(mockTrending._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/trendings/client/views/form-trending.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
