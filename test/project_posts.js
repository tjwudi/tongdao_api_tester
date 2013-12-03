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

var project_post_properties_index = ['id', 'content', 'title', 'created_at', 'updated_at'];
var project_post_properties_show = ['id', 'content', 'title', 'created_at', 'updated_at'];


describe('[POST]/projects/1/project_posts', function(){
  beforeEach(login);
  afterEach(logout);

  it('should be able to create new project post', function(done){
    config={};
    config.headers = auth_header;
    config.method='POST';
    config.form = {
      "title": commonHelper.randomString(10),
      "content": commonHelper.randomString(900)
    }
    config.url = host + '/projects/1/project_posts';

    request(config, function(err, res, body){
      if (err) return console.log(err);
      res.should.have.status(200);

      result = JSON.parse(body);
      result.should.be.an.Object;
      result.should.have.properties(project_post_properties_index);
      
      done();
    });
  }); // create new project

});

describe('[GET]/projects/1/project_posts', function(){
  beforeEach(login);
  afterEach(logout);

  it('should be able to pull a list of project posts', function(done){
    config = {};
    config.method = 'GET';
    config.qs = {
      page : 1
    };
    config.url = host + '/projects/1/project_posts';

    request(config, function(err, res, body){
      if (err) return console.log(err);
      res.should.have.status(200);

      result = JSON.parse(body);
      result.should.be.an.Array;
      _.each(result, function(item){
        item.should.have.properties(project_post_properties_index);
      });
      done();
    });
  });
});
