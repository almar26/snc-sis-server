"use strict";

/**
 * course controller
 */
// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::course.course", ({ strapi }) => ({
  async testApi(ctx) {
    (ctx.body = "Hello World!"), (ctx.status = 200);
  },

  async getCourseList(ctx) {
    try {
      console.log("[getCourseList] Incoming Request");
      const result = await strapi.db
        .query("api::course.course")
        .findMany({ orderBy: { id: "ASC" } });
      if (result) {
        ctx.status = 200;
        return (ctx.body = result);
      }
    } catch (err) {
      console.log("[getCourseList] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Get List of Course by course type "ched or tesda"
  async getCourseListByType(ctx) {
    const { coursetype } = ctx.params;
    try {
      console.log("[getCourseListByType] Incoming Request");
      const result = await strapi.db.query("api::course.course").findMany({
        where: { course_type: coursetype },
        orderBy: { id: "ASC" },
      });
      if (result) {
        ctx.status = 200;
        return (ctx.body = result);
      }
    } catch (err) {
      console.log("[getCourseListByType] Error: ", err.message);
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
        status: "success",
      };

      const result = await strapi.entityService
        .findMany("api::course.course", {
          filters: {
            documentId: { $eq: documentid },
          },
        })
        .catch((err) => {
          console.log(err);
        });

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
        return (ctx.body = result);
      }
    } catch (err) {
      console.log("[getCourseDetails] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  async createCourse(ctx) {
    try {
      console.log("[createCourse] Incoming Request");
      let { course_code, course_description, major, year, course_type } =
        ctx.request.body;

      let myPayload = {
        data: {},
        message: "Course successfully created!",
        status: "success",
      };

      let existingPayload = {
        message: `Course "${course_code}" already exist!`,
        status: "fail",
      };

      const checkDuplicate = await strapi.db
        .query("api::course.course")
        .findMany({
          where: {
            code: course_code,
          },
        });

      if (checkDuplicate.length != 0) {
        console.log("[createCourse] Error: ", checkDuplicate);
        return (ctx.body = existingPayload);
        //return ctx.badRequest();
      }

      const result = await strapi.db.query("api::course.course").create({
        data: {
          code: course_code,
          description: course_description,
          major: major,
          year: year,
          course_type: course_type,
        },
      });

      if (result) {
        myPayload.data = result;
        ctx.status = 200;
        return (ctx.body = myPayload);
      }
    } catch (err) {
      console.log("[creaetCourse] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Update Course Details
  async updateCourseDetails(ctx) {
    try {
      console.log("[updateCourseDetails] Incoming Request");
      const { documentid } = ctx.params;
      let {
        course_code,
        course_code_duplicate,
        course_desc,
        major,
        year,
        course_type,
      } = ctx.request.body;

      let myPayload = {
        data: {},
        message: `Course ${course_code} Successfully Updated!`,
        status: "success",
      };

      let existingPayload = {
        message: `Course "${course_code}" already exist!`,
        status: "fail",
      };

      if (course_code_duplicate != course_code) {
        const checkDuplicate = await strapi.db
          .query("api::course.course")
          .findMany({
            where: {
              code: course_code,
            },
          });

        if (checkDuplicate.length != 0) {
          console.log("[updateCourseDetails] Error: ", checkDuplicate);
          return (ctx.body = existingPayload);
          //return ctx.badRequest();
        }
      }

      // METHOD 1
      //   const result = await strapi.db.query("api::course.course").update({
      //     where: { documentId: documentid },
      //     data: {
      //       code: course_code,
      //       description: course_desc,
      //       major: major,
      //       year: year,
      //       course_type: course_type,
      //     },
      //   });

      //   if (result) {
      //     myPayload.data = result;
      //     ctx.status = 200;
      //     return (ctx.body = myPayload);
      //   }

      // METHOD 2
      // Update course details from course table
      await strapi.db.query("api::course.course").update({
        where: { documentId: documentid },
        data: {
          code: course_code,
          description: course_desc,
          major: major,
          course_type: course_type,
        },
      });

      // Update course details from curriculum table
      await strapi.db.query("api::curriculum.curriculum").updateMany({
        where: { course_id: documentid },
        data: {
          course_code: course_code,
          course_description: course_desc,
          major: major,
          course_type: course_type,
        },
      });

      // Update course code from subject table
      await strapi.db.query("api::subject.subject").updateMany({
        where: { course_id: documentid },
        data: {
          course_code: course_code,
        },
      });

      return ctx.send(myPayload);
    } catch (err) {
      console.log("[updateCourseDetails] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Delete Course
  async deleteCourse(ctx) {
    try {
      console.log("[deleteCourse] Incoming Request");
      const { documentid } = ctx.params;
      let myPayload = {
        message: "Redcords deleted successfully",
        status: "success",
      };
      // METHOD 1
      //   const result = await strapi.db.query("api::course.course").delete({
      //     where: { documentId: documentid },
      //   });

      //   if (result) {
      //     myPayload.data = result;
      //     ctx.status = 200;
      //     return (ctx.body = myPayload);
      //   }

      // METHOD 2
      // Delete from course table
      await strapi.db.query("api::course.course").delete({
        where: { documentId: documentid },
      });

      // Delete from curriculum table
      await strapi.db.query("api::curriculum.curriculum").deleteMany({
        where: { course_id: documentid },
      });

      // Delete from subject table
      await strapi.db.query("api::subject.subject").deleteMany({
        where: { course_id: documentid },
      });

      return ctx.send(myPayload);
    } catch (err) {
      console.log("[deleteCourse] Error: ", err.message);
      //   return ctx.badRequest(err.message, err);
      return ctx.throw(500, err.message);
    }
  },
}));
