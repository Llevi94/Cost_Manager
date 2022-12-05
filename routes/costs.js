/**
 * team manager: Bar Edri
 *
 *
 * Team members:
 * Bar Edri, 204536817, 052-6939111, snnoo14@gmail.com
 * Yaniv Birenboyim, 311276059, 052-8669520, yanivb1994@gmail.com
 * Liron Levi, 312409592, 052-7739558, lironlevi94@gmail.com
 *
 *
 */

const express = require('express');
const Cost = require('../schemas/costschema');
const Report = require('../schemas/reportschema');
const User = require('../schemas/userschema');
const {flatten} = require("express/lib/utils");
const url = require("url");
const router = express.Router();

/**
 * /getall - GET REQ, show all users in the MongoDB, if there are no users yet - show ERROR
 */
router.get('/getall', async function(req, res) {
    const costs = await Cost.find({});

    if(costs.length === 0){
        res.status(404).send('There aren\'t any saved costs');
    }else{
        res.status(200).send(costs);
    }
});

/**
 * /add - POST REQ to the Query string (postman/curl)
 * MongoDB - Add a new cost into the 'costs' collection
 */
router.post('/add', async function(req, res) {

    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject.id);
    console.log(queryObject.sum);
    console.log(queryObject.date);

    const idOfUser = queryObject.id;
    const sumOfCost = queryObject.sum;
    const dateOfCost = new Date(queryObject.date);

    //data validation
    let validSum = true;
    let validUser = true;
    let validDate = true;

    const numberPattern = /^[0-9]+$/;
    const datePattern = /^\d\d\.\d\d\.\d\d\d\d$/;

    validSum = numberPattern.test(sumOfCost); // check if sum is numbers only
    validDate = datePattern.test(queryObject.date);// check if date is valid

    let message = '';   // ERROR message

    if(!validSum)
    {
        message = 'Invalid sum.';
    }

    // check if the user already exist in the users collection
    const user = await User.find({id:idOfUser});
    if(user.length < 1){
        validUser = false;
        message = 'The user is not registered in the system.';
    }

    // check if the sum is positive number
    if(sumOfCost <= 0){
        validSum = false;
        message = 'The price must be more than 0.';
    }

    if((isNaN(dateOfCost)) || validDate == false){ // check if the date is valid
        validDate = false;
        message = 'Error - invalid date.';
    }

    //saving the cost year and month to the reports
    const yearOfCost = dateOfCost.getFullYear();
    const costMonth = dateOfCost.getMonth() + 1;

    // add the cost
    if(validSum && validUser && validDate){

        const cost = new Cost({id:idOfUser, description:queryObject.description, sum:sumOfCost, date:queryObject.date, category:queryObject.category});

        // checks whether there are reports in this month and year to the user
        const report = await Report.find({id:idOfUser, month:costMonth, year:yearOfCost});

        // cost template for the future report
        let costData = `description: ${queryObject.description} | category: ${queryObject.category}, ` + `price: ${sumOfCost}`;

        if(report.length === 1)
        { // if the report exists for that month and year
            // update the sum
            const currentSum = Number.parseFloat(report[0].totalSum);
            const addSum = Number.parseFloat(sumOfCost);
            const newSum = currentSum + addSum;

            // add the cost to the list
            let costsList = report[0].listOfCosts; //get the costs list
            costsList.push(costData); // the new cost added

            await Report.findOneAndUpdate({id:idOfUser, month:costMonth, year:yearOfCost}, {totalSum:newSum, listOfCosts:costsList});

        } else{ // if a report NOT exists for that month and year create one
            const monthReport = new Report({id:idOfUser, month:costMonth, year:yearOfCost,
                totalSum:sumOfCost, listOfCosts:costData});

            monthReport.save()
                .catch(error => res.status(400).send('ERROR - cant saving the report. \n' + error));
        }

        // saving the new cost
        await cost.save().then(user => res.status(201).json(user + '\n\n Cost saved successfully!'))
            .catch(error => res.status(400).send('ERROR - cant saving the cost. \n' + error));
    } else{ // inputs Error
        res.status(404).send(message); }
});

/**
 * /addnew - POST REQ to the HTML site
 * MongoDB - Add a new cost into the 'costs' collection and to the 'reports'
 */
router.post('/addnew', async function(req, res) {
    const idOfUser = req.body.id;
    const sumOfCost = req.body.sum;
    const dateOfCost = new Date(req.body.date);

    //data validation
    let validSum = true;
    let validUser = true;
    let validDate = true;

    const numberPattern = /^[0-9]+$/;
    const datePattern = /^\d\d\.\d\d\.\d\d\d\d$/;

    console.log(validDate);
    validSum = numberPattern.test(sumOfCost); // check if sum is numbers only
    validDate = datePattern.test(req.body.date);// check if date is valid
    console.log(validDate);

    let message = '';   // ERROR message

    if(!validSum)
    {
        message = 'Invalid sum.';
    }

    // check if the user already exist in the users collection
    const user = await User.find({id:idOfUser});
    if(user.length < 1){
        validUser = false;
        message = 'The user is not registered in the system.';
    }

    // check if the sum is positive number
    if(sumOfCost <= 0){
        validSum = false;
        message = 'The price must be more than 0.';
    }

    if((isNaN(dateOfCost)) || validDate == false){ // check if the date is valid
        validDate = false;
        message = 'Error - invalid date.';
    }

    //saving the cost year and month to the reports
    const yearOfCost = dateOfCost.getFullYear();
    const costMonth = dateOfCost.getMonth() + 1;

    // add the cost
    if(validSum && validUser && validDate){

        const cost = new Cost({id:idOfUser, description:req.body.description, sum:sumOfCost, date:req.body.date, category:req.body.category});

        // checks whether there are reports in this month and year to the user
        const report = await Report.find({id:idOfUser, month:costMonth, year:yearOfCost});

        // cost template for the future report
        let costData = `description: ${req.body.description} | category: ${req.body.category}, ` + `price: ${sumOfCost}`;

        if(report.length === 1)
        { // if the report exists for that month and year
            // Update the sum
            const currentSum = Number.parseFloat(report[0].totalSum);
            const addSum = Number.parseFloat(sumOfCost);
            const newSum = currentSum + addSum;

            // add the cost to the list
            let costsList = report[0].listOfCosts; //get the costs list
            costsList.push(costData); // the new cost added

            await Report.findOneAndUpdate({id:idOfUser, month:costMonth, year:yearOfCost}, {totalSum:newSum, listOfCosts:costsList});

        } else{ // if a report NOT exists for that month and year create one
            const monthReport = new Report({id:idOfUser, month:costMonth, year:yearOfCost,
                totalSum:sumOfCost, listOfCosts:costData});

            monthReport.save()
                .catch(error => res.status(400).send('ERROR - cant saving the report. \n' + error));
        }

        // saving the new cost
        await cost.save().then(user => res.status(201).json(user + '\n\n Cost saved successfully!'))
            .catch(error => res.status(400).send('ERROR - cant saving the cost. \n' + error));
    } else{ // inputs Error
        res.status(404).send(message); }
});


module.exports = router;