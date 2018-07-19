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
const fs = require('fs');
const config = require('config');
const Rule = require('./../classes/rule');
const TrafficAlertConfig = require('./../models/TrafficAlertConfig');
const rulesPoller = require('./../lib/rulesPoller');
const server = new hapi.Server();

// HTTPS connection for comunication with outside world
server.connection({
    host: config.service.host,
    port: config.service.port,
    tls: {
        key: fs.readFileSync(config.service.key_path),
        cert: fs.readFileSync(config.service.cert_path)
    },
    routes: { cors: true },
    router: {
        isCaseSensitive: false,
        stripTrailingSlash: false
    }
});

// HTTP connection for ElastAlert post alerts
server.connection({
    host: config.service.host,
    port: config.service.http_port,
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

server.ext('onRequest', (request, reply) => {
    // for debugging
    return reply.continue();
});
// Action before start server
function prepareStart(){
  return Rule.removeAllFiles()
    .then(function(){
      console.log('Old files with rules was deleted');
    })
    .catch(function(err){
      console.error(err);
      throw err;
    })
    .then(function(){
      return TrafficAlertConfig.find()
        .then(function(allConfigs){
          const promisesList = allConfigs.map((ruleConfig)=>{
            return Rule.generateRule(ruleConfig).catch();  
            });
            return Promise.all(promisesList);
        });
    })
    .catch(function(err){
      console.log('Fail preparing for start, but we go on. ',err);
      return Promise.resolve();
    });
}
 
prepareStart()
  .then(function(){
    server.start();
    rulesPoller.initPolling();
    console.log('HAPI Server started at ' + server.info.uri);
  });
