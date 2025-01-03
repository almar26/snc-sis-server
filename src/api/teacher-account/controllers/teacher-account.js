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
          role_view,
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
        const teacherid = short.generate();
        // Create teacher account
        await strapi.db.query("api::teacher-account.teacher-account").create({
          data: {
            // teacher_id: short.generate(),
            teacher_id: teacherid,
            faculty_no: faculty_no,
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            email: email,
            department: department,
            birthday: birthday,
            gender: gender,
            teacher_status: teacher_status,
            role_view: role_view,
          },
        });

        // Create Teacher user account
        await strapi.entityService.create("plugin::users-permissions.user", {
          data: {
            teacher_id: teacherid,
            email: email,
            username: faculty_no,
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            department: department,
            gender: gender,
            password: "admin123",
            confirmed: true,
            provider: "local",
            role: 1,
            role_view: role_view,
          },
        });
        // await strapi.db.query("plugin::users-permissions.user").create({
        //   data: {
        //     teacher_id: teacherid,
        //     email: email,
        //     username: faculty_no,
        //     last_name: last_name,
        //     first_name: first_name,
        //     middle_name: middle_name,
        //     department: department,
        //     gender: gender,
        //     password: "admin123",
        //     confirmed: true,
        //     provider: "local",
        //     role: 1,
        //     role_view: role_view,
        //   },
        // });

        return ctx.send(myPayload);

        // const result = await strapi.db
        //   .query("api::teacher-account.teacher-account")
        //   .create({
        //     data: {
        //       teacher_id: short.generate(),
        //       faculty_no: faculty_no,
        //       last_name: last_name,
        //       first_name: first_name,
        //       middle_name: middle_name,
        //       email: email,
        //       department: department,
        //       birthday: birthday,
        //       gender: gender,
        //       teacher_status: teacher_status,
        //       role_view: role_view
        //     },
        //   });

        // if (result) {
        //   myPayload.data = result;
        //   ctx.status = 200;
        //   return (ctx.body = myPayload);
        // }
      } catch (err) {
        console.log("[createTeacherAccount] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    // Get list of teacher's account by department
    async getTeacherAccountsList(ctx) {
      try {
        console.log("[getTeacherAccountsList] Incoming Request");
        const { department } = ctx.params;

        const result = await strapi.entityService
          .findMany("api::teacher-account.teacher-account", {
            filters: {
              department: { $eq: department },
              role_view: { $eq: "teacher" },
              // $and: [
              //   {
              //     department: { $eq: department },
              //   },
              //   {
              //     role_view: { $eq: "teacher"}
              //   }
              // ]
            },
          })
          .catch((err) => {
            console.log(err);
          });

        if (result) {
          ctx.status = 200;
          return (ctx.body = result);
        }
      } catch (err) {
        console.log("[getTeacherAccountsList] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    // Update Teacher's Account
    async updateTeacherAccount(ctx) {
      try {
        console.log("[updateClassDetails] Incoming Request");
        const { teacherid } = ctx.params;
        let {
          faculty_no,
          faculty_no_duplicate,
          last_name,
          first_name,
          middle_name,
          email,
          gender,
        } = ctx.request.body;

        let myPayload = {
          data: {},
          message: `Faculty No. "${faculty_no}" Successfully Updated`,
          status: "success",
        };

        let existingPayload = {
          message: `Faculy No. "${faculty_no}" already exist!`,
          status: "fail",
        };

        //Validate if faculty no is already exist
        if (faculty_no_duplicate != faculty_no) {
          const checkDuplicate = await strapi.db
            .query("api::teacher-account.teacher-account")
            .findMany({
              where: {
                faculty_no: faculty_no,
              },
            });

          if (checkDuplicate.length != 0) {
            console.log("[updateClassDetails] Error: ", checkDuplicate);
            return (ctx.body = existingPayload);
          }
        }

        // Update teacher details
        await strapi.db.query("api::teacher-account.teacher-account").update({
          where: { teacher_id: teacherid },
          data: {
            faculty_no: faculty_no,
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            email: email,
            gender: gender,
          },
        });

        // Update teacher user account
        await strapi.db.query("plugin::users-permissions.user").update({
          where: { teacher_id: teacherid },
          data: {
            username: faculty_no,
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            email: email,
            gender: gender,
          },
        });

        return ctx.send(myPayload);
      } catch (err) {
        console.log("[updateTeacherAccount] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    // Get teacher's account details
    async getTeacherDetails(ctx) {
      try {
        console.log("[getTeacherDetails] Incoming Request");
        const { teacherid } = ctx.params;

        const result = await strapi.entityService.findMany("api::teacher-account.teacher-account", {
          filters: {
            teacher_id: { $eq: teacherid },
          }
        })

        if (result) {
          console.log(result);
          ctx.status = 200;
          return ctx.body = result;
        }
      } catch(err) {
        console.log("[getTeacherDetails] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    // Get all teacher's list
   async getTeachersList(ctx) {
    try {
      console.log("[getTeachersList] Incoming Request");
        const { department } = ctx.params;

        const result = await strapi.entityService
          .findMany("api::teacher-account.teacher-account", {
            filters: {
              //department: { $eq: department },
              //role_view: { $eq: "teacher" },
             $or: [
              {
                role_view: { $eq: "teacher" },
              },
              {
                role_view: { $eq: "dean" },
              }
             ]
            },
          })
          .catch((err) => {
            console.log(err);
          });

        if (result) {
          ctx.status = 200;
          return (ctx.body = result);
        }
    } catch (err) {
      console.log("[getTeachersList] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
   }
  })
);
