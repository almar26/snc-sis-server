'use strict';

/**
 * course controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::course.course', ({ strapi }) => ({
    async testApi(ctx) {
        ctx.body = "Hello World!",
        ctx.status = 200;
    },

    async getCourseList(ctx) {
        try {
            console.log("[getCourseList] Incoming Request");
            const result = await strapi.db.query("api::course.course").findMany({ orderBy: { id: 'ASC'}});
            if (result) {
                ctx.status = 200;
                return ctx.body = result;
            }

        } catch (err) {
            console.log("[creaetCourse] Error: ", err.message);
            return ctx.badRequest(err.message, err);
        }
    },

    async createCourse(ctx) {
        try {
            let {
                course_code,
                course_description,
                major
            } = ctx.request.body;

            let myPayload = {
                data: {},
                message: 'Course successfully created!',
                status: 'success'
            };

            const result = await strapi.db.query("api::course.course").create({
                data: {
                  code: course_code,
                  description: course_description,
                  major: major  
                }
            })

            if (result) {
                myPayload.data = result;
                ctx.status = 200;
                return ctx.body = myPayload;
            }
        } catch (err) {
            console.log("[creaetCourse] Error: ", err.message);
            return ctx.badRequest(err.message, err);
        }
    }
}));
