'use strict';

/**
 * student-subject router
 */

// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::student-subject.student-subject');

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
        method: 'POST',
        path: '/student-subject/create',
        handler: 'student-subject.createStudentSubject'
    },
]
module.exports = customRouter(defaultRouter, myExtraRoutes);
