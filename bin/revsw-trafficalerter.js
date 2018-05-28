/*************************************************************************
 *
 * REV SOFTWARE CONFIDENTIAL
 *
 * [2013] - [2018] Rev Software, Inc.
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Rev Software, Inc. and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Rev Software, Inc.
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Rev Software, Inc.
 */

'use strict';

const hapi = require('hapi');
const config = require('config');
const boom = require('boom');
const mongoConn = require('./../lib/mongoConn');

const server = new hapi.Server();

server.connection({
    host: config.service.host,
    port: config.service.port,
    routes: { cors: true },
    router: {
        isCaseSensitive: false,
        stripTrailingSlash: false
    }
});

const goodOptions = {
    opsInterval: 60000,
    requestHeaders: true,
    requestPayload: true,
    responsePayload: true,
    responseEvent: 'response',
    reporters: [{
        reporter: require('good-console'),
        events: {
            log: '*',
            response: '*',
        }
    }]
};

server.register({
    register: require('good'),
    options: goodOptions
}, function (err) {
    if (err) {
        console.error(err);
    }
});

server.register({
    register: require('hapi-router'),
    options: {
        routes: 'routes/*.js'
    }
}, function (err) {
    if (err) {
        throw err;
    }
});

server.start();

console.log('HAPI Server started at ' + server.info.uri);