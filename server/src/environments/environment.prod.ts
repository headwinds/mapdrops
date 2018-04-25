export const environment = {
  production: true,
  url: 'https://mapdrops-api.now.sh',
  db: 'mongodb://headwinds:bedford22@jello.modulusmongo.net:27017/Aget3ebu',
  app: {
    name: 'cabinquest'
  },
  facebook: {
    clientID: '1523864221168236',
    clientSecret: 'f2a4451fcc3f213db8b03e580f3edc5f',
    callbackURL: 'http://cabinquest-50966.onmodulus.net/auth/facebook/callback'
  },
  twitter: {
    clientID: 'Sbrkfm4VFG8YhS4QriGrQD5aR',
    clientSecret: 'm31nnfIIm8ppvI44hcAgn4YBQQXM7APBmd359kl4lsxcb3XIBk',
    callbackURL: 'http://cabinquest-50966.onmodulus.net/auth/twitter/callback'
  },
  github: {
    clientID: 'b463b763d963b98427eb',
    clientSecret: 'e66caa9000194bf718c8d7189c8df147ad5dfbf3',
    callbackURL: 'http://cabinquest-50966.onmodulus.net/auth/github/callback'
  },
  google: {
    clientID:
      '519628292035-d5kmnmf00tgtnhpi2n3tiblcnnlpba1e.apps.googleusercontent.com',
    clientSecret: 'Ka_fJNc6zBmoCvYv_Sp8lsUl',
    callbackURL: 'http://cabinquest-50966.onmodulus.net/auth/google/callback'
  },
  port: process.env.PORT || 80,
  host: 'cabinquest.mod.bz'
};
