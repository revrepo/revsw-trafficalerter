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

const boom = require('boom');
const TrafficAlert = require('./../models/TrafficAlert');
const TrafficAlertConfig = require('./../models/TrafficAlertConfig'); 
const RevswAPI = require('./../classes/RevswAPI');
const API = new RevswAPI(); 
const Utils = require('./../lib/utils');

const Alerts = {
    createAlert: function (request, reply) {

        if (!request.payload.config_id || request.payload.config_id === '') {
            return reply(boom.badRequest('Config ID not supplied'));
        }

        /**
         * Get the alert config for this alert, and dispatch a new alert
         * to the system according to that config.
         */
        TrafficAlertConfig.findById(request.payload.config_id, function (err, conf) {

            if (!conf || conf.length === 0) {
                return reply(boom.badRequest('Traffic Alert Configuration Not Found'));
            }

            // let confTimeframeSec = Utils
            //     .timeframeToSeconds(conf.rule_config.timeframe, conf.rule_config.timeframe_type);

            if (conf.status !== 'down') {

                conf.status = 'down';
                conf.last_dispatch = Date.now();
                conf.last_hit = Date.now();

                let confCopy = JSON.parse(JSON.stringify(conf));
                delete confCopy._id;

                TrafficAlertConfig.update({ _id: request.payload.config_id }, confCopy, 
                  function (error) {
                    if (error) {
                        return reply(boom.badRequest('Error updating Rule Config'));
                    }

                    let newAlert = {
                        config_id: request.payload.config_id,
                        created_at: Date.now(),
                        seen_at: null,
                        seen_by: null
                    };

                    TrafficAlert.create([newAlert], function (err, res) {
                        if (err) {
                            return reply(boom.badImplementation(err));
                        }

                        // Tell the API to send the notifications...

                        if (!conf.silenced) {
                            let numHits = request.payload.num_hits;
                            let notificationContent = `
                            A new traffic alert was triggered for ${conf.target_type}: 
                            <strong>${conf.target}</strong><br />
        
                            <strong><u>Traffic Alert Details:</u></strong>
                            <ul>
                                <li>Alert type: ${Utils.ruleTypeToString(conf.rule_type)}</li>
                                <li>Alert created at: ${Date.now()}</li>
                                <li>Number of responses triggering the alert: ${numHits}</li>
                            </ul>
                        `;

                        let notificationTitle = conf._doc.name + ' - New Traffic Alert!';

                        API.post('/v1/notification_lists/' +
                            conf._doc.notifications_list_id +
                            '/send_notification', {
                                notification_content: notificationContent,
                                notification_title: notificationTitle
                            }).then(function (res) {
                                return reply(res.body);
                            })
                            .catch(function (err) {
                                return reply(boom.badRequest(err));
                            });
                        } else {
                            return reply('Success');
                        }
                    });
                });
            } else {
                conf.last_hit = Date.now();
                let confCopy = JSON.parse(JSON.stringify(conf));
                delete confCopy._id;
                TrafficAlertConfig.update({ _id: request.payload.config_id }, confCopy, 
                  function (error) {
                    if (error) {
                        return reply(boom.badRequest('Error updating Rule Config'));
                    }

                    return reply('OK');
                });
            }
        });
    }
};

module.exports = Alerts;