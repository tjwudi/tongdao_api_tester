var should = require('should'),
request = require('request'),
_ = require('underscore'),
commonHelper = require('../helper/common.js');

describe('Users Controller Tester', function(){
  var host = 'http://l:3000',
  token_id = null;
  var auth_header = {
    'AUTH_EMAIL': 'webmaster@leapoahead.com',
    'AUTH_TOKEN': 'theusertoken'
  };
  var login = function(done){
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
  };
  var logout = function(done){
    var config = {};
    config.method = 'DELETE';
    config.url = host + '/sessions/' + token_id;
    config.headers = auth_header;
    request(config, function(err, res, body) {
      if (err) return console.log(err);
      token_id = null;
      done();
    });
  };



  describe('User follow tester', function(){
    beforeEach(login);
    afterEach(logout);

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
        if (err) return console.log(err);
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
        if (err) return console.log(err);
        result = JSON.parse(body);
        result.should.have.property('status');
        result.status.should.be.exactly(0);
        done();
      });
    });
  }); // User follow tester


  describe('User registration', function(){ 
    it('should be able to register', function(done){
      var config = {};
      config.method = 'POST';
      config.url = host +  '/users/';
      config.form = {
        'email': commonHelper.randomString(9) + '@leapoahead.com',
        'encrypted_password': commonHelper.randomString(10),
        'nickname': commonHelper.randomString(7)
      }
      request(config, function(err, res, body){
        if (err) return console.log(err);
        result = JSON.parse(body);
        result.should.have.property('id');
        result.should.have.property('auth_token');
        done();
      });
    })
  }); // User registration tester

  describe('User listing(auto complete) tester', function(){
    it('should be able to auto complete', function(done) {
      var config = {};
      config.method = 'GET';
      config.url = host + '/users';
      config.qs = {
        'auto_complete_word' : 'w',
        'count' : 4
      };
      request(config, function(err, res, body) {
        if (err) return console.log(err);
        result = JSON.parse(body);
        _.each(result, function(item){
          item.should.have.property('nickname', 'avatar', 'school', 'speciality', 'gender', 'id');
          item['nickname'].should.match(/^.*w.*$/);
        });
        done();
      });
    });
  }); // User listing tester

});
