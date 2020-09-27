const express = require('express');
const app = express();


// Route for getting a list of users. We actually want to be able to pass in the url the page number and the number of users we want per page so that we can get only the resources that we want and not the whole list.This works great but usually when we have a paginated API, we actually want to return some more info from the API like about the next page and the previous page so that the user can know if there is a next page or not and same with the previous page. It just makes easier for the client using the API.

app.get('/users',paginatedResults(users), (req, res) => {
  res.json(res.paginatedResults);
})

function paginatedResults(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    
    if(endIndex < model.length-1) {
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
    
    results.results = model.slice(startIndex, endIndex);
    
    res.paginatedResults = results;

    next();
  }
}

app.listen(3000, () => console.log('server running on port 3000'));