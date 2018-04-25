// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  url: 'http://localhost:8080',
  google: {
    clientID:
      '347820260770-3h2jms65i96gur0s5nevtgl4h9gch1of.apps.googleusercontent.com',
    clientSecret: 'bSJtwAoNAE66UfBh191hEU_Q',
    callbackURL: 'http://localhost:8080/auth/google/callback'
  }
};
