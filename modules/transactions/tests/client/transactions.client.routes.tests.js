(function () {
  'use strict';

  describe('Transactions Route Tests', function () {
    // Initialize global variables
    var $scope,
      TransactionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TransactionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TransactionsService = _TransactionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('transactions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/transactions');
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
          TransactionsController,
          mockTransaction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('transactions.view');
          $templateCache.put('modules/transactions/client/views/view-transaction.client.view.html', '');

          // create mock Transaction
          mockTransaction = new TransactionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Transaction Name'
          });

          //Initialize Controller
          TransactionsController = $controller('TransactionsController as vm', {
            $scope: $scope,
            transactionResolve: mockTransaction
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:transactionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.transactionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            transactionId: 1
          })).toEqual('/transactions/1');
        }));

        it('should attach an Transaction to the controller scope', function () {
          expect($scope.vm.transaction._id).toBe(mockTransaction._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/transactions/client/views/view-transaction.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TransactionsController,
          mockTransaction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('transactions.create');
          $templateCache.put('modules/transactions/client/views/form-transaction.client.view.html', '');

          // create mock Transaction
          mockTransaction = new TransactionsService();

          //Initialize Controller
          TransactionsController = $controller('TransactionsController as vm', {
            $scope: $scope,
            transactionResolve: mockTransaction
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.transactionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/transactions/create');
        }));

        it('should attach an Transaction to the controller scope', function () {
          expect($scope.vm.transaction._id).toBe(mockTransaction._id);
          expect($scope.vm.transaction._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/transactions/client/views/form-transaction.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TransactionsController,
          mockTransaction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('transactions.edit');
          $templateCache.put('modules/transactions/client/views/form-transaction.client.view.html', '');

          // create mock Transaction
          mockTransaction = new TransactionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Transaction Name'
          });

          //Initialize Controller
          TransactionsController = $controller('TransactionsController as vm', {
            $scope: $scope,
            transactionResolve: mockTransaction
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:transactionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.transactionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            transactionId: 1
          })).toEqual('/transactions/1/edit');
        }));

        it('should attach an Transaction to the controller scope', function () {
          expect($scope.vm.transaction._id).toBe(mockTransaction._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/transactions/client/views/form-transaction.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
