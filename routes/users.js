const express = require('express');
const User = require('../schemas/userschema');
const url = require("url");
const router = express.Router();

/**
 * /getall - GET REQ, show all users in the MongoDB, if there are no users yet - show ERROR
 */
router.get('/getall', async function(req, res) {
  let users;
  users = await User.find({});

  if(users.length === 0){ // if there are no users yet
    res.status(404).send('There are no users yet'); // print error
  }
  else{
    res.status(200).send(users); // print the users
  }
});


/**
 * /add - POST REQ to the Query string (postman/curl)
 * MongoDB - Add a new user into the 'users' collection
 */
router.post('/add',async function (req, res, next) {

  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject.id);
  console.log(queryObject.first_name);
  console.log(queryObject.last_name);
  console.log(queryObject.email_address);


  const id = queryObject.id; // user ID
  const firstName = queryObject.firstname; // user first name
  const lastName = queryObject.lastname;// user last name
  const emailAddress = queryObject.emailaddress;// user last name


  //data validation
  const namePattern = /^[a-zA-Z ]+$/;
  const idPattern = /^[0-9]+$/;
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;

  let isValidId = idPattern.test(id);
  const isValidFirstName = namePattern.test(firstName);
  const isValidLastName = namePattern.test(lastName);
  const isValidEmail = emailPattern.test(emailAddress);

  if(id.length !== 9) // israeli id length = 9
  {
    isValidId = false;
  }

  //checks if the user is already in the collection
  const existingUser = await User.findOne({ id: id }).select("id").lean();
  if (existingUser) console.log("User exists");

  let newUser;
  if (isValidEmail && isValidFirstName && isValidLastName && isValidId && !existingUser) {
    newUser = new User({id: id, first_name: firstName, last_name: lastName, email_address: emailAddress});

    // saving the new user into DB.
    await newUser.save().then(user => res.status(201).json(user + '\n\nUser saved successfully!'))
        .catch(error => res.status(400).send('There was a problem saving the user. \n' + error));
    console.log('user added')
  } else {
    if (existingUser) {
      res.status(400).send('ERROR - This ID is already register.');
      console.log('already register');
    } else if (!isValidEmail) {
      res.status(400).send('ERROR - please check the e-mail address and try again.');
      console.log('mail error');
    } else if (!isValidId) {
      res.status(400).send('ERROR - please check the ID and try again.');
      console.log('id error');
    } else if (!isValidFirstName || !isValidLastName) {
      res.status(400).send('ERROR - please check the firstname/lastname and try again.');
      console.log('name error');
    }
  }

});


/**
 * /addnew - POST REQ to the HTML site
 * MongoDB - Add a new user into the 'users' collection
 */
router.post('/addnew', async function(req, res) {

  const id = req.body.id; // user ID
  const firstName = req.body.firstname; // user first name
  const lastName = req.body.lastname;// user last name
  const emailAddress = req.body.emailaddress; //user email

  console.log(id);
  console.log(firstName);
  console.log(lastName);
  console.log(req.body.mail);

  //data validation
  const namePattern = /^[a-zA-Z ]+$/;
  let idPattern = /^[0-9]+$/;
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;

  let isValidId = idPattern.test(id);
  const isValidFirstName = namePattern.test(firstName);
  const isValidLastName = namePattern.test(lastName);
  const isValidEmail = emailPattern.test(emailAddress);

  if(id.length !== 9) // israeli id length = 9
  {
    isValidId = false;
  }


  //checks if the user is already in the collection
  const existingUser = await User.findOne({ id: id }).select("id").lean();
  if (existingUser) console.log("User exists");

  let newUser;
  if (isValidEmail && isValidFirstName && isValidLastName && isValidId && !existingUser) {
    newUser = new User({id: id, first_name: firstName, last_name: lastName, email_address: emailAddress});

    // Saving the new user into DB.
    await newUser.save().then(user => res.status(201).json(user + '\n\nUser saved successfully!'))
        .catch(error => res.status(400).send('There was a problem saving the user. \n' + error));
    console.log('user added')
  } else {
    if (existingUser) {
      res.status(400).send('ERROR - This ID is already register.');
      console.log('already register');
    } else if (!isValidEmail) {
      res.status(400).send('ERROR - please check the e-mail address and try again.');
      console.log('mail error');
    } else if (!isValidId) {
      res.status(400).send('ERROR - please check the ID and try again.');
      console.log('id error');
    } else if (!isValidFirstName || !isValidLastName) {
      res.status(400).send('ERROR - please check the firstname/lastname and try again.');
      console.log('name error');
    }
  }

});

module.exports = router;