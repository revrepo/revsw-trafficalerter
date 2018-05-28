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
const boom = require('boom');
const TrafficAlert = require('./../models/TrafficAlert');

const Alerts = {
    createAlert: function (request, reply) {
        let newAlert = {
            config_id: request.payload.config_id,
            created_at: Date.now(),
            seen_at: null,
            seen_by: null
        }

        TrafficAlert.create([newAlert], function (err, res) {
            if (err) {
                return reply(boom.badImplementation(err));
            }

            return reply(res);
        });
    }
};

module.exports = Alerts;