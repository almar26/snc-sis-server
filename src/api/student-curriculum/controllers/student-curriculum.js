"use strict";

const curriculum = require("../../curriculum/controllers/curriculum");

/**
 * student-curriculum controller
 */
//@ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::student-curriculum.student-curriculum",
  ({ strapi }) => ({
    // Assign Student Curriculum
    async assignStudentCurriculum(ctx) {
      try {
        console.log("[assignStudentCurriculum] Incoming Request");
        let { student_id, curriculum_id } = ctx.request.body;

        let myPayload = {
          data: {},
          message: "Curriculum successfulyy assigned!",
          status: "success",
        };

        const result = await strapi.db
          .query("api::student-curriculum.student-curriculum")
          .create({
            data: {
              student_id: student_id,
              curriculum: curriculum_id,
            },
          });

        if (result) {
          myPayload.data = result;
          ctx.status = 200;
          return (ctx.body = myPayload);
        }
      } catch (err) {
        console.log("[assignStudentCurriculum] Error: ", err.message);
        // return ctx.badRequest(err.message, err);
        ctx.status = 404;
        ctx.body = err.message;
      }
    },

    // Get assigned curriculum
    async getAssignedCurriculum(ctx) {
      try {
        console.log("[getAssignedCurriculum] Incoming Request");
        const { studentid } = ctx.params;
        let myPayload = {
            data: {},
            message: "Curriculum successfully fetched!",
            status: "success",
          };
        const result = await strapi.entityService.findMany("api::student-curriculum.student-curriculum", {
            fields: ['id', 'student_id'],
            filters: {
                student_id: {
                    $eq: studentid
                }
            },
            populate: {
                curriculum: true,
            }
        })

        if (result) {
            myPayload.data = result;
            ctx.status = 200;
            return ctx.body = myPayload;
        }
      } catch (err) {
        console.log("[getAssignedCurriculum] Error:", err.message);
        return ctx.badRequest(err.message, err);
      }
    },
  })
);
