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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const config = require('config');
const request = require('supertest');
const API = 'https://' + config.API.host + ':' + config.API.port;

class RevswAPI {
    get(endpoint, params) {
        return request(API)
            .get(endpoint)
            .set('X-TRAFFICALERTER-TOKEN', config.API.token)
            .query(params);
    }

    post(endpoint, payload) {
        return request(API)
            .post(endpoint)
            .set('X-TRAFFICALERTER-TOKEN', config.API.token)
            .send(payload);
    }
}

module.exports = RevswAPI;