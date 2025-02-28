'use strict';

/**
 * teacher-account router
 */

// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter("api::teacher-account.teacher-account");

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
        path: '/teacher-acccount/test',
        handler: 'teacher-account.testApi'
    },
    {
        method: 'POST',
        path: '/teacher-acccount/create',
        handler: 'teacher-account.createTeacherAccount'
    },
    {
        method: 'GET',
        path: '/teacher-acccount/list/:department',
        handler: 'teacher-account.getTeacherAccountsList'
    },
    {
        method: 'PUT',
        path: '/teacher-account/update/:teacherid',
        handler: 'teacher-account.updateTeacherAccount'
    },
    {
        method: 'GET',
        path: '/teacher-acccount/details/:teacherid',
        handler: 'teacher-account.getTeacherDetails'
    },
    {
        method: 'GET',
        path: '/teacher-acccount/teachers-list',
        handler: 'teacher-account.getTeachersList'
    },
    {
        method: 'POST',
        path: '/teacher-acccount/change-password',
        handler: 'teacher-account.changeUserPassword',
        config: {
            find: {
                auth: true
            }
        }
    }
]

module.exports = customRouter(defaultRouter, myExtraRoutes);
