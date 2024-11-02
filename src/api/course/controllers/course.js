'use strict';

const { filter } = require('../../../../config/middlewares');

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

    async getCourseDetails(ctx) {
        try {
            console.log("[getCourseDetails] Incoming Request");
            const { documentid } = ctx.params;

            let myPayload = {
                data: [],
                message: "Successfully fetch data!",
                status: "success"
            };

            const result = await strapi.entityService.findMany("api::course.course", {
                filters: {
                    documentId: { $eq: documentid }
                }
            }).catch(err => {
               console.log(err);
            })

            // if (result.length <= 0) {
            //     ctx.status = 200;
            //     return ctx.body = {
            //         data: [],
            //         message: "No Record Found!",
            //         status: "failed"
            //     };
            // }

            if (result) {
                console.log(result);
                ctx.status = 200;
                return ctx.body = result;
            }

        } catch (err) {
            console.log("[getCourseDetails] Error: ", err.message);
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
