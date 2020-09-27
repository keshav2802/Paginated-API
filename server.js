const express = require('express');
const app = express();

const users = [
  {id: 1, name: 'user 1'},
  {id: 2, name: 'user 2'},
  {id: 3, name: 'user 3'},
  {id: 4, name: 'user 4'},
  {id: 5, name: 'user 5'},
  {id: 6, name: 'user 6'},
  {id: 7, name: 'user 7'},
  {id: 8, name: 'user 8'},
  {id: 9, name: 'user 9'},
  {id: 10, name: 'user 10'},
  {id: 11, name: 'user 11'},
  {id: 12, name: 'user 12'},
  {id: 13, name: 'user 13'}
];

const posts = [
  {id: 1, name: 'post 1'},
  {id: 2, name: 'post 2'},
  {id: 3, name: 'post 3'},
  {id: 4, name: 'post 4'},
  {id: 5, name: 'post 5'},
  {id: 6, name: 'post 6'},
  {id: 7, name: 'post 7'},
  {id: 8, name: 'post 8'},
  {id: 9, name: 'post 9'},
  {id: 10, name: 'post 10'},
  {id: 11, name: 'post 11'},
  {id: 12, name: 'post 12'},
  {id: 13, name: 'post 13'}
];

app.get('/posts', paginatedResults(posts), (req, res) => {
  res.json(res.paginatedResults);
})

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