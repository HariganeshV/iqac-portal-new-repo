const ExcelJS = require("exceljs");

const {
    generateFacultySheet,
    generateHodSheet
} = require("./excelGenerator");

exports.generateDeanExcel = async (

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

    await generateHodSheet(

        workbook,

        school,

        department

    );

    return workbook;

};