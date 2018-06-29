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
const APIMongo = require('./../lib/mongoAPIConn');

let TrafficAlertConfigSchema = new mongoose.Schema({
    account_id: { type: mongoose.SchemaTypes.ObjectId },
    name: { type: String },
    target_type: { type: String },
    target: { type: String },
    rule_type: { type: String },
    rule_config: { type: Object },
    status: { type: String, default: 'unknown' },
    created_at: { type: Date, default: Date.now() },
    created_by: { type: String },
    updated_at: { type: Date, default: Date.now() },
    updated_by: { type: String },
    last_hit: { type: Date, default: null },
    last_run: { type: Date, default: null },
    last_dispatch: { type: Date, default: null },
    notifications_list_id: { type: mongoose.SchemaTypes.ObjectId },
    silenced: { type: Boolean, default: false },
    silence_until: { type: Date, default: null }
});

const TrafficAlertConfig = APIMongo.model('TrafficAlertConfig', TrafficAlertConfigSchema, 'TrafficAlertConfig');

module.exports = TrafficAlertConfig;