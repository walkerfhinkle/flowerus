(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$scope', '$state', 'Authentication', 'productResolve', '$resource', 'DepartmentsService'];

  function ProductsController ($scope, $state, Authentication, product, $resource, DepartmentsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.product = product;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.department = DepartmentsService.query();

    // Remove Product
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.product.$remove($state.go('products.list'));
      }
    }

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      // Update/Save
      if (vm.product._id) {
        vm.product.$update(successCallback, errorCallback);
      } else {
        vm.product.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('products.view', {
          productId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
   // Upvote if user hasnt upvoted already

        $scope.upVoteHome = function (product) {


            // Check if they have voted with filter
            var hasVoted = product.upVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            // If a downvote exists remove it , else do nothing

            if (!hasVoted) {

                product.votes++;
                product.votesreal++;
                product.upVoters.push($scope.user.email);

            }

            // Check if there is a downVote to remove


            var hasVoted3 = product.downVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            if (hasVoted3) {

                for (var i = product.downVoters.length - 1; i >= 0; i--) {

                    if (product.downVoters[i] === $scope.user.email) {
                        product.downVoters.splice(i, 1);
                    }
                }
            }


            product.$update(function () {
                //$location.path('products/' + product._id);
            }, function (errorResponse) {
                // rollback votes on fail also
                $scope.error = errorResponse.data.message;
            });

        };

        $scope.downVoteHome = function (product) {

            var hasVoted = product.downVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            // If a upvote exists remove it , else do nothing

            if (!hasVoted) {

                product.votes--;
                product.votesreal--;
                product.downVoters.push($scope.user.email);


            }

            // Check if there is a upVote to remove


            var hasVoted2 = product.upVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            if (hasVoted2) {


                for (var i = product.upVoters.length - 1; i >= 0; i--) {

                    if (product.upVoters[i] === $scope.user.email) {
                        product.upVoters.splice(i, 1);
                    }
                }
            }


            product.$update(function () {
                //$location.path('products/' + product._id);

            }, function (errorResponse) {
                // rollback votes on fail also
                $scope.error = errorResponse.data.message;
            });

        };

        $scope.disableButtonUp = function (product) {

            if(product !== undefined){

                var hasVotedUp = product.upVoters.filter(function (voter) {

                        return voter === $scope.user.email;

                    }).length > 0;

                if (hasVotedUp) {
                    return true;

                } else {
                    return false;
                }

            }



        };

        $scope.disableButtonDown = function (product) {

            if(product !== undefined){

                var hasVotedUp = product.downVoters.filter(function (voter) {

                        return voter === $scope.user.email;

                    }).length > 0;

                if (hasVotedUp) {
                    return true;

                } else {
                    return false;
                }

            }



        };


    }
);

angular.module('products').filter('lessThan', function () {
    return function (items, requirement) {
        var filterKey = Object.keys(requirement)[0];
        var filterVal = requirement[filterKey];

        var filtered = [];

        if (filterVal !== undefined && filterVal !== '') {
            angular.forEach(items, function (item) {
                var today = new Date();
                var date = new Date(item.created);
                var diff = today - date;
                diff = diff / (1000 * 60 * 60);

                if (diff < filterVal) {
                    filtered.push(item);
                }
            });
            return filtered;
        }

        return items;
    };
});();
