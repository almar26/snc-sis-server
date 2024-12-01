'use strict';

/**
 * course router
 */
// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter("api::course.course");

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
        path: '/course/test',
        handler: 'course.testApi'
    },
    {
        method: 'POST',
        path: '/course/create',
        handler: 'course.createCourse'
    },
    {
        method: 'GET',
        path: '/course/list',
        handler: 'course.getCourseList'
    },
    {
        method: 'GET',
        path: '/course/details/:documentid',
        handler: 'course.getCourseDetails'
    },
    {
        method: 'PUT',
        path: '/course/update/:documentid',
        handler: 'course.updateCourseDetails'
    },
    {
        method: "DELETE",
        path: '/course/delete/:documentid',
        handler: "course.deleteCourse"
    }
]

module.exports = customRouter(defaultRouter, myExtraRoutes);
