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

const POLL_INTERVAL = 5000;

const RulesPoller = {
    initPolling: function () {
        this.pollRules();
    },

    pollRules: function () {
        const me = this;
        setTimeout(function () {
            console.log('Polling rules...');
            TrafficAlertConfig.find(function (err, res) {
                if (err) {
                    console.log('Error polling rules: ' + err);
                }

                res.forEach(function (rule) {
                    let flaggie = false;
                    fs.readdir('./alertRules', (error, files) => {
                        files.forEach(file => {
                            if (file.indexOf(rule._id) !== -1) {
                                flaggie = true;
                            }
                        });

                        if (!flaggie && config.delete_rules_without_files) {
                            TrafficAlertConfig.remove({ _id: rule._id }, function (err) {
                                if (err) {
                                    console.log('Error deleting rule without file: ' + rule._id);
                                } else {
                                    console.log('Successfully deleted rule without a file: ' + rule._id);
                                }
                            });
                        }

                        if (err) {
                            console.log('Error polling rules: ' + error);
                        }

                        if (!files) {
                            console.log('There are no rule files in the system');
                        }
                    });
                });

                fs.readdir('./alertRules', (error, files) => {
                    files.forEach(file => {
                        let ruleFile = res.find(function (rule) {
                            return file.indexOf(rule._id) !== -1;
                        });

                        if (!ruleFile && config.delete_rules_without_files) {
                            fs.unlink('./alertRules/' + file, function (err) {
                                if (err) { return console.log(err); }
                                else {
                                    console.log('file deleted successfully: ' + file);
                                }
                            });
                        }
                    });

                    if (err) {
                        console.log('Error polling rules: ' + error);
                    }

                    if (!files) {
                        console.log('There are no rule files in the system');
                    }
                });

                me.pollRules();
            });
        }, POLL_INTERVAL);
    }
};

module.exports = RulesPoller;