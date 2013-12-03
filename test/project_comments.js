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

var project_comment_properties_show = ['id', 'content', 'emotion', 'user'];
var user_properties_index = ['id', 'nickname', 'school', 'gender', 'major', 'speciality', 'experence', 'avatar', 'count_of_followers', 'count_of_followings'];

describe('[GET]/projects/{id}/project_comments', function(){
  beforeEach(login);
  afterEach(logout);

  it('should be able to create a new project comment', function(done){
    config = {};
    config.headers = auth_header;
    config.url = host + '/projects/1/project_comments';
    config.form = {
      "content": commonHelper.randomString(100),
      "emotion": "Smile"
    }
    config.method="POST";

    request(config, function(err, res, body){
      if (err) return console.log(err);
      res.should.have.status(200);

      result = JSON.parse(body);
      result.should.be.an.Object;
      result.should.have.properties(project_comment_properties_show);
      done();
    });
  });

  it('should be able to list project comments', function(done){
    config = {};
    config.url = host + '/projects/1/project_comments';
    config.method = 'GET';

    request(config, function(err, res, body){
      if (err) return console.log(err);
      res.should.have.status(200);

      result=JSON.parse(body);
      result.should.be.an.Array;
      _.each(result, function(item){
        item.should.have.properties(project_comment_properties_show);
      });
      done();
    });
  });
});
