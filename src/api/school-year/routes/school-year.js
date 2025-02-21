'use strict';

/**
 * school-year router
 */
// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;
const defaultRouter = createCoreRouter("api::school-year.school-year");

const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;
    return {
        get prefix() {
            return innerRouter.prefix;
        },

        get routes() {
            if (!routes) routes = innerRouter.routes.concat(extraRoutes);
            return routes;
        }
    }
};

const myExtraRoutes = [
    {
        method: 'GET',
        path: '/school-year/active',
        handler: 'school-year.getActiveSchoolYear'
    },
    {
        method: "GET",
        path: "/school-year/list",
        handler: 'school-year.getAllSchoolYear'
    },
    {
        method: 'GET',
        path: '/school-year/inactive',
        handler: 'school-year.getInactiveSchoolYear'
    },
]


module.exports = customRouter(defaultRouter, myExtraRoutes);
