'use strict';

/**
 * subject router
 */
// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter("api::subject.subject");

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
        method: "GET",
        path: '/subject/list/:curriculumid',
        handler: 'subject.getSubject'
    },
    {
        method: 'POST',
        path: '/subject/create',
        handler: 'subject.createSubjCurri'
    },

]

module.exports = customRouter(defaultRouter, myExtraRoutes);
