'use strict';

/**
 * class router
 */
// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::class.class');

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
        path: '/class/test',
        handler: 'class.testApi'
    },
    {
        method: 'GET',
        path: '/class/class-list',
        handler: 'class.getMultipleParams'
    },
    {
        method: 'GET',
        path: '/class/list',
        handler: 'class.getClassList'
    },
    {
        method: 'POST',
        path: '/class/create',
        handler: 'class.createClass'
    },
    {
        method: 'GET',
        path: '/class/details/:documentid',
        handler: 'class.getClassDetails'
    },
    {
        method: "PUT",
        path: '/class/update/:documentid',
        handler: "class.updateClassDetails"
    },
    {
        method: "PUT",
        path: '/class/finalized/:documentid',
        handler: "class.finalizeClass"
    }
]

module.exports = customRouter(defaultRouter, myExtraRoutes);
