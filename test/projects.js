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

var project_properties_index = ['id', 'title', 'tags', 'members', 'school', 'state', 'count_of_likes', 'count_of_views', 'created_at', 'updated_at'];
var project_properties_show = ['id', 'title', 'tags', 'members', 'school', 'state', 'count_of_likes', 'count_of_views', 'created_at', 'updated_at'];

describe('Projects Controller Tester', function(){
  beforeEach(login);
  afterEach(logout);

  var newProject = {
    'title': '同济大学 ' + commonHelper.randomString(9),
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
        result.should.have.properties(project_properties_show);
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
        page:1,
        per_page:1
      }
      request(config, function(err,res,body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result=JSON.parse(body);
        result.total_pages.should.be.an.Number;
        result.data.should.be.an.Array;
        result.data.length.should.eql(1);
        _.each(result.data, function(item){
          item.should.have.properties(project_properties_index);
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
        result.total_pages.should.be.an.Number;
        result.data.should.be.an.Array;
        _.each(result.data, function(item){
          item.should.have.properties(project_properties_index);
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
        result.should.have.properties(project_properties_show);
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
  });//Update a project

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

  }); //Delete project tester

  describe('[GET]/users/{id}/projects', function(){
    it('should be able to get user{id}\'s projects', function(done){
      config={};
      config.method='GET';
      config.url = host + '/users/1/projects';
      config.qs = {
        page:1
      }
      request(config, function(err,res,body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result=JSON.parse(body);
        result.total_pages.should.be.an.Number;
        result.data.should.be.an.Array;
        _.each(result.data, function(item){
          item.should.have.properties(project_properties_index);
        });
        done();
      });
    });

  }); //Get user's project list


  describe('[GET]/projects/count', function(){
    it('should be able to get the count of projects(total)', function(done){
      config = {};
      config.method = 'GET';
      config.url = host + '/projects/count';
      request(config, function(err, res, body){
        if (err) return console.log(err);
        res.should.have.status(200);
        result = JSON.parse(body);
        result.should.have.property('count');
        result['count'].should.be.an.Number;
        done();
      });
    });
  }); //Get the count of all projects

  var prev_like_state = null; // record for next step
  describe('[GET]/projects/{id}/state_like', function(){
    it('should be able to get the like status', function(done){
      config = {};
      config.method = 'GET';
      config.headers = auth_header;
      config.url = host + '/projects/3/state_like';
      
      request(config, function(err, res, body){
        if (err) return console.log(err);
        res.should.have.status(200);

        result = JSON.parse(body);
        result.should.have.property('state');
        result['state'].should.be.within(0, 1);
        prev_like_state = result['state'];

        done();
      });
    });
  });

  describe('[POST]/projects/{id}/toggle_like', function(){
    it('should be able to like&unlike a project', function(done){
      config = {};
      config.method = 'POST';
      config.url = host + '/projects/3/toggle_like';
      config.headers = auth_header;
      config.form = {};
     
      request(config, function(err, res, body){
        if (err) return console.log(err);
        res.should.have.status(200);

        result = JSON.parse(body);
        result.should.have.property('state');
        (prev_like_state + result['state']).should.eql(1); // match previous record

        done();
      });
    });
  }); // Toggle User Like

  describe('[POST]/projects/{id}/toggle_membership', function(){
    it ('should be able to toggle user\'s membership to a project', function(done){
      config = {};
      config.method = 'POST';
      config.url = host + '/projects/2/toggle_membership';
      config.headers = auth_header;
      config.form = {
        user_id: 2
      };

      request(config, function(err, res, body){
        if (err) return console.log(err);
        res.should.have.status(200);
        done();
      });
    });
  });

});
