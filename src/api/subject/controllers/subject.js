"use strict";

/**
 * subject controller
 */
// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::subject.subject", ({ strapi }) => ({
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

      const result = await strapi.entityService
        .findMany("api::subject.subject", {
          filters: {
            curriculum_id: { $eq: curriculumid },
          },
        })
        .catch((err) => {
          console.log(err);
        });

      if (result) {
        console.log(result);
        ctx.status = 200;
        return (ctx.body = result);
      }
    } catch (err) {
      console.log("[getSubject] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Get all Subjects by Course
  async getSubjectCourse(ctx) {
    try {
      const { coursecode } = ctx.params;
      console.log("[getSubjectCourse] Incoming Request");
      const result = await strapi.db.query("api::subject.subject").findMany({
        where: {
          course_code: {
            $eqi: coursecode,
          },
        },
        orderBy: { id: "ASC" },
      });
      if (result) {
        ctx.status = 200;
        return (ctx.body = result);
      }
    } catch (err) {
      console.log("[getSubjectCourse] Error: ", err.message);
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
        resultant,
        course_code,
        course_id,
      } = ctx.request.body;

      let myPayload = {
        data: {},
        message: "Subject successfully created!",
        status: "success",
      };

      let existingPayload = {
        message: `Subjet code "${subj_code}" already exist!`,
        status: "fail",
      };

      // const checkDuplicate = await strapi.db.query("api::subject.subject").findMany({
      //     where: {
      //         code: subj_code,
      //         curriculum_id: curri_id
      //     }
      // })
      const checkDuplicate = await strapi.db
        .query("api::subject.subject")
        .findMany({
          // where: {
          //     code: subj_code,
          //     curriculum_id: curri_id
          // }
          where: {
            $and: [
              {
                code: {
                  $eqi: subj_code,
                },
              },
              {
                curriculum_id: curri_id,
              },
            ],
          },
        });

      if (checkDuplicate.length != 0) {
        console.log("[createSubjCurri] Error: ", checkDuplicate);
        return (ctx.body = existingPayload);
        //return ctx.badRequest();
      }

      const result = await strapi.db.query("api::subject.subject").create({
        data: {
          curriculum_id: curri_id,
          code: subj_code,
          title: subj_title,
          year_level: year_level,
          semester: semester,
          units: units,
          lec: lec,
          lab: lab,
          resultant: resultant,
          course_code: course_code,
          course_id: course_id,
        },
      });

      if (result) {
        myPayload.data = result;
        ctx.status = 200;
        return (ctx.body = myPayload);
      }
    } catch (err) {
      console.log("[createSubjCurri] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Update Subject
  async updateSubject(ctx) {
    const { documentid } = ctx.params;
    try {
      console.log("[updateSubject] Incoming Request");
      let {
        curri_id,
        subj_code,
        subj_code_duplicate,
        subj_title,
        year_level,
        semester,
        lec,
        lab,
        units,
        resultant,
      } = ctx.request.body;

      let myPayload = {
        data: {},
        message: `Subject Successfully Updated`,
        status: "success",
      };

      let existingPayload = {
        message: `Subject already exits`,
        status: "fail",
      };

      if (subj_code_duplicate != subj_code) {
        const checkDuplicate = await strapi.db
          .query("api::subject.subject")
          .findMany({
            where: {
              $and: [
                {
                  code: {
                    $eqi: subj_code,
                  },
                },
                {
                  curriculum_id: curri_id,
                },
              ],
            },
          });

        if (checkDuplicate.length != 0) {
          console.log("[updateSubject] Error: ", checkDuplicate);
          return (ctx.body = existingPayload);
          //return ctx.badRequest();
        }
      }

      const result = await strapi.db.query("api::subject.subject").update({
        where: { documentId: documentid },
        data: {
          code: subj_code,
          title: subj_title,
          year_level: year_level,
          semester: semester,
          units: units,
          lec: lec,
          lab: lab,
          resultant: resultant,
        },
      });

      if (result) {
        myPayload.data = result;
        ctx.status = 200;
        return (ctx.body = myPayload);
      }
    } catch (err) {
      console.log("[updateSubject] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Delete Subject
  async deleteSubject(ctx) {
    const { documentid } = ctx.params;
    try {
        console.log("[deleteSubject] Incoming Request");
        let myPayload = {
            message: "Records deleted successfully",
            status: "success"
        };

        const result = await strapi.db.query("api::subject.subject").delete({
            where: { documentId: documentid }
        });

        if (result) {
            myPayload.data = result;
            ctx.status = 200;
            return ctx.body = myPayload;
        }
    } catch (err) {
        console.log("[deleteSubject] Error: ", err.message);
        return ctx.badRequest(err.message, err);
    }

  },
}));
