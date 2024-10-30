'use strict';

/**
 * excel-import service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::excel-import.excel-import');
