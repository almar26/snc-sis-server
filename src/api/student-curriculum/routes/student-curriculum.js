"use strict";

/**
 * student-curriculum router
 */
// @ts-ignore
const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter(
  "api::student-curriculum.student-curriculum"
);

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};
const myExtraRoutes = [
  {
    method: "POST",
    path: "/student-curriculum/assign-curriculum",
    handler: "student-curriculum.assignStudentCurriculum",
  },
  {
    method: "GET",
    path: "/student-curriculum/assigned-curriculum/:studentid",
    handler: "student-curriculum.getAssignedCurriculum"
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
