"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var passport = require("passport");
var environment_1 = require("./environments/environment");
var cors = require("cors");
//import { convertGpxToGeoJSON } from './services/togeojson/togeojson-service';
var GoogleStrategy = require("passport-google-oauth2");
passport.use(new GoogleStrategy.Strategy(environment_1.environment.google, function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    /*
    User.findOrCreate({ googleId: profile.id }, function(err, user) {
      return done(err, user);
    });*/
}));
var ChatServer = /** @class */ (function () {
    function ChatServer() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.createRoutes();
    }
    ChatServer.prototype.createApp = function () {
        this.app = express();
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(cors());
    };
    ChatServer.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    ChatServer.prototype.config = function () {
        this.port = process.env.PORT || ChatServer.PORT;
    };
    ChatServer.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    ChatServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('⛄️ 🏃 mapdrops server on port %s', _this.port);
        });
        this.io.on('connect', function (socket) {
            console.log('Connected client on port %s.', _this.port);
            socket.on('message', function (m) {
                console.log('[server](message): %s', JSON.stringify(m));
                _this.io.emit('message', m);
            });
            socket.on('disconnect', function () {
                console.log('Client disconnected');
            });
        });
    };
    ChatServer.prototype.createRoutes = function () {
        this.app.get('/', function (req, res, next) {
            res.send('mapdrops RESTful API');
        });
        this.app.post('/togeojson', function (req, res) {
            console.log('request geojson');
            //const geojson = convertGpxToGeoJSON(req.body.gpx);
            //res.send({ geojson });
        });
        this.app.get('/auth/google', passport.authenticate('google', { scope: ['email profile'] }));
        this.app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
            // Authenticated successfully
            console.log('server Authenticated with google ');
            res.redirect('/hello', { profile: req.body });
        });
        this.app.get('/test', function (req, res) {
            // Authenticated successfully
            console.log('server Authenticated with google ');
            // I need to pass a JWT token to google to get the profile!
            res.send({ profile: 'yes' });
        });
        this.app.get('/profile', function (req, res) {
            // Authenticated successfully
            res.redirect('/profile');
        });
        this.app.get('/user', function (req, res) {
            // Authenticated successfully
            console.log(req.user);
            res.send({ hi: 'world' });
        });
    };
    ChatServer.prototype.getApp = function () {
        return this.app;
    };
    ChatServer.PORT = 8080;
    return ChatServer;
}());
exports.ChatServer = ChatServer;
