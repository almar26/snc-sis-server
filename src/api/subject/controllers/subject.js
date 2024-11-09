'use strict';

/**
 * subject controller
 */
// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subject.subject', ({ strapi }) => ({

    // Get the list of subject by curriculum id
    async getSubject(ctx) {
        try {
            console.log("[getSubject] Incoming Request");
            const { curriculumid } = ctx.params;

            let myPayload = {
                data: [],
                message: "Successfully fetch data!",
                status: "success",
            };

            const result = await strapi.entityService.findMany("api::subject.subject", {
                filters: {
                    curriculum_id: { $eq: curriculumid }
                }
            }).catch(err => {
                console.log(err);
            })

            if (result) {
                console.log(result);
                ctx.status = 200;
                return ctx.body = result;
            }

        } catch (err) {
            console.log("[createSubjCurri] Error: ", err.message);
            return ctx.badRequest(err.message, err);
        }
    },
    
    // Create Subject for curriculum
    async createSubjCurri(ctx) {
        try {
            let {
                curri_id,
                subj_code,
                subj_title,
                year_level,
                semester,
                lec,
                lab,
                units,
                resultant
            } = ctx.request.body;

            let myPayload = {
                data: {},
                message: 'Subject successfully created!',
                status: 'success'
            };
            
            let existingPayload = {
                message: `Subjet code "${subj_code}" already exist!`,
                status: 'fail'
            }
            

            const checkDuplicate = await strapi.db.query("api::subject.subject").findMany({
                where: {
                    code: subj_code,
                    curriculum_id: curri_id
                }
            })

            if (checkDuplicate.length != 0) {
                console.log("[createSubjCurri] Error: ", checkDuplicate)
                return ctx.body =  existingPayload;
                //return ctx.badRequest();
            }

            const result = await strapi.db.query("api::subject.subject").create({
                data: {
                    curriculum_id: curri_id,
                    code: subj_code,
                    title: subj_title,
                    year_level: year_level,
                    semester: semester,
                    units:  units,
                    lec: lec,
                    lab: lab,
                    resultant: resultant
                }
            });

            if (result) {
                myPayload.data = result;
                ctx.status = 200;
                return ctx.body = myPayload;
            }
        } catch (err) {
            console.log("[createSubjCurri] Error: ", err.message);
            return ctx.badRequest(err.message, err);
        }
    }
}));
