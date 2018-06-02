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

const mongoose = require('mongoose');
const config = require('config');

const trafficAlertsConn = mongoose.createConnection(config.mongodb_url);

trafficAlertsConn.on('error', function (err) {
    console.log(['error'], 'Traffic alerts mongodb connect error: ' + err);
});

trafficAlertsConn.on('connected', function () {
    console.log('Mongoose connected to traffic alerts connection');
    console.log('Initiating mongo traffic alerts collection polling...');
    trafficAlertsConn.poller();
});

trafficAlertsConn.poller = function () {
    /**
     * Lets poll our traffic alerts mongo connection to log how many alerts we have,
     * Maybe later use it for analytics?
     */
    trafficAlertsConn.models.TrafficAlert.find({ seen_at: null }, function (err, res) {
        if (!err) {
            console.log('There are ' + res.length + ' unseen alerts in the system.');
            setTimeout(function () {
                trafficAlertsConn.poller();
            }, 5000);
        } else {
            console.log('Error polling mongo traffic alerts collection, pausing polling...');
        }
    });
};

module.exports = trafficAlertsConn;