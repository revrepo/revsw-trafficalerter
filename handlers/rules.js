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
const Rule = require('./../classes/rule');
const fs = require('fs');

const Rules = {
    createRule: function (request, reply) {
        let newRule = new Rule(request.payload);

        switch (newRule.rule_type) {
            case 'spike':
                newRule.generateSpikeRule().then(function () {
                    return reply(newRule);
                })
                    .catch(function (err) {
                        return reply(boom.badRequest(err));
                    });
                break;
            case 'statuscode_frequency':
                newRule.generateStatusCodeFrequency().then(function () {
                    return reply(newRule);
                })
                    .catch(function (err) {
                        return reply(boom.badRequest(err));
                    });
                break;
            default:
                return reply(boom.badRequest('Rule type is undefined'));
        }
    },

    getRuleStatus: function (request, reply) {
        let ruleId = request.params.rule_id;

        fs.readdir('./alertRules', (err, files) => {
            files.forEach(file => {
                if (file.indexOf(ruleId) !== -1) {
                    return reply('Healthy');
                } else if (files.indexOf(file) === files.length - 1) {
                    return reply('Inactive');
                }
            });

            if (err) {
                return reply(boom.badRequest(err));
            }

            if (!files) {
                return reply('There are no rule files in the system');
            }
        });
    }
};

module.exports = Rules;