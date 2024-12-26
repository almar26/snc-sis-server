module.exports = {
    afterCreate: async ({ params }) => {
        // console.log("Teacher Account After Create", params);
        // console.log("Teacher Account  Document ID: ", params.data.teacher_id);
        // const entry = (
        //     await strapi.entityService.create("plugin::users-permissions.user", {
        //         data: {
        //             teacher_id: params.data.teacher_id,
        //             email: params.data.email,
        //             username: params.data.faculty_no,
        //             last_name: params.data.last_name,
        //             first_name: params.data.first_name,
        //             middle_name: params.data.middle_name,
        //             department: params.data.department,
        //             gender: params.data.gender,
        //             password: "admin123",
        //             confirmed: true,
        //             provider: "local",
        //             role: 1,
        //             role_view: params.data.role_view
        //         }
        //     })
        // )
    }
}