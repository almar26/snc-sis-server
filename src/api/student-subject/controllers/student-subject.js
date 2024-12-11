"use strict";

/**
 * student-subject controller
 */
//@ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::student-subject.student-subject",
  ({ strapi }) => ({
    // Create Student Subject
    async createStudentSubject(ctx) {
      try {
        let {
            class_id,
            student_id,
            student_no,
            subject_code,
            course_code,
            course_description,
            section,
            unit,
            semester,
            school_year,
            grade,
            numeric_grade,
            remarks,
            teacher_id
        } = ctx.request.body;

        let myPayload = {
            data: {},
            message: "Successfully Created!",
            status: "success",
        };

        let existingPayload = {
            message: `Student ${student_no} already added to this class.`,
            status: 'fail'
        };

        const checkDuplicate = await strapi.db.query("api::student-subject.student-subject")
        .findMany({
            where: {
                teacher_id: teacher_id,
                student_no: student_no,
                course_code: course_code,
                section: section,
                subject_code: subject_code,
                semester: semester,
                school_year: school_year
            }
        });

        if (checkDuplicate.length != 0) {
            console.log("[createStudentSubject] Error: ", checkDuplicate);
            return ctx.body = existingPayload;
        }
        
        const result = await strapi.db.query("api::student-subject.student-subject").create({
            data: {
                class_id: class_id,
            student_id: student_id,
            student_no: student_no,
            subject_code: subject_code,
            course_code: course_code,
            course_description: course_description,
            section: section,
            unit: unit,
            semester: semester,
            school_year: school_year,
            grade: grade,
            numeric_grade: numeric_grade,
            remarks: remarks,
            teacher_id: teacher_id
            }
        });

        if (result) {
            myPayload.data = result;
            ctx.status = 200;
            return ctx.body = myPayload;
        }
      } catch (err) {
        console.log("[createStudentSubject] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },
  })
);
