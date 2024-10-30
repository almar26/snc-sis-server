'use strict';

/**
 * teacher-account service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::teacher-account.teacher-account');
