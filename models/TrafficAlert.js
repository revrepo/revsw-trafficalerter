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
const mongooseConn = require('./../lib/mongoConn');

let TrafficAlertSchema = new mongoose.Schema({
    config_id: { type: mongoose.SchemaTypes.ObjectId },
    created_at: { type: Date, default: Date.now() },
    seen_at: { type: Date, default: null },
    seen_by: { type: String, default: null }
});

const TrafficAlert = mongooseConn.model('TrafficAlert', TrafficAlertSchema);

module.exports = TrafficAlert;