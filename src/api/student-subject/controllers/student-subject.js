"use strict";

const student = require("../../student/controllers/student");
const teacherAccount = require("../../teacher-account/controllers/teacher-account");

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
          teacher_id,
        } = ctx.request.body;

        let myPayload = {
          data: {},
          message: "Successfully Created!",
          status: "success",
        };

        let existingPayload = {
          message: `Student ${student_no} already added to the subject ${subject_code}.`,
          status: "fail",
        };

        const checkDuplicate = await strapi.db
          .query("api::student-subject.student-subject")
          .findMany({
            where: {
              //teacher_id: teacher_id,
              student_id: student_id,
              //student_no: student_no,
              course_code: course_code,
              // section: section,
              subject_code: subject_code,
              semester: semester,
              school_year: school_year,
            },
          });

        if (checkDuplicate.length != 0) {
          console.log("[createStudentSubject] Error: ", checkDuplicate);
          return (ctx.body = existingPayload);
        }

        const result = await strapi.db
          .query("api::student-subject.student-subject")
          .create({
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
              teacher_id: teacher_id,
            },
          });

        if (result) {
          myPayload.data = result;
          ctx.status = 200;
          return (ctx.body = myPayload);
        }
      } catch (err) {
        console.log("[createStudentSubject] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    async getStudentSubjectList(ctx) {
      try {
        console.log("[getStudentSubjectList] Incoming Request");
        const { classid } = ctx.params;

        // const result = await strapi.entityService.findMany("api::student-subject.student-subject", {
        //   filters: {
        //     class_id : { $eq: classid },
        //   },
        //   populate: {
        //     student: {
        //       on: {
        //         'components.student': {
        //           fields: ['documentId']
        //         }
        //       }
        //     }
        //   }
        // })
        // .catch(err => {
        //   console.log(err);
        // })

        let myQuery = `SELECT student_subjects.document_id, student_subjects.class_id, student_subjects.subject_code, student_subjects.student_id, student_subjects.student_no, students.last_name, 
                      students.first_name, students.middle_name, students.course, students.course_code, student_subjects.section,
                      student_subjects.unit, student_subjects.grade, student_subjects.numeric_grade, student_subjects.remarks, student_subjects.incomplete, student_subjects.fda, student_subjects.dropped, student_subjects.udropped, student_subjects.semester,
                      student_subjects.school_year, student_subjects.teacher_id
                      FROM students
                      LEFT JOIN student_subjects on students.document_id = student_subjects.student_id
                      WHERE student_subjects.class_id = '${classid}'
                      ORDER BY students.last_name ASC`;
        let result = await strapi.db.connection.context.raw(myQuery);

        if (result) {
          ctx.status = 200;
          ctx.body = result.rows;
          //return ctx.body = result.rows;
        }
      } catch (err) {
        console.log("[getStudentSubjectList] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    // Add Subject Grade
    async addSubjectGrade(ctx) {
      try {
        console.log("[addSubjectGrade] Incoming Request");
        const { documentid } = ctx.params;
        let { grade, numeric_grade, remarks, incomplete, fda, dropped } =
          ctx.request.body;

        let myPayload = {
          data: {},
          message: "Successfully added a grade",
          status: "success",
        };

        const result = await strapi.db
          .query("api::student-subject.student-subject")
          .update({
            where: { documentId: documentid },
            data: {
              grade: grade,
              numeric_grade: numeric_grade,
              remarks: remarks,
              incomplete: incomplete,
              fda: fda,
              dropped: dropped,
            },
          });

        if (result) {
          myPayload.data = result;
          ctx.status = 200;
          return (ctx.body = myPayload);
        }
      } catch (err) {
        console.log("[addSubjectGrade] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    async deleteSubjectGrade(ctx) {
      try {
        console.log("[deleteSubjectGrade] Incoming Request");
        const { documentid } = ctx.params;
        let myPayload = {
          data: {},
          message: "Succesfully Deleted!",
          status: "success",
        };

        const result = await strapi.db
          .query("api::student-subject.student-subject")
          .delete({
            where: { documentId: documentid },
          });

        if (result) {
          myPayload.data = result;
          ctx.status = 200;
          return (ctx.body = myPayload);
        }
      } catch (err) {
        console.log("[deleteSubjectGrade] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    },

    async getStudentGrades(ctx) {
      try {
        console.log("[getClassList] Incoming Request");
        //const { studentid } = ctx.params;
        const queryObj = ctx.request.query;
        console.log("Query Param 2: ", queryObj);
        // const result = await strapi.entityService.findMany("api::student-subject.student-subject", {
        //   filters: {
        //     student_id: { $eq: studentid }
        //   }
        // }).catch(err => {
        //   console.log(err);
        // })
        // if (result) {
        //   ctx.status = 200;
        //   return ctx.body = result;
        // }

        const myQuery = `SELECT DISTINCT ON (student_subjects.subject_code) student_subjects.id, student_subjects.document_id, student_subjects.student_id, student_subjects.student_no, student_subjects.course_code, student_subjects.course_description,
                        student_subjects.section, student_subjects.subject_code, subjects.title, student_subjects.unit, student_subjects.grade, student_subjects.numeric_grade, student_subjects.remarks,
                        student_subjects.school_year, student_subjects.semester, student_subjects.finalize_grade, student_subjects.class_id, student_subjects.teacher_id,
                        json_object(ARRAY['teacher_id', 'faculty_no', 'last_name', 'first_name', 'middle_name', 'department'], ARRAY[teacher_accounts.teacher_id, teacher_accounts.faculty_no, 
                        teacher_accounts.last_name, teacher_accounts.first_name, teacher_accounts.middle_name, teacher_accounts.department]) AS teacher_details, student_subjects.created_at
                        FROM student_subjects
                        LEFT JOIN subjects on student_subjects.subject_code = subjects.code
                        LEFT JOIN teacher_accounts on student_subjects.teacher_id = teacher_accounts.teacher_id
                        WHERE student_subjects.student_id = '${queryObj.studentid}' AND student_subjects.semester = '${queryObj.semester}' AND student_subjects.school_year = '${queryObj.sy}'
                        ORDER BY student_subjects.subject_code ASC`;
        let result = await strapi.db.connection.context.raw(myQuery);

        if (result) {
          ctx.status = 200;
          ctx.body = result.rows;
        }
      } catch (err) {
        ctx.body = err.message;
        ctx.status = 404;
      }
    },

    // Get all subjects of the student
    async getAllStudentSubjects(ctx) {
      try {
        console.log("[getAllStudentSubjects] Incoming Request");
        const { studentid } = ctx.params;
        // const result = await strapi.entityService
        //   .findMany("api::student-subject.student-subject", {
        //     filters: {
        //       student_id: { $eq: studentid },
        //     },
        //     sort: { school_year: "ASC" },
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        // if (result) {
        //   ctx.status = 200;
        //   return (ctx.body = result);
        // }
        const myQuery = `SELECT DISTINCT ON (student_subjects.subject_code) student_subjects.id, student_subjects.document_id, student_subjects.student_id, student_subjects.student_no, student_subjects.subject_code, 
                        subjects.title, student_subjects.unit, student_subjects.grade, student_subjects.numeric_grade, student_subjects.remarks, student_subjects.school_year,
                        student_subjects.semester, student_subjects.finalize_grade, student_subjects.teacher_id,
                        json_object(ARRAY['teacher_id', 'faculty_no', 'last_name', 'first_name', 'middle_name', 'department'], ARRAY[teacher_accounts.teacher_id, teacher_accounts.faculty_no, 
                        teacher_accounts.last_name, teacher_accounts.first_name, teacher_accounts.middle_name, teacher_accounts.department]) AS teacher_details, student_subjects.created_at
                        FROM student_subjects
                        LEFT JOIN subjects on student_subjects.subject_code = subjects.code
                        LEFT JOIN teacher_accounts on student_subjects.teacher_id = teacher_accounts.teacher_id
                        WHERE student_subjects.student_id = '${studentid}'
                        ORDER BY student_subjects.subject_code ASC, student_subjects.school_year ASC`;
        
        const result = await strapi.db.connection.context.raw(myQuery);

        if (result) {
          ctx.status = 200;
          ctx.body = result.rows;
        }
      } catch (err) {
        console.log("[getAllStudentSubjects] Error: ", err.message);
        // return ctx.badRequest(err.message, err);
        ctx.body = err.message;
        ctx.status = 404;
      }
    },

    async importMultipleStudentSubject(ctx) {
      try {
      console.log("[importMultipleStudentSubject] Incoming Request");
      let { student_list } = ctx.request.body;

      let myPayload = {
        data: {},
        message: "Successfully Created!",
        status: "success"
      };

      const result = await strapi.db.query("api::student-subject.student-subject").createMany({
        data: student_list
      });

      if (result) {
        myPayload.data = result;
        ctx.status = 200;
        return ctx.body = myPayload;
      }

      } catch (err) {
        console.log("[importMultipleStudentSubject] Error: ", err.message);
        return ctx.badRequest(err.message, err);
      }
    }
  })
);
