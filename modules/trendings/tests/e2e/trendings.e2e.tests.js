'use strict';

describe('Trendings E2E Tests:', function () {
  describe('Test Trendings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/trendings');
      expect(element.all(by.repeater('trending in trendings')).count()).toEqual(0);
    });
  });
});
