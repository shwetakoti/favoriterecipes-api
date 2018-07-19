const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const passport = require('passport');
const cors = require('cors');
const {DATABASE_URL, PORT,CLIENT_ORIGIN} = require('./config');
const {router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const PORT = process.env.port||3000;

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);


app.use(morgan('common'));
app.use(express.static('public'));
/*app.use(jsonParser());*/

mongoose.Promise = global.Promise;

app.listen(PORT,()=>console.log(`Listening on port ${PORT}`));

//app.use('/restaurants', restaurantRouter);
app.use('/api/auth', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/api/*',(req,res)=>{res.json({ok:true});});


// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  console.log("In server.js api/protected")
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
