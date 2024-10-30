const fs = require("fs");
const csv = require("csv-parser");

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController(
  "api::excel-import.excel-import",
  ({ strapi }) => ({
    async testApi(ctx) {
      ctx.body = "Hello World";
      ctx.status = 200;
    },

    async importCSV(ctx) {
      try {
        const { filePath } = ctx.request.body;
        const results = [];

        // Read the CSV file
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", async () => {
            // Loop through results and save them to the database
            for (const item of results) {
              // Adjust according to your model's structure
              await strapi.services["api::excel-import.excel-import"].create({
                data: {
                  first_name: item.first_name,
                  last_name: item.last_name,
                  dob: item.dob,
                  email: item.email,
                },
              });
            }
            ctx.send({ message: 'CSV imported successfully', data: results });
          });
      } catch (err) {
        ctx.send({ error: "Error importing CSV", details: err.message });
      }
    },


    async secondImportCSV(ctx) {
        try {
            let { filePath } = ctx.request.body;
            let myPayload = {
                data: {},
                message: "Successfully imported the CSV file",
                status: "success"
            };

            let myQuery = `COPY excel_imports(first_name, last_name, dob, email)
                                FROM '${filePath}'
                                DELIMITER ','
                                CSV HEADER`;
                
                                //@ts-ignore
                let myResult = await strapi.db.connection.context.raw(myQuery);

                if (myResult) {
                    myPayload.data = myResult.rows;
                    ctx.body = myPayload;
                    ctx.status = 200;
                }

        } catch (err) {
            ctx.status = 404;
            ctx.body = err.message;
        }
    }
  })
);
