'use strict';

// const { sort } = require('../../../../config/middlewares');

/**
 * student controller
 */

const fs = require('fs');
const csv = require('csv-parser');
// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::student.student', ({ strapi }) => ({

    async testApi(ctx) {
        ctx.body = "Hello Student Table";
        ctx.status = 200;
    },

    async importCSV(ctx) {
        const { filePath } = ctx.request.body;
        const results = [];
        
        try {
            // Read the CSV file
            fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                //  Loop through results and save them to the database
                for(const item of results) {
                    await strapi.services['api::student.student'].create({
                        data: {
                            student_no: item.student_no,
                            last_name: item.last_name,
                            first_name: item.first_name,
                            middle_name: item.middle_name,
                            course: item.course,
                            major: item.major,
                            semester: "1st Semester",
                            school_year_start: 2024,
                            school_year_end: 2025

                        }
                    });
                }
                ctx.send({ message: 'CSV imported successfully', data: results});
            })
        } catch (err) {
            console.log("[importCSV] Error: ", err.message);
            return ctx.badRequest(err.message, err);
        }
    },

    async getStudentList(ctx) {
        try {
            console.log("[getStudentLst] Incoming Request");
            // const result = await strapi.entityService.findMany("api::student.student", { sort: { id: 'ASC' }});
            const result = await strapi.db.query("api::student.student").findMany({ orderBy: { id: 'ASC'}});
            if (result) {
                ctx.status = 200;
                return ctx.body = result;
            }
        } catch (err) {
            ctx.body = err.message;
            ctx.status = 404;
        }
    },

    async createStudent(ctx) {
        try {
            let {
                student_no,
                last_name,
                first_name,
                middle_name,
                course,
                major,
                gender,
                birthday,
                age,
                semester,
                school_year_start,
                school_year_end,
                address
            } = ctx.request.body;

            let myPayload = {
                data: {},
                message: "Successfully Created!",
                status: "success"
            };

            const result = await strapi.db.query("api::student.student").create({
                data: {
                    student_no: student_no,
                    last_name: last_name,
                    first_name: first_name,
                    middle_name: middle_name,
                    course: course,
                    major: major,
                    gender: gender,
                    birthday: birthday,
                    age: age,
                    semester: semester,
                    school_year_start: school_year_start,
                    school_year_end: school_year_end,
                    address: address
                }
            })

            if (result) {
                myPayload.data = result;
                ctx.status = 200;
                return ctx.body = myPayload;
            }

        } catch (err) {
            console.log("[createStudent] Error: ", err.message);
            return ctx.badRequest(err.message, err);
        }
    },

    async getStudentDetails(ctx) {
        try {
            console.log("[getStudentDetails] Incoming Reques");
            const { documentid } = ctx.params;

            let myPayload = {
                data: [],
                message: "Successfully fetch data!",
                status: "success"
            };

            const result = await strapi.entityService.findMany("api::student.student", {
                filters: {
                    documentId: { $eq: documentid }
                },
            }).catch(err => {
                console.log(err);
            })

            if (result.length < 0) {
                ctx.status = 200;
                return ctx.body = {
                    data: [],
                    message: "No Record Found!",
                    status: "failed"
                };
            }

            if (result) {
                console.log(result);
                ctx.status = 200;
                return ctx.body = result;
            }
        } catch (err) {
            console.log("[getStudentDetails] Error: ", err.message);
            return ctx.badRequest(err.message, err);
        }
    },





}));
