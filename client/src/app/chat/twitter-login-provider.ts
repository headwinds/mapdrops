import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser, LoginProviderClass } from '../entities/user';
//import * as oath from 'oauth';
//import * as qs from 'qs';
declare function require(name: string);
var OAuth = require('oauth').OAuth;
var qs = require('qs');

const DEBUG = true;
/*
credit
https://github.com/mdemblani/twitter-login-client.git
https://github.com/BoyCook/TwitterJSClient/blob/master/lib/Twitter.js
*/

export class TwitterLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID = 'twitter';
  public loginProviderObj: LoginProviderClass = new LoginProviderClass();
  public twitterConnect: any;
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  callBackUrl: string;
  baseUrl: string;
  oauth: any;

  constructor(private clientId: string) {
    super();
    this.loginProviderObj.id = clientId;
    this.loginProviderObj.name = 'twitter';
    this.loginProviderObj.url =
      'https://api.twitter.com/oauth/authenticate?oauth_token=';
  }

  initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      console.log('TwitterLoginProvider initialize');

      try {
        this.consumerKey = 'Sbrkfm4VFG8YhS4QriGrQD5aR';
        this.consumerSecret =
          'm31nnfIIm8ppvI44hcAgn4YBQQXM7APBmd359kl4lsxcb3XIBk';
        this.accessToken = '688493-lEARjkGiDzwIBZH5Zh93Jjp6gGMzgohBZRrKzNEyrtz';
        this.accessTokenSecret =
          'bbN24JHDniKxOOpsRffnRHygj2uGo7ndUc5MKNBdqnfqS';
        this.callBackUrl = 'https://goldfarming.now.sh/auth/twitter/callback';
        this.baseUrl = 'https://api.twitter.com/1.1';
        this.oauth = new OAuth(
          'https://api.twitter.com/oauth/request_token',
          'https://api.twitter.com/oauth/access_token',
          this.consumerKey,
          this.consumerSecret,
          '1.0',
          this.callBackUrl,
          'HMAC-SHA1'
        );
      } catch (err) {
        //console.log(err)
        console.log(err);
      }

      /*
      this.twitterConnect = getTwitterConnect();
      const callback = response => {
        console.log('Twitter response: ', response);

        //resolve(this.drawUser());
      };
      this.twitterConnect.connect(callback);
      */
    });
  }

  drawUser(): SocialUser {
    let user: SocialUser = new SocialUser();
    /*
    let profile = this.auth2.currentUser.get().getBasicProfile();
    let authResponseObj = this.auth2.currentUser.get().getAuthResponse(true);
    user.id = profile.getId();
    user.name = profile.getName();
    user.email = profile.getEmail();
    user.image = profile.getImageUrl();
    user.token = authResponseObj.access_token;
    user.idToken = authResponseObj.id_token;

    */
    return user;
  }

  signIn(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      console.log('TwitterLoginProvider signIn: ', this.oauth);

      let api_key, oauth_token, request_url, popup;
      let authorize_url =
        'https://api.twitter.com/oauth/authenticate?oauth_token=';

      function closePopup() {
        if (popup && !popup.closed) {
          popup.close();
        }
      }

      function sendError(message, callback) {
        var response = {
          success: false,
          message: message || 'Some Error Occurred'
        };
        if (typeof callback === 'function') {
          callback(response);
        }
      }

      const getOAuthRequestToken = function(next) {
        this.oauth.getOAuthRequestToken(function(
          error,
          oauth_token,
          oauth_token_secret,
          results
        ) {
          if (error) {
            if (DEBUG) console.log('ERROR: ' + error);
            next();
          } else {
            var oauth = {
              token: oauth_token,
              token_secret: oauth_token_secret
            };
            if (DEBUG) console.log('oauth.token: ' + oauth.token);
            if (DEBUG) console.log('oauth.token_secret: ' + oauth.token_secret);
            next(oauth);
          }
        });
      };

      const getOAuthAccessToken = function(oauth, next) {
        this.oauth.getOAuthAccessToken(
          oauth.token,
          oauth.token_secret,
          oauth.verifier,
          function(
            error,
            oauth_access_token,
            oauth_access_token_secret,
            results
          ) {
            if (error) {
              if (DEBUG) console.log('ERROR: ' + error);
              next();
            } else {
              oauth.access_token = oauth_access_token;
              oauth.access_token_secret = oauth_access_token_secret;

              if (DEBUG) console.log('oauth.token: ' + oauth.token);
              if (DEBUG)
                console.log('oauth.token_secret: ' + oauth.token_secret);
              if (DEBUG)
                console.log('oauth.access_token: ' + oauth.access_token);
              if (DEBUG)
                console.log(
                  'oauth.access_token_secret: ' + oauth.access_token_secret
                );
              next(oauth);
            }
          }
        );
      };

      const getUrlQueryObject = query_string => {
        var vars = {},
          hash;
        if (!query_string) {
          return false;
        }
        var hashes = query_string.slice(1).split('&');
        for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars[hash[0]] = hash[1];
        }
        return vars;
      };

      const authorize = callback => {
        if (!popup) {
          return callback('Popup Not initialized');
        }
        popup.location.href = authorize_url + oauth_token;
        let wait = function() {
          setTimeout(function() {
            return popup.closed
              ? callback(null, getUrlQueryObject(popup.location.search))
              : wait();
          }, 25);
        };
        wait();
      };

      const getOAuthToken = callback => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status === 0) {
              return callback('Internet Disconnected/Connection Timeout');
            }

            try {
              var response = JSON.parse(this.response);
              callback(null, response);
            } catch (error) {
              callback(error.message);
            }
            return;
          }
        };
        xhr.open('GET', request_url, true);
        xhr.send();
      };

      const connect = callback => {
        if (!request_url) {
          return sendError('Request URL not provided', callback);
        }
        //Open a blank popup
        popup = window.open(
          null,
          '_blank',
          'height=400,width=800,left=250,top=100,resizable=yes',
          true
        );
        //Get an oauth token from the callback url
        getOAuthToken(function(error, response) {
          if (error) {
            closePopup();
            return sendError(error, callback);
          }

          if (!response.success) {
            closePopup();
            return sendError(response.message, callback);
          }
          console.log('getOAuthToken: ', response);
          //Set the OAuth1 Token
          oauth_token = response.oauth_token;
          //Ask the user to authorize the app;

          authorize(function(error, response) {
            console.log('getOAuthAccessToken: ', response);
            if (error) {
              closePopup();
              return sendError(error, callback);
            }
            if (!response || !response.oauth_token) {
              closePopup();
              return sendError('OAuth Token not Found', callback);
            }

            //Check if the oauth-token obtained in authorization, matches the original oauth-token
            if (response.oauth_token !== oauth_token) {
              return sendError(
                'Invalid OAuth Token received from Twitter.',
                callback
              );
            }

            callback({
              success: true,
              oauth_token: response.oauth_token,
              oauth_verifier: response.oauth_verifier
            });
          });
        });

        const onConnect = () => {
          console.log('Twitter connnected!!!!');
        };

        connect(onConnect);
      };
    });
  }

  signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      /*
      this.auth2.signOut().then((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
      */
    });
  }
  /*

Twitter.prototype.getOAuthRequestToken = function (next) {
    this.oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            if (DEBUG) console.log('ERROR: ' + error);
            next();
        }
        else {
            var oauth = {};
            oauth.token = oauth_token;
            oauth.token_secret = oauth_token_secret;
            if (DEBUG) console.log('oauth.token: ' + oauth.token);
            if (DEBUG) console.log('oauth.token_secret: ' + oauth.token_secret);
            next(oauth);
        }
    });
};

Twitter.prototype.getOAuthAccessToken = function (oauth, next) {
    this.oauth.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
        function (error, oauth_access_token, oauth_access_token_secret, results) {
            if (error) {
                if (DEBUG) console.log('ERROR: ' + error);
                next();
            } else {
                oauth.access_token = oauth_access_token;
                oauth.access_token_secret = oauth_access_token_secret;

                if (DEBUG) console.log('oauth.token: ' + oauth.token);
                if (DEBUG) console.log('oauth.token_secret: ' + oauth.token_secret);
                if (DEBUG) console.log('oauth.access_token: ' + oauth.access_token);
                if (DEBUG) console.log('oauth.access_token_secret: ' + oauth.access_token_secret);
                next(oauth);
            }
        }
    );
};
*/

  /*
Twitter.prototype.getUser = function (params, error, success) {
    var path = '/users/show.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};
*/

  /*
Twitter.prototype.doRequest = function (url, error, success) {
  */
  /*
    url = url.replace(/\!/g, "%21")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*  WHAT  /g, "%2A");
        */
  /*
    this.oauth.get(url, this.accessToken, this.accessTokenSecret, function (err, body, response) {
        if (!err && response.statusCode == 200) {
            limits = {
                "x-rate-limit-limit": response.headers['x-rate-limit-limit'],
                "x-rate-limit-remaining": response.headers['x-rate-limit-remaining'],
                "x-rate-limit-reset": response.headers['x-rate-limit-reset'],
            };
            success(body, limits);
        } else {
            error(err, response, body);
        }
    });
};

*/
}
