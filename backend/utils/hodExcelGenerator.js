const ExcelJS = require("exceljs");

const {
    generateFacultySheet
} = require("./excelGenerator");

exports.generateHodExcel = async (

    school,

    department

) => {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "SRIHER IQAC Portal";

    workbook.created = new Date();

    await generateFacultySheet(

        workbook,

        school,

        department

    );

    return workbook;

};