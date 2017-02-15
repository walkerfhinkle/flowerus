'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Transaction = mongoose.model('Transaction'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, transaction;

/**
 * Transaction routes tests
 */
describe('Transaction CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Transaction
    user.save(function () {
      transaction = {
        name: 'Transaction name'
      };

      done();
    });
  });

  it('should be able to save a Transaction if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Transaction
        agent.post('/api/transactions')
          .send(transaction)
          .expect(200)
          .end(function (transactionSaveErr, transactionSaveRes) {
            // Handle Transaction save error
            if (transactionSaveErr) {
              return done(transactionSaveErr);
            }

            // Get a list of Transactions
            agent.get('/api/transactions')
              .end(function (transactionsGetErr, transactionsGetRes) {
                // Handle Transaction save error
                if (transactionsGetErr) {
                  return done(transactionsGetErr);
                }

                // Get Transactions list
                var transactions = transactionsGetRes.body;

                // Set assertions
                (transactions[0].user._id).should.equal(userId);
                (transactions[0].name).should.match('Transaction name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Transaction if not logged in', function (done) {
    agent.post('/api/transactions')
      .send(transaction)
      .expect(403)
      .end(function (transactionSaveErr, transactionSaveRes) {
        // Call the assertion callback
        done(transactionSaveErr);
      });
  });

  it('should not be able to save an Transaction if no name is provided', function (done) {
    // Invalidate name field
    transaction.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Transaction
        agent.post('/api/transactions')
          .send(transaction)
          .expect(400)
          .end(function (transactionSaveErr, transactionSaveRes) {
            // Set message assertion
            (transactionSaveRes.body.message).should.match('Please fill Transaction name');

            // Handle Transaction save error
            done(transactionSaveErr);
          });
      });
  });

  it('should be able to update an Transaction if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Transaction
        agent.post('/api/transactions')
          .send(transaction)
          .expect(200)
          .end(function (transactionSaveErr, transactionSaveRes) {
            // Handle Transaction save error
            if (transactionSaveErr) {
              return done(transactionSaveErr);
            }

            // Update Transaction name
            transaction.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Transaction
            agent.put('/api/transactions/' + transactionSaveRes.body._id)
              .send(transaction)
              .expect(200)
              .end(function (transactionUpdateErr, transactionUpdateRes) {
                // Handle Transaction update error
                if (transactionUpdateErr) {
                  return done(transactionUpdateErr);
                }

                // Set assertions
                (transactionUpdateRes.body._id).should.equal(transactionSaveRes.body._id);
                (transactionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Transactions if not signed in', function (done) {
    // Create new Transaction model instance
    var transactionObj = new Transaction(transaction);

    // Save the transaction
    transactionObj.save(function () {
      // Request Transactions
      request(app).get('/api/transactions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Transaction if not signed in', function (done) {
    // Create new Transaction model instance
    var transactionObj = new Transaction(transaction);

    // Save the Transaction
    transactionObj.save(function () {
      request(app).get('/api/transactions/' + transactionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', transaction.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Transaction with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/transactions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Transaction is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Transaction which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Transaction
    request(app).get('/api/transactions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Transaction with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Transaction if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Transaction
        agent.post('/api/transactions')
          .send(transaction)
          .expect(200)
          .end(function (transactionSaveErr, transactionSaveRes) {
            // Handle Transaction save error
            if (transactionSaveErr) {
              return done(transactionSaveErr);
            }

            // Delete an existing Transaction
            agent.delete('/api/transactions/' + transactionSaveRes.body._id)
              .send(transaction)
              .expect(200)
              .end(function (transactionDeleteErr, transactionDeleteRes) {
                // Handle transaction error error
                if (transactionDeleteErr) {
                  return done(transactionDeleteErr);
                }

                // Set assertions
                (transactionDeleteRes.body._id).should.equal(transactionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Transaction if not signed in', function (done) {
    // Set Transaction user
    transaction.user = user;

    // Create new Transaction model instance
    var transactionObj = new Transaction(transaction);

    // Save the Transaction
    transactionObj.save(function () {
      // Try deleting Transaction
      request(app).delete('/api/transactions/' + transactionObj._id)
        .expect(403)
        .end(function (transactionDeleteErr, transactionDeleteRes) {
          // Set message assertion
          (transactionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Transaction error error
          done(transactionDeleteErr);
        });

    });
  });

  it('should be able to get a single Transaction that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Transaction
          agent.post('/api/transactions')
            .send(transaction)
            .expect(200)
            .end(function (transactionSaveErr, transactionSaveRes) {
              // Handle Transaction save error
              if (transactionSaveErr) {
                return done(transactionSaveErr);
              }

              // Set assertions on new Transaction
              (transactionSaveRes.body.name).should.equal(transaction.name);
              should.exist(transactionSaveRes.body.user);
              should.equal(transactionSaveRes.body.user._id, orphanId);

              // force the Transaction to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Transaction
                    agent.get('/api/transactions/' + transactionSaveRes.body._id)
                      .expect(200)
                      .end(function (transactionInfoErr, transactionInfoRes) {
                        // Handle Transaction error
                        if (transactionInfoErr) {
                          return done(transactionInfoErr);
                        }

                        // Set assertions
                        (transactionInfoRes.body._id).should.equal(transactionSaveRes.body._id);
                        (transactionInfoRes.body.name).should.equal(transaction.name);
                        should.equal(transactionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Transaction.remove().exec(done);
    });
  });
});
