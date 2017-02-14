(function () {
  'use strict';

  angular
    .module('trendings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Trendings',
      state: 'trendings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'trendings', {
      title: 'List Trendings',
      state: 'trendings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'trendings', {
      title: 'Create Trending',
      state: 'trendings.create',
      roles: ['user']
    });
  }
}());
