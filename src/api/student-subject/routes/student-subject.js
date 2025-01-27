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
    {
        method: 'GET',
        path: '/student-subject/list/:classid',
        handler: 'student-subject.getStudentSubjectList'
    },
    {
        method: 'PUT',
        path: '/student-subject/add-grade/:documentid',
        handler: 'student-subject.addSubjectGrade'
    },
    {
        method: 'DELETE',
        path: '/student-subject/delete/:documentid',
        handler: 'student-subject.deleteSubjectGrade'
    },
    {
        method: 'GET',
        path: '/student-subject/grades',
        handler: 'student-subject.getStudentGrades'
    },
    {
        method: 'GET',
        path: '/student-subject/all-subjects/:studentid',
        handler: 'student-subject.getAllStudentSubjects'
    },
]
module.exports = customRouter(defaultRouter, myExtraRoutes);
