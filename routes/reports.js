const express = require('express');
const Report = require('../schemas/reportschema');
const url = require("url");
const router = express.Router();


/**
 * /get - GET REQ to the Query string (postman/curl)
 * MongoDB - get report of user costs by month and year.
 */
router.get('/get', async function(req, res) {

    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject.id);
    console.log(queryObject.month);
    console.log(queryObject.year);

    const idOfUser = queryObject.id;
    const monthOfReport = queryObject.month;
    const yearOfReport = queryObject.year;

    const currentYear = new Date().getFullYear();

    //data validation
    const validMonth = (monthOfReport >= 1 && monthOfReport <= 12);
    const validYear = (yearOfReport >= 1900 && yearOfReport <= currentYear);

    if(!(validMonth && validYear)){ // invalid input
        res.status(400).send('Invalid date');
    }
    else{
        const reportByMonth = await Report.find({id:idOfUser, month:monthOfReport, year:yearOfReport})
            .catch(error => res.status(400)
                .send('ERROR - cant get the report . \n' + error));

        // report exists
        if(reportByMonth.length === 1){
            const listOfCosts = reportByMonth[0].listOfCosts;
            console.log(`${listOfCosts} \n\n `
                +`The total sum at ${monthOfReport}.${yearOfReport} is ${reportByMonth[0].totalSum}`
                + ` for user ${idOfUser}.`);
            res.status(200).send(reportByMonth);
        }
        // no report in the collection for this month
        else{
            res.status(404)
                .send(`No report for ${monthOfReport}.${yearOfReport} was found for user with the id: ${idOfUser}.`);
        }
    }
});

/**
 * /getnew - GET REQ to the HTML site
 * MongoDB - get report of user costs by month and year.
 */
router.get('/getnew', async function(req, res) {

    const idOfUser = req.query.id;
    const monthOfReport = req.query.month;
    const yearOfReport = req.query.year;
    const currentYear = new Date().getFullYear();

    console.log("id: " + idOfUser);
    console.log("month: " + monthOfReport);
    console.log("year: " + yearOfReport);

    //data validation
    const validMonth = (monthOfReport >= 1 && monthOfReport <= 12);
    const validYear = (yearOfReport >= 1900 && yearOfReport <= currentYear);

    if(!(validMonth && validYear)){ // invalid input
        res.status(400).send('Invalid date');
    }
    else{
        const reportByMonth = await Report.find({id:idOfUser, month:monthOfReport, year:yearOfReport})
            .catch(error => res.status(400)
                .send('ERROR - cant get the report . \n' + error));

        // report exists
        if(reportByMonth.length === 1){
            const listOfCosts = reportByMonth[0].listOfCosts;
            console.log(`${listOfCosts} \n\n `
                +`The total sum at ${monthOfReport}.${yearOfReport} is ${reportByMonth[0].totalSum}`
                + ` for user ${idOfUser}.`);
            res.status(200).send(reportByMonth);
        }
        // no report in the collection for this month
        else{
            res.status(404)
                .send(`No report for ${monthOfReport}.${yearOfReport} was found for user with the id: ${idOfUser}.`);
        }
    }
});

module.exports = router;