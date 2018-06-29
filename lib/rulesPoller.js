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

const TrafficAlertConfig = require('./../models/TrafficAlertConfig');
const config = require('config');
const fs = require('fs');
const Utils = require('./utils');
const moment = require('moment');
const RevswAPI = require('./../classes/RevswAPI');
const API = new RevswAPI();

const POLL_INTERVAL = 60000; // ElastAlert polling interval

const RulesPoller = {
    initPolling: function () {
        this.pollRules();
    },

    pollRules: function () {
        const me = this;
        console.log('Polling rules...');
        TrafficAlertConfig.find(function (err, res) {
            if (err) {
                console.log('Error polling rules: ' + err);
            }

            let downRules = res.filter((rule) => rule.status === 'down');
            let unknownRules = res.filter((rule) => rule.status === 'unknown');
            let silencedRules = res.filter((rule) => rule.silenced && rule.silence_until);

            if (silencedRules) {
                silencedRules.forEach(function (rule) {
                    if (rule.silenced && rule.silence_until) {
                        if (moment(Date.now()).isAfter(moment(rule.silence_until))) {
                            let ruleCopy = JSON.parse(JSON.stringify(rule));
                            delete ruleCopy._id;
                            ruleCopy.silenced = false;
                            ruleCopy.silence_until = null;
                            TrafficAlertConfig.update({ _id: rule._id }, ruleCopy, function (err) {
                                if (err) {
                                    console.log('Error updating rule: ' + err);
                                } else {
                                    console.log('Rule unsilenced: ' + rule._id);
                                }
                            });
                        }
                    }
                });
            }

            if (unknownRules) {
                unknownRules.forEach(function (rule) {
                    if (!rule.last_hit || !rule.last_dispatch) {
                        let ruleCopy = JSON.parse(JSON.stringify(rule));
                        delete ruleCopy._id;
                        ruleCopy.status = 'up';
                        TrafficAlertConfig.update({ _id: rule._id }, ruleCopy, function (err) {
                            if (err) {
                                console.log('Error updating rule: ' + err);
                            } else {
                                console.log('Rule status changed to `up`: ' + rule._id);
                            }
                        });
                    }
                });
            }

            if (downRules) {
                downRules.forEach(function (rule) {
                    // rules are down and waiting for recovery signal
                    let timeframe = rule.rule_config.timeframe;
                    let timeframeType = rule.rule_config.timeframe_type;
                    let ruleTimeframeSec = Utils.timeframeToSeconds(timeframe, timeframeType);
                    let dateDiff = moment(Date.now()).diff(rule.last_hit, 'seconds');
                    if (dateDiff > ruleTimeframeSec) {
                        // issue a recovery alert
                        let ruleCopy = JSON.parse(JSON.stringify(rule));
                        delete ruleCopy._id;
                        ruleCopy.status = 'up';
                        TrafficAlertConfig.update({ _id: rule._id }, ruleCopy, function (err) {
                            if (err) {
                                console.log('Error updating rule: ' + err);
                            } else {
                                console.log('Rule status changed to `up`: ' + rule._id);

                                if (!rule.silenced) {
                                    let notificationContent = `
                                    ${rule.name} - Recover Status!
                                `;

                                    let notificationTitle = rule.name + ' - Recovery!';

                                    API.post('/v1/notification_lists/' +
                                        rule.notifications_list_id +
                                        '/send_notification', {
                                            notification_content: notificationContent,
                                            notification_title: notificationTitle
                                        }).then(function (res) {
                                            console.log('Recovery alert dispatched');
                                        })
                                        .catch(function (err) {
                                            console.log('ERROR sending recovery alert');
                                        });
                                }
                            }
                        });
                    }
                });
            }

            setTimeout(function () {
                me.pollRules();
            }, POLL_INTERVAL);
        });
    }
};

module.exports = RulesPoller;