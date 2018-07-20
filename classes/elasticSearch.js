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

const config = require('config');
const elasticSearch = require('elasticsearch');

class ESClient {
    constructor() {
        this.client = new elasticSearch.Client({
            host: config.ElasticSearch.ESHost + ':' + config.ElasticSearch.ESPort,
            requestTimeout: 120000
        });
    }

    getClient() {
        return this.client;
    }

    pingClient() {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                return reject(false);
            }

            this.client.ping({
                requestTimeout: 30000,
                hello: 'elasticsearch'
            }, function (error) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(true);
                }
            });
        });
    }
}

module.exports = ESClient;