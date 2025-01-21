'use strict';

/**
 * student-sy-history router
 */
// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;
const defaultRouter = createCoreRouter("api::student-sy-history.student-sy-history");

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
        path: '/sy-history/student/:studentid',
        handler: 'student-sy-history.getStudentSYHistory'
    },
    {
        method: 'POST',
        path: '/sy-history/student/create',
        handler: 'student-sy-history.createStudentSYHistory'
    }
  
]

module.exports = customRouter(defaultRouter, myExtraRoutes);
