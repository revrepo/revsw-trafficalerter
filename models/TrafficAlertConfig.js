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
    target_type: { type: String },
    target: { type: String },
    rule_type: { type: String },
    rule_config: { type: Object },
    status: { type: String },
    created_at: { type: Date, default: Date.now() },
    created_by: { type: String },
    updated_at: { type: Date, default: Date.now() },
    updated_by: { type: String },
    notification_list_id: { type: mongoose.SchemaTypes.ObjectId }

});

const TrafficAlertConfig = APIMongo.model('TrafficAlertConfig', TrafficAlertConfigSchema, 'TrafficAlertConfig');

module.exports = TrafficAlertConfig;