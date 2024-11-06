'use strict';

/**
 * curriculum router
 */

// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;
const defaultRouter = createCoreRouter("api::curriculum.curriculum");

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
        path: '/curriculum/test',
        handler: 'curriculum.testApi'
    },
    {
        method: 'GET',
        path: '/curriculum/course-list/:courseid',
        handler: 'curriculum.curriculumCourseList'
    },
    {
        method: 'POST',
        path: '/curriculum/create',
        handler: 'curriculum.createCurricula'
    },

]

module.exports = customRouter(defaultRouter, myExtraRoutes);
