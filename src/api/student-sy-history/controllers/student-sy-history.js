"use strict";

/**
 * student-sy-history controller
 */
// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::student-sy-history.student-sy-history",
  ({ strapi }) => ({
    // Get Student School Year History
    async getStudentSYHistory(ctx) {
      try {
        console.log("[getStudentSYHistory] Incoming Request");
        const { studentid } = ctx.params;
        const result = await strapi.db
          .query("api::student-sy-history.student-sy-history")
          .findMany({
            where: { student_id: studentid },
            orderBy: { createdAt: "DESC" },
          });
        if (result) {
          console.log(result);
          ctx.status = 200;
          return (ctx.body = result);
        }
      } catch (err) {
        console.log("[getStudentSYHistory] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    // Add Student School Year History
    async createStudentSYHistory(ctx) {
      try {
        console.log("[createStudentSYHistory] Incoming Request");
        let {
          student_id,
          course_code,
          course_description,
          school_year,
          semester,
          major,
          course_type
        } = ctx.request.body;

        let myPayload = {
          data: {},
          message: "Successfully Craeted!",
          status: "success",
        };

        let existingPayload = {
          message: `${semester} school year ${school_year} already exist!`,
          status: "fail",
        };

        const checkDuplicate = await strapi.db.query("api::student-sy-history.student-sy-history").findMany({
          where: {
            student_id: student_id,
            school_year: school_year,
            semester: semester
          }
        })

        if (checkDuplicate.length != 0) {
          console.log("[createStudentSYHistory] Error: ", checkDuplicate);
          return (ctx.body = existingPayload);
        }

        // Update Student School Year
        await strapi.db
          .query("api::student-sy-history.student-sy-history")
          .create({
            data: {
              student_id: student_id,
              course_code: course_code,
              course_description: course_description,
              school_year: school_year,
              semester: semester,
            },
          });

        
        // Update student course
        await strapi.db.query("api::student.student").update({
          where: { documentId: student_id },
          data: {
            school_year: school_year,
            semester: semester,
            course: course_description,
            course_code: course_code,
            major: major,
            course_type: course_type
          }
        })

        // if (result) {
        //   myPayload.data = result;
        //   ctx.status = 200;
        //   return (ctx.body = myPayload);
        // }
        return ctx.send(myPayload);
      } catch (err) {
        console.log("[createStudentSYHistory] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },
  })
);
