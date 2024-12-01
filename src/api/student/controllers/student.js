"use strict";

// const { sort } = require('../../../../config/middlewares');

/**
 * student controller
 */

const fs = require("fs");
const csv = require("csv-parser");
// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::student.student", ({ strapi }) => ({
  async testApi(ctx) {
    ctx.body = "Hello Student Table";
    ctx.status = 200;
  },

  // Import CHED student using CSV
  async importCHEDCSV(ctx) {
    const { filePath } = ctx.request.body;
    const results = [];

    try {
      // Read the CSV file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          //  Loop through results and save them to the database
          for (const item of results) {
            await strapi.services["api::student.student"].create({
              data: {
                student_no: item.student_no,
                last_name: item.last_name,
                first_name: item.first_name,
                middle_name: item.middle_name,
                gender: item.gender,
                course_code: item.course_code,
                course: item.course,
                major: item.major,
                section: item.section,
                semester: "1st Semester",
                school_year_start: 2024,
                school_year_end: 2025,
                course_type: "ched",
              },
            });
          }
          ctx.send({ message: "CSV imported successfully", data: results });
        });
    } catch (err) {
      console.log("[importCSV] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Import Diploma students using CSV
  async importDiplomaCSV(ctx) {
    const { filePath } = ctx.request.body;
    const results = [];

    try {
      // Read the CSV file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          //  Loop through results and save them to the database
          for (const item of results) {
            await strapi.services["api::student.student"].create({
              data: {
                student_no: item.student_no,
                last_name: item.last_name,
                first_name: item.first_name,
                middle_name: item.middle_name,
                gender: item.gender,
                course_code: item.course_code,
                course: item.course,
                major: item.major,
                section: item.section,
                semester: "1st Semester",
                school_year_start: 2024,
                school_year_end: 2025,
                course_type: "diploma",
              },
            });
          }
          ctx.send({ message: "CSV imported successfully", data: results });
        });
    } catch (err) {
      console.log("[importCSV] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Fetch all students
  async getStudentList(ctx) {
    try {
      console.log("[getStudentList] Incoming Request");
      const { coursetype } = ctx.params;
      console.log("[getStudentLst] Incoming Request");
      const result = await strapi.entityService
        .findMany("api::student.student", {
          filters: {
            course_type: { $eq: coursetype },
          },
          sort: { id: "ASC" },
        })
        .catch((err) => {
          console.log(err);
        });
      // const result = await strapi.db.query("api::student.student").findMany({ orderBy: { id: 'ASC'}});
      if (result) {
        ctx.status = 200;
        return (ctx.body = result);
      }
    } catch (err) {
      console.log("[getStudentList] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Create Student
  async createStudent(ctx) {
    try {
      console.log("[createStudent] Incoming Request");
      let {
        student_no,
        last_name,
        first_name,
        middle_name,
        course,
        course_code,
        major,
        gender,
        birthday,
        age,
        semester,
        school_year_start,
        school_year_end,
        address,
        course_type,
      } = ctx.request.body;

      let myPayload = {
        data: {},
        message: "Successfully Created!",
        status: "success",
      };

      let existingPayload = {
        message: `Student no "${student_no}" already exist!`,
        status: "fail",
      };

      const checkDuplicate = await strapi.db
        .query("api::student.student")
        .findMany({
          where: {
            student_no: student_no,
          },
        });

      if (checkDuplicate.length != 0) {
        console.log("[createStudent] Error: ", checkDuplicate);
        return (ctx.body = existingPayload);
        //return ctx.badRequest();
      }

      const result = await strapi.db.query("api::student.student").create({
        data: {
          student_no: student_no,
          last_name: last_name,
          first_name: first_name,
          middle_name: middle_name,
          course: course,
          course_code: course_code,
          major: major,
          gender: gender,
          birthday: birthday,
          age: age,
          semester: semester,
          school_year_start: school_year_start,
          school_year_end: school_year_end,
          address: address,
          course_type: course_type,
        },
      });

      if (result) {
        myPayload.data = result;
        ctx.status = 200;
        return (ctx.body = myPayload);
      }
    } catch (err) {
      console.log("[createStudent] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Update Student Details
  async updateStudentDetails(ctx) {
    try {
      console.log("[updateStudentDetails] Incoming Request");
      const { documentid } = ctx.params;
      let {
        student_no,
        last_name,
        first_name,
        middle_name,
        course,
        course_code,
        major,
        gender,
        birthday,
        age,
        semester,
        school_year_start,
        school_year_end,
        address,
      } = ctx.request.body;

      let myPayload = {
        data: {},
        message: "Succefully Updated!",
        status: "success",
      };

      const result = await strapi.db.query("api::student.student").update({
        where: { documentId: documentid },
        data: {
          student_no: student_no,
          last_name: last_name,
          first_name: first_name,
          middle_name: middle_name,
          course: course,
          course_code: course_code,
          major: major,
          gender: gender,
          birthday: birthday,
          age: age,
          semester: semester,
          school_year_start: school_year_start,
          school_year_end: school_year_end,
          address: address,
          //course_type: course_type
        },
      });

      if (result) {
        myPayload.data = result;
        ctx.status = 200;
        return (ctx.body = myPayload);
      }
    } catch (err) {
      console.log("[updateStudentDetails] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Get student details
  async getStudentDetails(ctx) {
    try {
      console.log("[getStudentDetails] Incoming Request");
      const { documentid } = ctx.params;

      let myPayload = {
        data: [],
        message: "Successfully fetch data!",
        status: "success",
      };

      const result = await strapi.entityService
        .findMany("api::student.student", {
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
      console.log("[getStudentDetails] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },

  // Delete Student
  async deleteStudent(ctx) {
    try {
      console.log("[deleteStudent] Incoming Request");
      const { documentid } = ctx.params;
      let myPayload = {
        data: {},
        message: "Succesfully Deleted!",
        status: "success",
      };

      const result = await strapi.db.query("api::student.student").delete({
        where: { documentId: documentid },
      });

      if (result) {
        myPayload.data = result;
        ctx.status = 200;
        return (ctx.body = myPayload);
      }
    } catch (err) {
      console.log("[deleteStudent] Error: ", err.message);
      return ctx.badRequest(err.message, err);
    }
  },
}));
