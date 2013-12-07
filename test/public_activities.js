var should = require('should');
var request = require('request');
var _ = require('underscore');
var config = require('../config.js');
var commonHelper = require('../helper/common.js');
var scaffold = require('./scaffold.js');

var host = config.host;
var token_id = null;
var auth_header = {
  'AUTH_EMAIL': 'webmaster@leapoahead.com',
  'AUTH_TOKEN': 'theusertoken'
};
var login = scaffold.login;
var logout = scaffold.logout;
var public_activity_properties_index = ['id', 'data', 'user', 'created_at', 'updated_at'];
var user_properties_index = ['id', 'nickname', 'school', 'gender', 'major', 'speciality', 'experence', 'avatar', 'count_of_followers', 'count_of_followings'];

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
      result.total_pages.should.be.an.Number;
      result.data.should.be.an.Array;
      _.each(result.data, function(item){
        item.should.have.properties(public_activity_properties_index);
        item.user.should.have.properties(user_properties_index);
      });
      done();
    });
  });

}); // Get user's followings public activities

describe('[GET]/users/{id}/public_activities', function(){
  beforeEach(login);
  afterEach(logout);

  it('should be able to get one user\'s public activities', function(done){
    config={};
    config.method='GET';
    config.url = host + '/users/2/public_activities';
    config.headers = auth_header;
    request(config, function(err, res, body){
      if (err) return console.log(err);
      res.should.have.status(200);

      result=JSON.parse(body);
      result.total_pages.should.be.an.Number;
      result.data.should.be.an.Array;
      _.each(result.data, function(item){
        item.should.have.properties(public_activity_properties_index);
        item.user.should.have.properties(user_properties_index);
      });
      done();
    });
  });
});
