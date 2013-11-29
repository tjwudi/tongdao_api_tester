var should = require('should');
var request = require('request');
var _ = require('underscore');
var config = require('../config.js');
var commonHelper = require('../helper/common.js');


var host = config.host;
var token_id = null;
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
    var result=JSON.parse(body);
    token_id = result['id'];
    auth_header['AUTH_TOKEN'] = result['auth_token'];
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

var public_activity_properties = ['id', 'data', 'user_id', 'created_at', 'updated_at'];

describe('[Get]/public_activities', function(){
  beforeEach(login);
  afterEach(logout);

  it('should be able to get public activities list of current user\s followings', function(done){
    config={};
    config.method='GET';
    config.url = host + '/public_activities';
    config.headers = auth_header;
    request(config, function(err, res, body){
      if (err) return console.log(err);
      res.should.have.status(200);

      result=JSON.parse(body);
      _.each(result, function(item){
        item.should.have.properties(public_activity_properties);
      });
      done();
    });
  });

}); // Get user's followings public activities
