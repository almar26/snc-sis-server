'use strict';

/**
 * student router
 */

// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;


const defaultRouter = createCoreRouter('api::student.student');

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
        path: '/student/test',
        handler: 'student.testApi'
    },
    {
        method: 'GET',
        path: '/student/list',
        handler: 'student.getStudentList'
    },
    {
        method: 'POST',
        path: '/student/create',
        handler: 'student.createStudent'
    },
    {
        method: 'GET',
        path: '/student/details/:documentid',
        handler: 'student.getStudentDetails'
    },
    {
        method: 'POST',
        path: '/student/import',
        handler: 'student.importCSV'
    }
]


module.exports = customRouter(defaultRouter, myExtraRoutes);
