'use strict';

var should = require('should'),
    app    = require('../../app'),
    User   = require('./user.model');

var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

describe('User Model', function() {
  before(function(done) {
    // Clear users before testing
    User.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    user.save(function() {
      var userDup = new User(user);
      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should authenticate user if password is valid', function() {
    return user.authenticate('password').should.be.true;
  });

  it('should not authenticate user if password is invalid', function() {
    return user.authenticate('blah').should.not.be.true;
  });

  it('should be a patron by default', function(){
    return user.role.should.equal('patron');
  });

  /*it('should have a patron object', function(done){
    should.exist(user.patron);
  });*/
});
