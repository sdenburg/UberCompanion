var Uber = require('node-uber');
var uberConfiguration = require('./UberConfiguration.json');

var uber = new Uber({
    client_id: uberConfiguration.client_id,
    client_secret: 'CLIENT_SECRET',
    server_token: 'SERVER_TOKEN',
    redirect_uri: 'REDIRECT URL',
    name: 'APP_NAME',
    language: 'en_US', // optional, defaults to en_US
    sandbox: true, // optional, defaults to false
    proxy: 'PROXY URL' // optional, defaults to none
  });
