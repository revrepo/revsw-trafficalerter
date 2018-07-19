

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
const ESClient = require('./../classes/elasticSearch');

const HealthCheck = {
    healthCheck: function (request, reply) {

        const ESConn = new ESClient();

        ESConn.pingClient().then(function (res) {
            if (!res) {
                return reply(boom.serverUnavailable('Something is wrong with ElasticSearch'));
            } else {
                const msg = {
                    statusCode: 200,
                    message: 'All systems are OK!'
                };

                return reply(msg);
            }
        })
            .catch(function (err) {
                return reply(boom.serverUnavailable('Something is wrong with ElasticSearch',err));
            });
    }
};

module.exports = HealthCheck;