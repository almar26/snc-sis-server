'use strict';

/**
 * class controller
 */
//@ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::class.class', ({ strapi }) => ({
    async testApi(ctx) {
        ctx.body = "Hello Class Table";
        ctx.status = 200;
    },

    // Get List of Classes
    async getClassList(ctx) {
        try {
            console.log("[getClassList] Incoming Request");
            const result = await strapi.db.query("api::class.class").findMany({ orderBy: { id: 'ASC'}});
            // const result = await strapi.entityService.findMany("api::class.class", { sort: { id: "ASC" }}).catch(err => {
            //     console.log(err);
            // })

            if(result) {
                ctx.status = 200;
                return ctx.body = result;
            }
        } catch (err) {
            ctx.body = err.message;
            ctx.status = 404;
        }
    }


}));
