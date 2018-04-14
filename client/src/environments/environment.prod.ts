export const environment = {
  production: true,
  url: 'https://mapdrops-api.now.sh',
  db: 'mongodb://localhost/nationalpark',
  // db: "mongodb://brandonflowers@gmail.com:pe$rohaR8u@jello.modulusmongo.net:27017/Aget3ebu",
  app: {
    name: 'cabinquest'
  },
  facebook: {
    clientID: '824907610982622',
    clientSecret: '0fad9d7b83b3bd89ca60d205e571d3ca',
    callbackURL: 'https://mapdrops.now.sh/auth/facebook/callback'
  },
  twitter: {
    clientID: 'GX6Zh0AyFv4OVXg5jncCkLkg9',
    clientSecret: 'YLzKwcUWnhYOGtUiyo9QnQYEjQIKjk80WKNsVlBjeqADONZyWl',
    callbackURL: 'https://mapdrops.now.sh/auth/twitter/callback'
  },
  github: {
    clientID: 'c2b4a2674c27571e7c80',
    clientSecret: '31b30ad2948165852381a2c7d7c506cb7966401e',
    callbackURL: 'https://mapdrops.now.sh/auth/github/callback'
  },
  google: {
    clientID:
      '347820260770-3h2jms65i96gur0s5nevtgl4h9gch1of.apps.googleusercontent.com',
    clientSecret: 'bSJtwAoNAE66UfBh191hEU_Q',
    callbackURL: 'https://mapdrops.now.sh/auth/google/callback'
  },
  //port: process.env.PORT || 3000,
  host: 'https://mapdrops.now.sh',
  mapbox: {
    accessToken:
      'pk.eyJ1IjoiaGVhZHdpbmRzIiwiYSI6ImNpeW4yZzBzNDAwMHYzMnBjaDg1bWdtdXkifQ.JiFmZ8e4sWbtaCyna-Qfow' // Can also be set per map (accessToken input of mgl-map)
    //geocoderAccessToken: 'TOKEN'
  },
  firebaseConfig: {
    apiKey: 'AIzaSyDswh_1WurnjTUdhSgkQ7Dpj1BSpZcOQKQ',
    authDomain: 'cabinquest-firestore.firebaseapp.com',
    databaseURL: 'https://cabinquest-firestore.firebaseio.com',
    projectId: 'cabinquest-firestore',
    storageBucket: 'cabinquest-firestore.appspot.com',
    messagingSenderId: '269904185014'
  }
};
