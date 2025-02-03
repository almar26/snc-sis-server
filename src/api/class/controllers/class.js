"use strict";

/**
 * class controller
 */
//@ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::class.class", ({ strapi }) => ({
  async testApi(ctx) {
    ctx.body = "Hello Class Table";
    ctx.status = 200;
  },

  // Get multiple parameters
  async getMultipleParams(ctx) {
    const queryObj = ctx.request.query;
    let payload = {
      data: queryObj,
      message: "Parameter",
    };
    console.log("Query Param: ", queryObj);
    ctx.status = 200;
  },
  // Get List of Classes
  async getClassList(ctx) {
    try {
      console.log("[getClassList] Incoming Request");
      const queryObj = ctx.request.query;
      console.log("Query Param: ", queryObj);
      const result = await strapi.db.query("api::class.class").findMany({
        where: {
          teacher_id: queryObj.teacherid,
          school_year: queryObj.sy,
          semester: queryObj.semester,
        },
        orderBy: { id: "ASC" },
      });
      // const result = await strapi.entityService.findMany("api::class.class", { sort: { id: "ASC" }}).catch(err => {
      //     console.log(err);
      // })

      if (result) {
        ctx.status = 200;
        return (ctx.body = result);
      }
    } catch (err) {
      ctx.body = err.message;
      ctx.status = 404;
    }
  },

  // Get Unfinalize Classes
  async getUnfinalizedClassList(ctx) {
    try {
      console.log("[getUnfinalizedClassList] Incoming Request");
      const queryObj = ctx.request.query;
      const result = await strapi.db.query("api::class.class").findMany({
        where: {
          school_year: queryObj.sy,
          semester: queryObj.semester,
          // $not: {
          //   finalize: true
          // }
          $or: [
            {
              finalize: false,
            },
            {
              finalize: null
            }
          ]
        },
        orderBy: { id: "ASC" },
      })

      if (result) {
        ctx.status = 200;
        return ctx.body = result;
      }
    } catch (err) {
      ctx.body = err.message;
      ctx.status = 404;
    }
  },

  // Get Finalize Classes
  async getFinalizedClassList(ctx) {
    try {
      console.log("[getFinalizedClassList] Incoming Request");
      const queryObj = ctx.request.query;
      const result = await strapi.db.query("api::class.class").findMany({
        where: {
          school_year: queryObj.sy,
          semester: queryObj.semester,
          finalize: true
        },
        orderBy: { id: "ASC" },
      })

      if (result) {
        ctx.status = 200;
        return ctx.body = result;
      }
    } catch (err) {
      ctx.body = err.message;
      ctx.status = 404;
    }
  },

  // Create Class
  async createClass(ctx) {
    try {
      console.log("['createClass'] Incoming Request");
      let {
        teacher_id,
        subject_code,
        subject_desc,
        course_code,
        section,
        units,
        semester,
        school_year,
        days,
        time_start,
        time_end,
        faculty_no,
        teacher_name,
      } = ctx.request.body;

      let myPayload = {
        data: {},
        message: "Successfully Created!",
        status: "success",
      };

      let existingPayload = {
        message: `Class [${subject_code}] ${course_code}-${section} already exist!`,
        status: "fail",
      };

      const checkDuplicate = await strapi.db
        .query("api::class.class")
        .findMany({
          where: {
            teacher_id: teacher_id,
            course_code: course_code,
            section: section,
            subject_code: subject_code,
            semester: semester,
            school_year: school_year,
            finalize: false
          },
        });

      if (checkDuplicate.length != 0) {
        console.log("[createClass] Error: ", checkDuplicate);
        return (ctx.body = existingPayload);
      }

      const result = await strapi.db.query("api::class.class").create({
        data: {
          teacher_id: teacher_id,
          subject_code: subject_code,
          subject_description: subject_desc,
          course_code: course_code,
          section: section,
          units: units,
          semester: semester,
          school_year: school_year,
          days: days,
          time_start: time_start,
          time_end: time_end,
          faculty_no: faculty_no,
          teacher_name: teacher_name,
        },
      });

      if (result) {
        myPayload.data = result;
        ctx.status = 200;
        return (ctx.body = myPayload);
      }
    } catch (err) {
      console.log("[createClass] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Get Class Details
  async getClassDetails(ctx) {
    try {
      console.log("[getClassDetails] Incoming Request");
      const { documentid } = ctx.params;

      let myPayload = {
        data: [],
        message: "Successfully fetch data!",
        status: "success",
      };

      const result = await strapi.entityService
        .findMany("api::class.class", {
          filters: {
            documentId: { $eq: documentid },
          },
        })
       
        if (result) {
          ctx.status = 200;
          //myPayload.data = result;
          return ctx.body = result;
        }
    } catch (err) {
      console.log("[getClassDetails] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  async updateClassDetails(ctx) {
    try {
      console.log("[updateClassDetails] Incoming Request");
      const { documentid } = ctx.params;
      let {
        subject_code,
        subject_desc,
        course_code,
        section,
        units,
        semester,
        school_year,
        days,
        time_start,
        time_end
      } = ctx.request.body;

      let myPayload = {
        data: {},
        message: "Successfully Updated",
        status: "success"
      };
      
      // const result = await strapi.db.query('api::class.class').update({
      //   where: { documentId: documentid },
      //   data: {
      //     subject_code: subject_code,
      //     subject_description: subject_desc,
      //     course_code: course_code,
      //     section: section,
      //     units: units,
      //     semester: semester,
      //     school_year: school_year,
      //     days: days,
      //     time_start: time_start,
      //     time_end: time_end
      //   }
      // });

      // Update class details
       await strapi.db.query('api::class.class').update({
        where: { documentId: documentid },
        data: {
          subject_code: subject_code,
          subject_description: subject_desc,
          course_code: course_code,
          section: section,
          units: units,
          semester: semester,
          school_year: school_year,
          days: days,
          time_start: time_start,
          time_end: time_end
        }
      });

      // Update Student Subject
      await strapi.db.query('api::student-subject.student-subject').updateMany({
        where: { class_id: documentid },
        data: {
          subject_code: subject_code,
          //subject_description: subject_desc,
          //course_code: course_code,
          section: section,
          unit: units,
          semester: semester,
          school_year: school_year,
          //days: days,
          //time_start: time_start,
          //time_end: time_end
        }
      });

      // if (result) {
      //   myPayload.data = result;
      //   ctx.status = 200;
      //   return ctx.body = myPayload;
      // }
      return ctx.send(myPayload);
    } catch (err) {
      console.log("[updateClassDetails] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },
  
  async finalizeClass(ctx) {
    try {
      console.log("[finalizeClass] Incoming Request");
      const { documentid } = ctx.params;
      
      let myPayload = {
        data: {},
        message: "Successfully Finalized the Class",
        status: "success"
      };

      // Update finalize value to true
      await strapi.db.query("api::class.class").update({
        where: { documentId: documentid},
        data: { finalize: true },
      });
      return ctx.send(myPayload);
    } catch (err) {
      console.log("[finalizeClass] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  }
}));
