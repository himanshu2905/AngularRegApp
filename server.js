'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: 3000,
    routes: { cors:true}
});

//Connect to db
server.app.db = mongojs('registration', ['courses']);

//Load plugins and start server
server.register([
    require('./routes/courses')
], (err) => {

    if (err) {
        throw err;
    }

    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});
