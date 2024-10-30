"use strict";

module.exports = {
    routes: [
        {
            method: "GET",
            path: "/excel-import/test",
            handler: "custom-controller.testApi"
        },
        {
            method: "POST",
            path: "/excel-import/import-csv",
            handler: "custom-controller.importCSV"
        },
        {
            method: "POST",
            path: "/excel-import/importCSV",
            handler: "custom-controller.secondImportCSV"
        }
    ]
}