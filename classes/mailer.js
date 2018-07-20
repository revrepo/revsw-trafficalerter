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
const sendgrid = require('sendgrid')(config.get('sendgrid_api_key'));

class Mailer {
    constructor() {
    }

    sendMail(from, to, subject, body) {
        return new Promise(function (resolve, reject) {
            if (!to || to === '') {
                return reject('To address not specified');
            }

            if (!subject || subject === '') {
                return reject('Subject not specified');
            }

            if (!body || body === '') {
                return reject('Body not specified');
            }

            var vendorProfiles = config.vendor_profiles;
            var systemVendor = vendorProfiles[config.default_system_vendor_profile];

            let mailOptions = {
              to: to,
              from: from, 
              html: body,
              subject: subject,
              fromName: systemVendor.support_name
            };

            if (!from || from === '') {
                mailOptions.from = systemVendor.support_email;
            }
            
            sendgrid.send(mailOptions, function (err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    sendBulkMail(mails) {
        const me = this;
        return new Promise(function (resolve, reject) {
            for (let i = 0; i < mails.length; i++) {
                me.sendMail(mails[i].from, mails[i].to, mails[i].subject, mails[i].body);
                if (i === mails.length - 1) {
                    return resolve(true);
                }
            }
        });
    }
}

module.exports = Mailer;