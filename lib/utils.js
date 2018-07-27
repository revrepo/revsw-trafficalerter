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

const Utils = {
  timeframeToSeconds(timeframe, timeframe_type) {
    switch (timeframe_type) {
      case 'seconds':
        return timeframe;
      case 'minutes':
        return timeframe * 60;
      case 'hours':
        return timeframe * 60 * 60;
      case 'days':
        return timeframe * 60 * 60 * 24;
      default:
        return false;
    }
  },

  ruleTypeToString(type) {
    const typeName = type.toLowerCase();
    switch (typeName) {
      case 'spike':
        return 'Spike';
      case 'statuscode_frequency':
        return 'Status Code Frequency';
      default:
        return 'unknown';
    }
  }
};

module.exports = Utils;