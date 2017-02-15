'use strict';

describe('Transactions E2E Tests:', function () {
  describe('Test Transactions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/transactions');
      expect(element.all(by.repeater('transaction in transactions')).count()).toEqual(0);
    });
  });
});
