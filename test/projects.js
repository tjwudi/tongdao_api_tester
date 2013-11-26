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


describe('Projects Controller Tester', function(){
  beforeEach(login);
  afterEach(logout);

  var newProject = {
    'title': 'Project ' + commonHelper.randomString(9),
    'tags': [{"name":"School"},{"name":"Cooking"},{"name":commonHelper.randomString(5)}],
    'school': commonHelper.randomString(6) + ' University',
    'state': 'Wanting!'
  };

  describe('[POST]/projects', function(){
    it('should be able to create new project', function(done){
      config={};
      config.method='POST';
      config.url = host + '/projects';
      config.form = newProject;
      config.headers=auth_header;
      request(config, function(err,res,body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result = JSON.parse(body);
        result.should.have.properties(['id', 'title', 'tags', 'school', 'state', 'created_at', 'updated_at']);
        newProject = result;
        done();
      });
    });
  }); //Create User Test

  describe('[GET]/projects', function(){
    it('should be able to get projects', function(done){
      config={};
      config.method='GET';
      config.url = host + '/projects';
      config.qs = {
        page:1
      }
      request(config, function(err,res,body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result=JSON.parse(body);
        result.should.be.an.Array;
        _.each(result, function(item){
          item.should.have.properties(['id', 'title', 'tags', 'school', 'state', 'created_at', 'updated_at']);
        });
        done();
      });
    });

    it('should be able to get projects by tag', function(done){
      config={};
      config.method='GET';
      config.url = host + '/projects';
      config.qs = {
        page:1,
        tag:'school'
      }
      request(config, function(err,res,body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result = JSON.parse(body);
        result.should.be.an.Array;
        _.each(result, function(item){
          item.should.have.properties(['id', 'title', 'tags', 'school', 'state', 'created_at', 'updated_at']);
          var findSchoolTag = _.find(item.tags, function(tag) {
            return tag.name === 'School';
          });
          findSchoolTag.should.be.ok;
        });
        done();
      });
    });
  }); //Get project list

  describe('[GET]/projects/{id}', function(){
    it('should be able to get a single project', function(done){
      config={};
      config.method='GET';
      config.url = host + '/projects/' + newProject.id;
      request(config, function(err,res,body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result = JSON.parse(body);
        result.should.have.properties(['id', 'title', 'tags', 'school', 'state', 'created_at', 'updated_at']);
        done();
      });
    });
  });//GET a single project 

  describe('[PATCH]/projects/{id}', function(){
    it('should be able to update a project', function(done){
      config={};
      config.method='PATCH';
      config.url = host + '/projects/' + newProject.id;
      config.headers = auth_header;
      config.form = {
        "title": commonHelper.randomString(9),
        "tags": [{"name":"School"}],
        "school": commonHelper.randomString(5) + ' University',
        "state": "Wanting!"
      }
      request(config, function(err,res,body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result=JSON.parse(body);
        result.should.include(config.form);
        done();
      });
    });
  });

  describe('[DELETE]/projects/{id}', function(){
    it('should be able to remove a project', function(done){
      config = {};
      config.method = 'DELETE';
      config.url = host+'/projects/'+newProject.id;
      config.headers = auth_header;
      request(config, function(err,res,body){
        if (err) return console.log(err);
        res.should.have.status(200);
        done();
      });
    });

    it('should not be able to get the deleted project again', function(done){
      config={};
      config.method='GET';
      config.url = host + '/projects/' + newProject.id;
      request(config, function(err,res,body){
        if (err) return console.log(err);
        res.should.have.status(404);
        done();
      });
    });

  });

});
