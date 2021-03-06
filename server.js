const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./users');

mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', async () => {
  if(await User.countDocuments().exec() > 0) return;

  Promise.all([
    User.create({name: 'user 1'}),
    User.create({name: 'user 2'}),
    User.create({name: 'user 3'}),
    User.create({name: 'user 4'}),
    User.create({name: 'user 5'}),
    User.create({name: 'user 6'}),
    User.create({name: 'user 7'}),
    User.create({name: 'user 8'}),
    User.create({name: 'user 9'}),
    User.create({name: 'user 10'}),
    User.create({name: 'user 11'}),
    User.create({name: 'user 12'}),
  ]).then(() => console.log('Added Users'));
})

// Route for getting a list of users. We actually want to be able to pass in the url the page number and the number of users we want per page so that we can get only the resources that we want and not the whole list.This works great but usually when we have a paginated API, we actually want to return some more info from the API like about the next page and the previous page so that the user can know if there is a next page or not and same with the previous page. It just makes easier for the client using the API.

app.get('/users',paginatedResults(User), (req, res) => {
  res.json(res.paginatedResults);
})

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    
    if(endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }
  
    if(startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }
    
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }
}

app.listen(3000, () => console.log('server running on port 3000'));