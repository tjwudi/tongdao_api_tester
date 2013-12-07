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
      result.total_pages.should.be.an.Number;
      result.data.should.be.an.Array;
      _.each(result.data, function(item){
        item.should.have.properties(project_comment_properties_show);
      });
      done();
    });
  });
});


  it('should be able to create a new project comment in a post', function(done){
    config = {};
    config.headers = auth_header;
    config.url = host + '/projects/1/project_posts/1/project_comments';
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

  it('should be able to list project comments in a post', function(done){
    config = {};
    config.url = host + '/projects/1/project_posts/1/project_comments';
    config.method = 'GET';

    request(config, function(err, res, body){
      if (err) return console.log(err);
      res.should.have.status(200);

      result=JSON.parse(body);
      result.total_pages.should.be.an.Number;
      result.data.should.be.an.Array;
      _.each(result.data, function(item){
        item.should.have.properties(project_comment_properties_show);
      });
      done();
    });
  });
