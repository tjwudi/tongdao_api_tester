var should = require('should'),
request = require('request');

describe('Users Controller Tester', function(){
  var host = 'http://l:3000';
  var auth_header = {
    'AUTH_EMAIL': 'webmaster@leapoahead.com',
    'AUTH_TOKEN': 'theusertoken'
  };
  var token_id;

  beforeEach(function(done){
    var config = {};
    config.method = 'POST';
    config.url = host + '/sessions';
    config.form = {
      'email': 'webmaster@leapoahead.com',
      'encrypted_password': 'abcabc'
    };
    request(config, function(err, res, body) {
      if (err) return console.log(err);
      token_id = (JSON.parse(body))['id'];
      done();
    });
  });

  afterEach(function(){
    var config = {};
    config.method = 'DELETE';
    config.url = host + '/sessions/' + token_id;
    config.headers = auth_header;
    request(config, function(err, res, body) {
      if (err) return console.log(err);
    });
  });

  describe('User follow tester', function(){
    it('Should be able to follow a user', function(done){
      var config = {};
      config.method = 'POST';
      config.url = host + '/users/2/toggle_follow';
      config.form = {};
      config.headers = auth_header;
      request(config, function(err, res, body) {
        if (err) return console.log(err);
        res.statusCode.should.eql(200);
        done();
      });
    });

    it('Should be able to see the user actually followed the user/2 successfully', function(done){
      var config = {};
      config.method = 'GET';
      config.url = host + '/users/2/followship';
      config.headers = auth_header;
      request(config, function(err, res, body) {
        result = JSON.parse(body);
        result.should.have.property('status');
        result.status.should.be.exactly(1);
        done();
      });
    });

    it('Should be able to unfollow a user', function(done){
      var config = {};
      config.method = 'POST';
      config.url = host + '/users/2/toggle_follow';
      config.form = {};
      config.headers = auth_header;
      request(config, function(err, res, body) {
        if (err) return console.log(err);
        res.statusCode.should.eql(200);
        done();
      });
    });

    it('Should be able to see the user actually unfollowed the user/2 successfully', function(done){
      var config = {};
      config.method = 'GET';
      config.url = host + '/users/2/followship';
      config.headers = auth_header;
      request(config, function(err, res, body) {
        result = JSON.parse(body);
        result.should.have.property('status');
        result.status.should.be.exactly(0);
        done();
      });
    });
  }); // User follow tester


});
