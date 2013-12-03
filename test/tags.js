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
        result.should.be.an.Array;
        _.each(result, function(item){
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
        result.should.be.an.Array;
        _.each(result, function(item){
          item.should.have.properties(tag_properties_index);
          item['name'].should.match(/^school$/i);
        });
        done();
      });
    })


  }); // Get tag information tester

});

