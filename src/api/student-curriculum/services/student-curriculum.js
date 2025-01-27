'use strict';

/**
 * student-curriculum service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::student-curriculum.student-curriculum');
