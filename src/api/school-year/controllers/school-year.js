"use strict";

/**
 * school-year controller
 */
// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::school-year.school-year",
  ({ strapi }) => ({
    // Get current or active school year
    async getActiveSchoolYear(ctx) {
      try {
        console.log("[getActiveSchoolYear] Incoming Request");
        const { courseid } = ctx.params;
        // const result = await strapi.entityService.findMany("api::school-year.school-year", {
        //     filters: {
        //         active_sy: true
        //     },
        //     orderBy: { createdAt: "DESC" }
        // })

        const result = await strapi.db
          .query("api::school-year.school-year")
          .findMany({
            where: { active_sy: true },
            orderBy: { createdAt: "DESC" },
          });

        if (result) {
          ctx.status = 200;
          return (ctx.body = result);
        }
      } catch (err) {
        console.log("[getActiveSchoolYear] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    // Get all school year
    async getAllSchoolYear(ctx) {
      try {
        console.log("[getAllSchoolYear] Incoming Request");
        const result = await strapi.db.query("api::school-year.school-year")
        .findMany({
          orderBy: { createdAt: "DESC"}
        });

        if (result) {
          ctx.status = 200;
          return ctx.body = result;
        }
      } catch (err) {
        console.log("[getActiveSchoolYear] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    // Get all inactive school year
    async getInactiveSchoolYear(ctx) {
      try {
        console.log("[getInactiveSchoolYear] Incoming Request");
        const result = await strapi.db.query("api::school-year.school-year")
        .findMany({
          where: { active_sy: false },
          orderBy: { school_year: "DESC"}
        });

        if (result) {
          ctx.status = 200;
          return ctx.body = result;
        }
      } catch (err) {
        console.log("[getInactiveSchoolYear] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },
  })
);
