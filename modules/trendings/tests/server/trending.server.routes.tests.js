'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Trending = mongoose.model('Trending'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  trending;

/**
 * Trending routes tests
 */
describe('Trending CRUD tests', function () {

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

    // Save a user to the test db and create new Trending
    user.save(function () {
      trending = {
        name: 'Trending name'
      };

      done();
    });
  });

  it('should be able to save a Trending if logged in', function (done) {
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

        // Save a new Trending
        agent.post('/api/trendings')
          .send(trending)
          .expect(200)
          .end(function (trendingSaveErr, trendingSaveRes) {
            // Handle Trending save error
            if (trendingSaveErr) {
              return done(trendingSaveErr);
            }

            // Get a list of Trendings
            agent.get('/api/trendings')
              .end(function (trendingsGetErr, trendingsGetRes) {
                // Handle Trendings save error
                if (trendingsGetErr) {
                  return done(trendingsGetErr);
                }

                // Get Trendings list
                var trendings = trendingsGetRes.body;

                // Set assertions
                (trendings[0].user._id).should.equal(userId);
                (trendings[0].name).should.match('Trending name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Trending if not logged in', function (done) {
    agent.post('/api/trendings')
      .send(trending)
      .expect(403)
      .end(function (trendingSaveErr, trendingSaveRes) {
        // Call the assertion callback
        done(trendingSaveErr);
      });
  });

  it('should not be able to save an Trending if no name is provided', function (done) {
    // Invalidate name field
    trending.name = '';

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

        // Save a new Trending
        agent.post('/api/trendings')
          .send(trending)
          .expect(400)
          .end(function (trendingSaveErr, trendingSaveRes) {
            // Set message assertion
            (trendingSaveRes.body.message).should.match('Please fill Trending name');

            // Handle Trending save error
            done(trendingSaveErr);
          });
      });
  });

  it('should be able to update an Trending if signed in', function (done) {
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

        // Save a new Trending
        agent.post('/api/trendings')
          .send(trending)
          .expect(200)
          .end(function (trendingSaveErr, trendingSaveRes) {
            // Handle Trending save error
            if (trendingSaveErr) {
              return done(trendingSaveErr);
            }

            // Update Trending name
            trending.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Trending
            agent.put('/api/trendings/' + trendingSaveRes.body._id)
              .send(trending)
              .expect(200)
              .end(function (trendingUpdateErr, trendingUpdateRes) {
                // Handle Trending update error
                if (trendingUpdateErr) {
                  return done(trendingUpdateErr);
                }

                // Set assertions
                (trendingUpdateRes.body._id).should.equal(trendingSaveRes.body._id);
                (trendingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Trendings if not signed in', function (done) {
    // Create new Trending model instance
    var trendingObj = new Trending(trending);

    // Save the trending
    trendingObj.save(function () {
      // Request Trendings
      request(app).get('/api/trendings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Trending if not signed in', function (done) {
    // Create new Trending model instance
    var trendingObj = new Trending(trending);

    // Save the Trending
    trendingObj.save(function () {
      request(app).get('/api/trendings/' + trendingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', trending.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Trending with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/trendings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Trending is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Trending which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Trending
    request(app).get('/api/trendings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Trending with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Trending if signed in', function (done) {
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

        // Save a new Trending
        agent.post('/api/trendings')
          .send(trending)
          .expect(200)
          .end(function (trendingSaveErr, trendingSaveRes) {
            // Handle Trending save error
            if (trendingSaveErr) {
              return done(trendingSaveErr);
            }

            // Delete an existing Trending
            agent.delete('/api/trendings/' + trendingSaveRes.body._id)
              .send(trending)
              .expect(200)
              .end(function (trendingDeleteErr, trendingDeleteRes) {
                // Handle trending error error
                if (trendingDeleteErr) {
                  return done(trendingDeleteErr);
                }

                // Set assertions
                (trendingDeleteRes.body._id).should.equal(trendingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Trending if not signed in', function (done) {
    // Set Trending user
    trending.user = user;

    // Create new Trending model instance
    var trendingObj = new Trending(trending);

    // Save the Trending
    trendingObj.save(function () {
      // Try deleting Trending
      request(app).delete('/api/trendings/' + trendingObj._id)
        .expect(403)
        .end(function (trendingDeleteErr, trendingDeleteRes) {
          // Set message assertion
          (trendingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Trending error error
          done(trendingDeleteErr);
        });

    });
  });

  it('should be able to get a single Trending that has an orphaned user reference', function (done) {
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

          // Save a new Trending
          agent.post('/api/trendings')
            .send(trending)
            .expect(200)
            .end(function (trendingSaveErr, trendingSaveRes) {
              // Handle Trending save error
              if (trendingSaveErr) {
                return done(trendingSaveErr);
              }

              // Set assertions on new Trending
              (trendingSaveRes.body.name).should.equal(trending.name);
              should.exist(trendingSaveRes.body.user);
              should.equal(trendingSaveRes.body.user._id, orphanId);

              // force the Trending to have an orphaned user reference
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

                    // Get the Trending
                    agent.get('/api/trendings/' + trendingSaveRes.body._id)
                      .expect(200)
                      .end(function (trendingInfoErr, trendingInfoRes) {
                        // Handle Trending error
                        if (trendingInfoErr) {
                          return done(trendingInfoErr);
                        }

                        // Set assertions
                        (trendingInfoRes.body._id).should.equal(trendingSaveRes.body._id);
                        (trendingInfoRes.body.name).should.equal(trending.name);
                        should.equal(trendingInfoRes.body.user, undefined);

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
      Trending.remove().exec(done);
    });
  });
});
