const express = require('express');
const app = express();
app.use(express.json());

// path (exclude param)
// variable, id
// /:id
// .HTTP_METHOD(path, callback function = route handler = middleware)
app.get('/:userId/:productId', function (req, res) {
  // res.send('Hello World');
  // res.sendStatus(204);
  // res.json([1,2,3]);
  // res.status(201).json({ data: 1 });
  // 链式调用
  res.json({
    query: req.query,
    route: req.params,
    body: req.body,
  });
  // left hang
});

/**
 * 如何从request里获取数据
 * 1. route params  /users/:id      /users/:userId/products/:productId
 *    req.params    req.params.id   req.params.userId req.params.productId
 *    GET, PUT/PATCH, DELETE
 * 2. query params /users?sortBy=name
 *    req.query     req.query.sortBy  const {sortBy} = req.query;
 *    GET
 * 3. body
 *    req.body (body-parser) express.json()  app.use(express.json())
 *    POST, PUT/PATCH
 *
 * from headers (authorization token)
 */

// express.json() -> middleware function

// 以path开头的路径
// app.use()
// app.use('/users',()=>{});
// GET /users
// POST /users/123
// POST /users/456

// path -> exact match
// GET /users/123
// app.get('/users/123',()=>{})
// app.post()
// app.delete()
// app.put(), app.patch()

app.listen(3000);
