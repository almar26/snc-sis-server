'use strict';

/**
 * curriculum controller
 */

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::curriculum.curriculum', ({ strapi }) => ({
    async testApi(ctx) {
        ctx.body = "Hello Curriculum",
        ctx.status = 200;
    },

    async curriculumCourseList(ctx) {
        try {
            console.log("[getCurriculumList] Incoming Request");
            const { courseid } = ctx.params;

            // const result = await strapi.db.query("api::curriculum.curriculum").findMany({ orderBy: { id: 'ASC' }});
            const result = await strapi.entityService.findMany("api::curriculum.curriculum", {
                filters: {
                    course_id: { $eq: courseid }
                }
            }).catch(err => {
                console.log(err);
            })
            
            if (result) {
                ctx.status = 200;
                return ctx.body = result;
            }
        } catch (err) {
            console.log("[creaetCourse] Error: ", err.message);
            return ctx.badRequest(err.message, err); 
        }
    },

    // Create Curriculum controller
    async createCurricula(ctx) {
        try {
            let {
                course_code,
                course_desc,
                major,
                effective_sy,
                course_id
            } = ctx.request.body;

            const myPayload = {
                data: {},
                message: "Curriculum successfully created!",
                status: "success"
            };

            let existingPayload = {
                message: `Curriculum "${effective_sy}" already exist!`,
                status: 'fail'
            }

            const checkDuplicate = await strapi.db.query("api::curriculum.curriculum").findMany({
                where: {
                    year: effective_sy,
                    course_id: course_id
                }
            })

            if (checkDuplicate.length != 0) {
                console.log("[createCurricula] Error: ", checkDuplicate)
                return ctx.body =  existingPayload;
                //return ctx.badRequest();
            }

            const result = await strapi.db.query("api::curriculum.curriculum").create({
                data: {
                    course_id: course_id,
                    course_code: course_code,
                    course_description: course_desc,
                    major: major,
                    year: effective_sy
                }
            });

            if (result) {
                myPayload.data = result;
                ctx.status = 200;
                return ctx.body = myPayload;
            }

        } catch (err) {
            console.log("[createCurricula] Error: ", err.message);
            return ctx.badRequest(err.message, err); 
        }
    }


}));
