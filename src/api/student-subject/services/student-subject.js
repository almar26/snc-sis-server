'use strict';

/**
 * student-subject service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::student-subject.student-subject');
