const express = require('express');




const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

const homeRoute = require('../routes/home_route');
const dialogflowRoute = require('../routes/dialogflow_route');

app.use(homeRoute.router);
app.use(dialogflowRoute.router);

// app.post('/webhook', (req, res) => {
//     let intent= req.body.queryResult.intent.displayName;
//     let parameters = req.body.queryResult.parameters;
  
//     if (intent === 'module') {
//       let selectedOptions = [];
  
    
//       if (parameters.option1) {
//         selectedOptions.push('Option 1');
//       }
//       if (parameters.option2) {
//         selectedOptions.push('Option 2');
//       }
//       if (parameters.option3) {
//         selectedOptions.push('Option 3');
//       }
  
      
//       let responseText = `You selected: ${selectedOptions.join(', ')}`;
//       return res.json({
//         fulfillmentText: responseText,
//       });
//     } else {
//       return res.json({
//         fulfillmentText: "Unknown intent. Please try again.",
//       });
//     }
//   });


  app.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
  });

// mongoDb connection : 
const dbConnect = require("../config/database");
 dbConnect();



// sql connection code

const mysql = require('mysql2');
const cors = require('cors');
app.use(cors());
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'Chatbot',
  password: 'Chatbot@123'
});


app.get('/fetch-user', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.stack);
      res.status(500).send('Error connecting to MySQL');
      console.log("Connection fail");
      return;
    }

    console.log('Connected to MySQL database!');

    connection.query('SELECT * FROM AarogyaData', (queryError, results) => {
      connection.release(); 

      if (queryError) {
        console.error('Error fetching records:', queryError.stack);
        res.status(500).send('Error fetching records');
        return;
      }

      res.json(results);
    });
  });
});

// Try to insert data into sql
app.post('/webhook', (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  const params = req.body.queryResult.parameters;

  if (intentName === 'StoreData') {
      const consultants = params.consultants;

      pool.query('INSERT INTO CONULTANT_INFO1 (consultants) VALUES (?)', [consultants], (err, results) => {
          if (err) {
              console.error('Error inserting data:', err.stack);
              res.status(500).send('Error inserting data');
              return;
          }

          res.json({
              fulfillmentMessages: [
                  {
                      text: {
                          text: ['Data has been successfully stored.']
                      }
                  }
              ]
          });
      });
  } else {
      res.json({
          fulfillmentMessages: [
              {
                  text: {
                      text: ['Intent not recognized.']
                  }
              }
          ]
      });
  }
});










