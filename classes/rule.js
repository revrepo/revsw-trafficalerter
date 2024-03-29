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
const fs = require('fs');

class Rule {
  constructor(payload) {
    this.rule_type = payload.rule_type.toLowerCase();
    this.name = payload.name;
    this.account_id = payload.account_id;
    this.target_type = payload.target_type;
    this.rule_config = payload.rule_config;
    this.config_id = payload.config_id;
    this.target = payload.target;
  }

  static removeAllFiles() {
    const rulesDir = config.rules_dir;
    return new Promise((resolve, reject) => {
      fs.readdir('./' + rulesDir, (err, files) => {
        console.log('Find ' + files.length + ' file(s) for remove');
        if (err) {
          reject(err);
        } else {
          files.forEach(filename => {
            fs.unlink(`./${rulesDir}/${filename}`);
          });
          resolve(true);
        }
      });
    });
  }

  static generateRule(ruleData) {
    const rule = new Rule({
      config_id: ruleData.id,
      rule_type: ruleData.rule_type.toLowerCase(),
      name: ruleData.name,
      account_id: ruleData.account_id,
      target_type: ruleData.target_type,
      rule_config: ruleData.rule_config,
      target: ruleData.target,
    });

    switch (rule.rule_type) {
      case 'spike':
        return rule.generateSpikeRule();
      case 'statuscode_frequency':
        return rule.generateStatusCodeFrequency();
      default:
        return Promise.reject('Unknow rule type' + rule.rule_type);
    }
  }
  generateSpikeRule() {
    const nowTime = Date.now();
    return new Promise((resolve, reject) => {
        if (this.rule_type !== 'spike') {
          return reject('Rule type is wrong');
        }
        const ruleTemplate = config.rule_templates.spike;
        let ruleFile = ruleTemplate.join('\n');
        ruleFile = ruleFile.replace(/{{ACCOUNTID}}/g, this.account_id);
        ruleFile = ruleFile.replace(/{{DOMAINID}}/g, this.target);
        ruleFile = ruleFile.replace(/{{DOMAIN_NAME}}/g, this.target);
        ruleFile = ruleFile.replace(/{{ESHOST}}/g, config.ElasticSearch.ESHost);
        ruleFile = ruleFile.replace(/{{ESPORT}}/g, config.ElasticSearch.ESPort);
        ruleFile = ruleFile.replace(/{{TIMESTAMP}}/g, nowTime);
        ruleFile = ruleFile.replace(/{{TYPE}}/g, this.rule_type);
        ruleFile = ruleFile.replace(/{{DIRECTION}}/g, this.rule_config.spike_direction);
        ruleFile = ruleFile.replace(/{{EVENTS}}/g, this.rule_config.spike_amount);
        ruleFile = ruleFile.replace(/{{TIMEFRAME}}/g, this.rule_config.timeframe);
        ruleFile = ruleFile.replace(/{{TIMEFRAME_TYPE}}/g, this.rule_config.timeframe_type);
        ruleFile = ruleFile.replace(/{{CONFIGID}}/g, this.config_id);
        resolve(ruleFile);
      })
      .then((ruleFile) => {
        const rulesDir = config.rules_dir;
        return new Promise((resolve, reject) => {
          fs.writeFile('./' + rulesDir +
            this.config_id +
            '_' + this.account_id +
            '_' + nowTime + '.yaml', ruleFile,
            function(err) {
              if (err) {
                return reject(err);
              }

              return resolve(true);
            });
        });
      });
  }

  generateStatusCodeFrequency() {
    const nowTime = Date.now();
    return new Promise((resolve, reject) => {
        if (this.rule_type !== 'statuscode_frequency') {
          return reject('Rule type is wrong');
        }

        const ruleTemplate = config.rule_templates.statusCode_frequency;
        let ruleFile = ruleTemplate.join('\n');
        ruleFile = ruleFile.replace(/{{ACCOUNTID}}/g, this.account_id);
        ruleFile = ruleFile.replace(/{{DOMAINID}}/g, this.target);
        ruleFile = ruleFile.replace(/{{DOMAIN_NAME}}/g, this.target);
        ruleFile = ruleFile.replace(/{{ESHOST}}/g, config.ElasticSearch.ESHost);
        ruleFile = ruleFile.replace(/{{ESPORT}}/g, config.ElasticSearch.ESPort);
        ruleFile = ruleFile.replace(/{{TIMESTAMP}}/g, nowTime);
        ruleFile = ruleFile.replace(/{{TYPE}}/g, 'frequency');
        ruleFile = ruleFile.replace(/{{EVENTS}}/g, this.rule_config.responses);
        ruleFile = ruleFile.replace(/{{TIMEFRAME}}/g, this.rule_config.timeframe);
        ruleFile = ruleFile.replace(/{{TIMEFRAME_TYPE}}/g, this.rule_config.timeframe_type);
        ruleFile = ruleFile.replace(/{{CONFIGID}}/g, this.config_id);
        ruleFile = ruleFile.replace(/{{STATUS_CODE}}/g, this.rule_config.status_code);
        resolve(ruleFile);
      })
      .then((ruleFile) => {
        const rulesDir = config.rules_dir;
        return new Promise((resolve, reject) => {
          fs.writeFile('./' + rulesDir +
            this.config_id +
            '_' + this.account_id +
            '_' + nowTime + '.yaml', ruleFile,
            function(err) {
              if (err) {
                return reject(err);
              }

              return resolve(true);
            });
        });
      });
  }
}

module.exports = Rule;