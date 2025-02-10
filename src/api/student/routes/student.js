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
        method: 'GET',
        path: '/student/list/:coursetype',
        handler: 'student.getStudentListCourseType'
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
        path: '/student/import-ched',
        handler: 'student.importCHEDCSV'
    },
    {
        method: 'POST',
        path: '/student/import-diploma',
        handler: 'student.importDiplomaCSV'
    },
    {
        method: "PUT",
        path: '/student/update/:documentid',
        handler: "student.updateStudentDetails"
    }, 
    {
        method: "DELETE",
        path: '/student/delete/:documentid',
        handler: "student.deleteStudent"
    },
    {
        method: "GET",
        path: '/student/search',
        handler: "student.searchStudent"
    },
    {
        method: "PUT",
        path: '/student/update-course/:documentid',
        handler: "student.updateStudentCourse"
    }, 
    {
        method: "PUT",
        path: '/student/update-sy/all-students',
        handler: "student.updateAllStudentSY"
    }, 
]


module.exports = customRouter(defaultRouter, myExtraRoutes);
