import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as passport from 'passport';
import { environment } from './environments/environment';
import * as cors from 'cors';

//import { convertGpxToGeoJSON } from './services/togeojson/togeojson-service';

import * as GoogleStrategy from 'passport-google-oauth2';

passport.use(
  new GoogleStrategy.Strategy(environment.google, function(
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    console.log(profile);
    /*
    User.findOrCreate({ googleId: profile.id }, function(err, user) {
      return done(err, user);
    });*/
  })
);

import { Message } from './model';

export class ChatServer {
  public static readonly PORT: number = 8080;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
    this.createRoutes();
  }

  private createApp(): void {
    this.app = express();

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(cors());
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || ChatServer.PORT;
  }

  private sockets(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('⛄️ 🏃 mapdrops server on port %s', this.port);
    });

    this.io.on('connect', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      socket.on('message', (m: Message) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  private createRoutes(): void {
    this.app.get('/', function(req, res, next) {
      res.send('mapdrops RESTful API');
    });

    this.app.post('/togeojson', function(req, res) {
      console.log('request geojson');

      //const geojson = convertGpxToGeoJSON(req.body.gpx);

      //res.send({ geojson });
    });

    this.app.get(
      '/auth/google',
      passport.authenticate('google', { scope: ['email profile'] })
    );

    this.app.get(
      '/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        // Authenticated successfully
        console.log('server Authenticated with google ');
        res.redirect('/hello', { profile: req.body });
      }
    );

    this.app.get('/test', (req, res) => {
      // Authenticated successfully
      console.log('server Authenticated with google ');
      // I need to pass a JWT token to google to get the profile!
      res.send({ profile: 'yes' });
    });

    this.app.get('/profile', (req, res) => {
      // Authenticated successfully
      res.redirect('/profile');
    });

    this.app.get('/user', (req, res) => {
      // Authenticated successfully
      console.log(req.user);
      res.send({ hi: 'world' });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
