"use strict";

/**
 * teacher-account controller
 */
const short = require("short-uuid");
// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::teacher-account.teacher-account",
  ({ strapi }) => ({
    async testApi(ctx) {
      ctx.body = "Hello Teacher Account";
      ctx.status = 200;
    },

    // Create Teacher Account
    async createTeacherAccount(ctx) {
      try {
        console.log("[createTeacherAccount] Incoming Request");
        let {
          faculty_no,
          last_name,
          first_name,
          middle_name,
          email,
          department,
          birthday,
          gender,
          teacher_status,
          role_view
        } = ctx.request.body;

        let myPayload = {
          data: {},
          message: "Successfully Created!",
          status: "success",
        };

        let existingPayload = {
          message: `Faculty no  "${faculty_no}" already exist`,
          status: "fail",
        };

        const checkDuplicate = await strapi.db
          .query("api::teacher-account.teacher-account")
          .findMany({
            where: {
              faculty_no: faculty_no,
            },
          });

        if (checkDuplicate.length != 0) {
          console.log("[createTeacherAccount]: ", checkDuplicate);
          return (ctx.body = existingPayload);
        }

        const result = await strapi.db
          .query("api::teacher-account.teacher-account")
          .create({
            data: {
              teacher_id: short.generate(),
              faculty_no: faculty_no,
              last_name: last_name,
              first_name: first_name,
              middle_name: middle_name,
              email: email,
              department: department,
              birthday: birthday,
              gender: gender,
              teacher_status: teacher_status,
              role_view: role_view
            },
          });

        if (result) {
          myPayload.data = result;
          ctx.status = 200;
          return (ctx.body = myPayload);
        }
      } catch (err) {
        console.log("[createTeacherAccount] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },
  })
);
