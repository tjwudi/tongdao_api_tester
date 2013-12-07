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
var tag_properties_index = ['name', 'id'];

describe('Tags API Tester', function(){
  beforeEach(login);
  afterEach(logout);

  describe('[GET]/tags', function(){
    it('should be able to get tags information (non-exact-match)', function(done){
      config = {};
      config.url = host + '/tags';
      config.method = 'GET';
      config.header = auth_header;
      config.qs = {
        'auto_complete_word': 'sc',
        'match': 0,
        'count': 5
      }

      request(config, function(err, res, body){
        if (err) return console.log(err);
        res.should.have.status(200);

        var result = JSON.parse(body);
        // console.log(result);
        result.data.should.be.an.Array;
        _.each(result.data, function(item){
          item.should.have.properties(tag_properties_index);
        });
        done();
      });
    })

    it('should be able to get tags information (exact-match)', function(done){
      config = {};
      config.url = host + '/tags';
      config.method = 'GET';
      config.header = auth_header;
      config.qs = {
        'auto_complete_word': 'ScHool',
        'match': 1,
        'count': 5
      }

      request(config, function(err, res, body){
        if (err) return console.log(err);
        res.should.have.status(200);

        var result = JSON.parse(body);
        // console.log(result);
        result.data.should.be.an.Array;
        _.each(result.data, function(item){
          item.should.have.properties(tag_properties_index);
          item['name'].should.match(/^school$/i);
        });
        done();
      });
    })


  }); // Get tag information tester

});

