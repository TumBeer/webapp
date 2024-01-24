const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve static files from the specified directory
app.use(express.static(path.join(__dirname, './client/build')));

// Set up a route to handle other routes and render the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

const wss = new WebSocket.Server({ server:server });

// const db = mysql.createConnection({
//   user: "root",
//   host: "localhost",
//   password: "setkit",
//   database: "sensor_data",
// });

// // const randomValue = Math.floor(Math.random() * 100); // Replace with your logic to generate random numbers
// const insertData = (temperature, voltage) => {

//   const insertQuery = 'INSERT INTO sensor (temperature, voltage) VALUES (?, ?)';
//   db.query(insertQuery, [temperature, voltage], (err, results) => {
//     if (err) {
//       console.error('Error inserting data:', err);
//       return;
//     }
//     console.log('Data inserted successfully, insertId =', results.insertId);
//   });
// };

// app.get("/dataAmount", (req, res) => {
//   db.query("SELECT COUNT(*) FROM sensor", (err, result) => {
//     if (err) {
//       console.log('Error connecting to MySQL database:', err);
//       res.sendStatus(500); // Send Internal Server Error status
//     } else {
//       // Check if there is any result
//       if (result.length > 0) {
//         res.send(result);
//       } else {
//         res.sendStatus(404); // Send Not Found status
//       }
//     }
//     dataCount = result[0]['COUNT(*)']
//     console.log(dataCount);
//   });
// });

// app.get("/data50", (req, res) => {
//   db.query("SELECT * FROM sensor ORDER BY id DESC LIMIT 50", (err, result) => {
//     if (err) {
//       console.log('Error connecting to MySQL database:', err);
//       res.sendStatus(500); // Send Internal Server Error status
//     } else {
//       // Check if there is any result
//       if (result.length > 0) {
//         res.send(result);
//       } else {
//         res.sendStatus(404); // Send Not Found status
//       }
//     }
//     console.log('Connected to MySQL database');
//     console.log("50 Data: ", result);
//   });
// });

// app.delete("/delete", (req, res) => {
//   db.query("DELETE FROM sensor", (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Internal Server Error");
//     } else {
//       res.send(result);
//     }
//   });
// });



// // Handle Ctrl+C to close the database connection before exiting
// process.on('SIGINT', () => {
//   connection.end();
//   console.log('Disconnected from MySQL database');
//   process.exit();
// });

let onoff = true;


app.post("/command", (req, res) => {
  // if(onoff){
  //   onoff = false;
  // } else {
  //   onoff = true;
  // }
  onoff = !onoff;
  console.log('On-Off: ', onoff);
  res.send(JSON.stringify({command: onoff}));

});


let switch_1 = true;
let switch_2 = true;
let switch_3 = true;
let switch_4 = true;


app.post("/switch_1", (req, res) => {
  switch_1 = !switch_1;
  console.log('Switch_1: ', switch_1);
  res.send(JSON.stringify({command: switch_1}));
});

app.post("/switch_2", (req, res) => {
  switch_2 = !switch_2;
  console.log('Switch_2: ', switch_2);
  res.send(JSON.stringify({command: switch_2}));
});

app.post("/switch_3", (req, res) => {
  switch_3 = !switch_3;
  console.log('Switch_3: ', switch_3);
  res.send(JSON.stringify({command: switch_3}));
});4
app.post("/switch_4", (req, res) => {
  switch_4 = !switch_4;
  console.log('Switch_4: ', switch_4);
  res.send(JSON.stringify({command: switch_4}));
});

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  console.log('A new client Connected!');
  // ws.send('Welcome New Client!');

  ws.on('message', function incoming(message) {
    let receivedValue;
  
    try {
      // Check if the message is a Blob
      if (message instanceof Blob) {
        // Handle Blob messages here, if needed
        console.log('Received a Blob:', message);
        return;
      }
  
      // If not a Blob, assume it's a JSON string
      console.log('Received Message: %o', message);
      const parsedMessage = JSON.parse(message);
      // console.log('Received JSON: %o', parsedMessage);
      temperature = parsedMessage.temperature;
      voltage = parsedMessage.voltage;
      // console.log('Parsed Value:', 'Temperature: ', temperature, 'Voltage: ', voltage);
      insertData(temperature, voltage);
    } catch (error) {
      console.error('Error Parsing Message:', error);
      return; // Return early to avoid sending an undefined value
    }
  
    // Now you can use `receivedValue` outside the try block
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const message = {
          temperature: temperature,
          voltage: voltage,
          command: onoff,
          switch_1: switch_1,
          switch_2: switch_2,
          switch_3: switch_3,
          switch_4: switch_4
        };
    
        console.log("Sent to Client:", message);
        client.send(JSON.stringify(message));
      }
    });
  
    // You can also send a response to the original sender if needed
    // ws.send('Got user message');
  });
});

// app.get('/', (req, res) => res.send('Hello World!'))





const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Lisening on port : ", PORT));



