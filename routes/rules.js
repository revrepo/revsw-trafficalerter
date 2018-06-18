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

const rules = require('../handlers/rules');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const Rules = [
    {
        method: 'POST',
        path: '/v1/rules',
        config: {
            auth: false,
            handler: rules.createRule,
            description: 'Create a new rule for ElastAlert',
            validate: {
                payload: {
                    name: Joi.string().min(2).max(100).required(),
                    account_id: Joi.objectId().required(),
                    config_id: Joi.objectId().required(),
                    target_type: Joi.string().allow(['domain', 'app']).required(),
                    target: Joi.string().required(),
                    rule_type: Joi.string().required(),
                    rule_config: Joi.object().required(),
                    created_at: Joi.date(),
                    notifications_list_id: Joi.objectId().required(),
                    created_by: Joi.string(),
                    updated_by: Joi.string(),
                    updated_at: Joi.date()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/v1/rules/{rule_id}/status',
        config: {
            auth: false,
            handler: rules.getRuleStatus,
            description: 'Get rule status',
            validate: {
                params: {
                    rule_id: Joi.objectId().required(),
                }
            }
        }
    }
];

module.exports = Rules;