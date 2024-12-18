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
        method: "GET",
        path: '/subject/course-list/:coursecode',
        handler: 'subject.getSubjectCourse'
    },
    {
        method: 'POST',
        path: '/subject/create',
        handler: 'subject.createSubjCurri'
    },
    {
        method: 'PUT',
        path: '/subject/update/:documentid',
        handler: 'subject.updateSubject'
    }, 
    {
        method: 'DELETE',
        path: '/subject/delete/:documentid',
        handler: 'subject.deleteSubject'
    }


]

module.exports = customRouter(defaultRouter, myExtraRoutes);
