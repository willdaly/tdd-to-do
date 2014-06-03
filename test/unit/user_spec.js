/* global describe, before, beforeEach, it */
/* jshint expr:true */
//put that line 2 in when expected an assignment or
//function call and instead saw an expression
'use strict';

//creates a different database for tests
process.env.DBNAME = 'tdd-to-do-test';
var  expect = require('chai').expect;
var Mongo = require('mongodb');
//actual application
var app = require('../../app/app.js');
//simulates a browser
var request = require('supertest');
var traceur = require('traceur');
var User;

describe('user', function(){
  //runs before your test
  //do your initializations here
  //initialize your database here before you run tests
  //done thing tells javascript when to run the rest
  before(function(done){
    //request is the browser, hits the app
    request(app)
    //gets the home page
    .get('/')
    //then ends this before
    .end(function(){
      User = traceur.require(__dirname + '/../../app/models/user.js');
      done();
    });
  });
//asynchronous test, putting the done in the it ensures javascript
//waits until this test runs
  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      User.register({email:'sue@aol.com', password:'abcd'}, function(){
        done();
      });
    });
  });

  describe('.register', function(){
    it('should successfully register a user', function(done){
      var obj = {email:'bob@aol.com', password:'1234'};
      User.register(obj, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        //bcrypt always gives you a 60 character password
        expect(u.password).to.have.length(60);
        done();
      });
    });

    it('should not successfully register a user', function(done){
      User.register({email:'sue@aol.com', password:'does not matter'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });
  describe('.login', function(){
    it('should successfully login a user', function(done){
      User.login({email:'sue@aol.com', password: 'abcd'}, function(u){
        expect(u).to.be.ok;
        done();
      });
    });
    it('should Not login user - bad email', function(done){
      User.login({email:'wrong@aol.com', password:'abcd'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
    it('should Not login user - bad password', function(done){
      User.login({email: 'sue@aol.com', password:'wrong'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });
});
