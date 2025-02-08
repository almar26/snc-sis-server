'use strict';

/**
 * class-setting service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::class-setting.class-setting');
