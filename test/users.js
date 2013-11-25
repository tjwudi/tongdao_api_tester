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



  describe('[POST]/users/{id}/toggle_follow&[GET]/users/{id}/followship', function(){
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
        res.should.have.status(200);
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
        res.should.have.status(200);
        res.statusCode.should.eql(200);
        done();
      });
    });

    it('Should be able to see the user actually follow/unfollowed the user/2 successfully', function(done){
      var config = {};
      config.method = 'GET';
      config.url = host + '/users/2/followship';
      config.headers = auth_header;
      request(config, function(err, res, body) {
        if (err) return console.log(err);
        res.should.have.status(200);
        result = JSON.parse(body);
        result.should.have.property('status');
        result.status.should.be.within(0, 1);
        done();
      });
    });
  }); // User follow tester


  describe('[POST]/users', function(){ 
    beforeEach(login);
    afterEach(logout);
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
        res.should.have.status(201);
        result = JSON.parse(body);
        result.should.have.property('id');
        result.should.have.property('auth_token');
        done();
      });
    })
  }); // User registration tester

  describe('[GET]/users', function(){
    beforeEach(login);
    afterEach(logout);
    it('should be able to auto complete', function(done) {
      var config = {};
      config.method = 'GET';
      config.headers = auth_header;
      config.url = host + '/users';
      config.qs = {
        'auto_complete_word' : 'w',
        'count' : 4
      };
      request(config, function(err, res, body) {
        if (err) return console.log(err);
        res.should.have.status(200);
        result = JSON.parse(body);
        _.each(result, function(item){
          item.should.have.property('nickname');
          item['nickname'].should.match(/^.*w.*$/i);
        });
        done();
      });
    });
  }); // User listing tester


  describe('[GET]/users/count', function(){
    it('should be able to tell the user count', function(done){
      config = {};
      config.method = 'GET';
      config.url = host + '/users/count';
      request(config, function(err, res, body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result = JSON.parse(body);
        result.should.have.property('count');
        result['count'].should.be.type('number');
        done();
      });
    })
  });

  describe('[PATCH]/users/{id}', function(){
    beforeEach(login);
    afterEach(logout);
    it('should be able to update user information', function(done){
      config = {};
      config.method = 'PATCH';
      config.url = host + '/users/1';
      config.headers = auth_header;
      config.form = {
        'nickname': commonHelper.randomString(9),
        'gender': commonHelper.randomString(9),
        'contact': commonHelper.randomString(9),
        'school': commonHelper.randomString(9),
        'speciality': commonHelper.randomString(9),
        'avatar': commonHelper.randomString(9),
        'experence': commonHelper.randomString(9),
        'major': commonHelper.randomString(9)
      }
      request(config, function(err, res, body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result = JSON.parse(body);
        result.should.include(_.omit(config.form, 'contact'));
        done();
      });
    });
  });
});
