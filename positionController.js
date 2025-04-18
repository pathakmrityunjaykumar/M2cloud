// const { fetchLatestPositionByDeviceId } = require('../models/positionModel');

// // Controller function to get the most recent position for a device
// async function getLatestPositionByDeviceId(req, res) {
//     const { deviceid } = req.params;
//     try {
//         const position = await fetchLatestPositionByDeviceId(deviceid);
//         if (position) {
//             res.json(position);
//         } else {
//             res.status(200).json({ massage: 'No position data found for the given device ID', success:true });
//         }
//     } catch (error) {
//         console.error('Error fetching positions:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

// module.exports = { getLatestPositionByDeviceId };






// // const { fetchLatestPositionByDeviceId } = require('../models/positionModel');
// const { Pool } = require('pg');
// require('dotenv').config();
// // const EventEmitter = require('events');


// const pool = new Pool({
// //     user: process.env.DB_USER,  //'postgres'
// //     host: process.env.DB_HOST,  //'122.176.81.150'
// //     database: process.env.DB_NAME, //'traccardb'
// //     password:process.env.DB_PASSWORD, //'tracking
// //     port:process.env.DB_PORT,
// //     ssl: {
// //     rejectUnauthorized: false, // Disable certificate validation
// //   },
// //   sslmode: 'require', // Force SSL connection

// user:'traccar',
// password:'traccar',
// host:'122.176.81.150',
// port:5432,
// database:'traccar'

// });



// const getLatestPositionByDeviceId = (req, res) => {
//     const deviceId = req.params.deviceid;

//     // Set headers for SSE
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders();  // Ensure headers are sent immediately

//     const query = `
//           SELECT p.id, p.deviceid, p.protocol, p.servertime AS "serverTime", 
//                  p.devicetime AS "deviceTime", p.fixtime AS "fixTime", p.valid,  
//                  p.latitude, p.longitude, p.altitude, p.speed, p.course, 
//                  p.valid, p.protocol, p.address, p.attributes::json AS attributes, 
//                  p.accuracy, p.network, p.geofenceids,
//                  d.name AS device_name, d.uniqueid
//           FROM tc_positions p
//           INNER JOIN tc_devices d ON p.deviceid = d.id
//           WHERE p.deviceid = $1
//           ORDER BY p.servertime DESC
//           LIMIT 1;
//         `;

//     // Execute the query immediately to get the first data fast
//     pool.query(query, [deviceId])
//         .then(result => {
//             const newData = result.rows[0]; // Assuming only one result is returned
//             if (newData) {
//                 res.write(`data: ${JSON.stringify(newData)}\n\n`);
//             }
// console.log('Client connected');
//             // Start polling after the initial data is sent
//             const interval = setInterval(async () => {
//                 try {
//                     const result = await pool.query(query, [deviceId]);
//                     const newData = result.rows[0]; // Assuming only one result is returned
//                     if (newData) {
//                         res.write(`data: ${JSON.stringify(newData)}\n\n`);
//                     }
//                 } catch (err) {
//                     console.error('Error fetching new data:', err);
//                 }
//             }, 5000);  // Poll every 5 seconds to reduce load

//             // Clear interval when connection is closed
//             req.on('close', () => {
//                 clearInterval(interval);
//                 console.log('Client disconnected');
//             });

//         })
//         .catch(err => {
//             console.error('Error fetching data:', err);
//             res.status(500).send('Error fetching data');
//         });
// };


// module.exports = { getLatestPositionByDeviceId };




// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     // ssl: { rejectUnauthorized: false }
// });

// // Function to get the latest position by deviceId
// const getLatestPositionByDeviceId = (req, res) => {
//     const deviceId = req.params.deviceid;

//     // Set headers for SSE
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders();

//     // Initial Query
//     const query = `
//         SELECT p.id, p.deviceid, p.protocol, p.servertime AS "serverTime", 
//                p.devicetime AS "deviceTime", p.fixtime AS "fixTime", p.valid,  
//                p.latitude, p.longitude, p.altitude, p.speed, p.course, 
//                p.valid, p.protocol, p.address, p.attributes::json AS attributes, 
//                p.accuracy, p.network, p.geofenceids,
//                d.name AS device_name, d.uniqueid
//         FROM tc_positions p
//         INNER JOIN tc_devices d ON p.deviceid = d.id
//         WHERE p.deviceid = $1
//         ORDER BY p.servertime DESC
//         LIMIT 1;
//     `;

//     // Helper function to send data
//     const sendData = (data) => {
//         res.write(`data: ${JSON.stringify(data)}\n\n`);
//     };

//     // Initial query to send the first data immediately
//     pool.query(query, [deviceId])
//         .then(result => {
//             const newData = result.rows[0];
//             if (newData) {
//                 sendData(newData);  // Send the first data to the client
//             }

//             // Set interval to send updates every 5 seconds
//             const interval = setInterval(async () => {
//                 try {
//                     const result = await pool.query(query, [deviceId]);
//                     const newData = result.rows[0];
//                     if (newData) {
//                         sendData(newData);  // Send updated data to the client
//                     }
//                 } catch (err) {
//                     console.error('Error fetching new data:', err);
//                 }
//             }, 5000);

//             // Clean up the interval when the client disconnects
//             req.on('close', () => {
//                 clearInterval(interval);
//                 console.log('Client disconnected');
//             });

//         })
//         .catch(err => {
//             console.error('Error fetching data:', err);
//             res.status(500).send('Error fetching data');
//         });
// };

// module.exports = { getLatestPositionByDeviceId };









// // const { fetchLatestPositionByDeviceId } = require('../models/positionModel');

// // // Controller function to get the most recent position for a device
// // async function getLatestPositionByDeviceId(req, res) {
// //     const { deviceid } = req.params;
// //     try {
// //         const position = await fetchLatestPositionByDeviceId(deviceid);
// //         if (position) {
// //             res.json(position);
// //         } else {
// //             res.status(404).json({ error: 'No position data found for the given device ID' });
// //         }
// //     } catch (error) {
// //         console.error('Error fetching positions:', error);
// //         res.status(500).json({ error: 'Internal server error' });
// //     }
// // }

// // module.exports = { getLatestPositionByDeviceId };


// // const express = require('express');
// // const { positionEvents, fetchLatestPositionByDeviceId } = require('./db'); // Import database functions
// // const router = express.Router();

// // // Controller function to get the most recent position and start SSE
// // async function getLatestPositionByDeviceId(req, res) {
// //     const { deviceid } = req.params;
// //     try {
// //         const position = await fetchLatestPositionByDeviceId(deviceid);
// //         if (!position) {
// //             return res.status(404).json({ error: 'No position data found for the given device ID' });
// //         }

// //         // Start SSE stream only when API is called
// //         res.setHeader('Content-Type', 'text/event-stream');
// //         res.setHeader('Cache-Control', 'no-cache');
// //         res.setHeader('Connection', 'keep-alive');

// //         // Send the latest position immediately
// //         res.write(`data: ${JSON.stringify(position)}\n\n`);

// //         // Event listener to send updates when position changes
// //         const sendUpdate = (data) => {
// //             res.write(`data: ${JSON.stringify(data)}\n\n`);
// //         };

// //         // Listen for position updates for the specified deviceid
// //         positionEvents.on(`update-${deviceid}`, sendUpdate);

// //         // Clean up when the client disconnects
// //         req.on('close', () => {
// //             positionEvents.removeListener(`update-${deviceid}`, sendUpdate);
// //         });
// //     } catch (error) {
// //         console.error('Error fetching positions:', error);
// //         res.status(500).json({ error: 'Internal server error' });
// //     }
// // }

// // // Define the route for getting the latest position for a device
// // router.get('/positions/device/:deviceid', getLatestPositionByDeviceId);

// // module.exports = {
// //     router
// // };



// // controllers/positionController.js - Handles the logic for position API requests
// const { fetchLatestPositionByDeviceId } = require('../models/positionModel');  // Import model

// // Function to handle getting the latest position for a device and setting up SSE
// async function getLatestPositionByDeviceId(req, res) {
//     const { deviceid } = req.params;

//     try {
//         const position = await fetchLatestPositionByDeviceId(deviceid);
//         if (!position) {
//             return res.status(404).json({ error: 'No position data found for the given device ID' });
//         }

//         // Start SSE stream only when API is called
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');

//         // Send the latest position immediately
//         res.write(`data: ${JSON.stringify(position)}\n\n`);

//         // Send updates as new position data arrives
//         const sendUpdate = (data) => {
//             res.write(`data: ${JSON.stringify(data)}\n\n`);
//         };

//         // Listen for position updates for the given deviceid
//         positionEvents.on(`update-${deviceid}`, sendUpdate);

//         // Remove the listener when the client disconnects
//         req.on('close', () => {
//             positionEvents.removeListener(`update-${deviceid}`, sendUpdate);
//         });

//     } catch (error) {
//         console.error('Error fetching positions:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

// module.exports = { getLatestPositionByDeviceId };


// positionController.js - Handles the position data and SSE for updates
// const { positionEvents, fetchLatestPositionByDeviceId } = require('../config/db');
const { positionEvents } = require('../config/db');
const { fetchLatestPositionByDeviceId } = require('../models/positionModel');
const { Pool } = require('pg');
require('dotenv').config();
const EventEmitter = require('events');


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// async function getLatestPositionByDeviceId(req, res) {
    // const { deviceid } = req.params;


      // Get the deviceid from the URL parameters
      // const deviceId = req.params.deviceid;
  
      // // Set headers for SSE
      // res.setHeader('Content-Type', 'text/event-stream');
      // res.setHeader('Cache-Control', 'no-cache');
      // res.setHeader('Connection', 'keep-alive');
      // res.flushHeaders();  // Ensure headers are sent immediately
    
      // const query = `
      //   SELECT p.id, p.deviceid, p.protocol, p.servertime AS "serverTime", 
      //          p.devicetime AS "deviceTime", p.fixtime AS "fixTime", p.valid,  
      //          p.latitude, p.longitude, p.altitude, p.speed, p.course, 
      //          p.valid, p.protocol, p.address, p.attributes::json AS attributes, 
      //          p.accuracy, p.network, p.geofenceids,
      //          d.name AS device_name, d.uniqueid
      //   FROM tc_positions p
      //   INNER JOIN tc_devices d ON p.deviceid = d.id
      //   WHERE p.deviceid = $1
      //   ORDER BY p.servertime DESC
      //   LIMIT 1;
      // `;
    
      // // Poll every 1 second
      // const interval = setInterval(async () => {
      //   try {
      //     // Pass the deviceId from the URL to the query
      //     const result = await pool.query(query, [deviceId]);
      //     const newData = result.rows[0]; // Assuming only one result is returned
      //     if (newData) {
      //       res.write(`data: ${JSON.stringify(newData)}\n\n`);
      //     }
      //   } catch (err) {
      //     console.error('Error fetching new data:', err);
      //   }
      // }, 5000);  // Poll every 1 second
    
      // // Clear interval when connection is closed
      // req.on('close', () => {
      //   clearInterval(interval);
      //   console.log('Client disconnected');
      // });


      const getLatestPositionByDeviceId = (req, res) => {
        const deviceId = req.params.deviceid;
      
        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();  // Ensure headers are sent immediately
      
        const query = `
          SELECT p.id, p.deviceid, p.protocol, p.servertime AS "serverTime", 
                 p.devicetime AS "deviceTime", p.fixtime AS "fixTime", p.valid,  
                 p.latitude, p.longitude, p.altitude, p.speed, p.course, 
                 p.valid, p.protocol, p.address, p.attributes::json AS attributes, 
                 p.accuracy, p.network, p.geofenceids,
                 d.name AS device_name, d.uniqueid
          FROM tc_positions p
          INNER JOIN tc_devices d ON p.deviceid = d.id
          WHERE p.deviceid = $1
          ORDER BY p.servertime DESC
          LIMIT 1;
        `;
      
        // Execute the query immediately to get the first data fast
        pool.query(query, [deviceId])
          .then(result => {
            const newData = result.rows[0]; // Assuming only one result is returned
            if (newData) {
              res.write(`data: ${JSON.stringify(newData)}\n\n`);
            }
      
            // Start polling after the initial data is sent
            const interval = setInterval(async () => {
              try {
                const result = await pool.query(query, [deviceId]);
                const newData = result.rows[0]; // Assuming only one result is returned
                if (newData) {
                  res.write(`data: ${JSON.stringify(newData)}\n\n`);
                }
              } catch (err) {
                console.error('Error fetching new data:', err);
              }
            }, 5000);  // Poll every 3 seconds to reduce load
      
            // Clear interval when connection is closed
            req.on('close', () => {
              clearInterval(interval);
              console.log('Client disconnected');
            });
      
          })
          .catch(err => {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
          });
      };


    // try {
    //     // Fetch the latest position for the given device
    //     const position = await fetchLatestPositionByDeviceId(deviceid);
    //     console.log(position);

    //     // If no position data is found, respond with 404 status
    //     if (!position) {
    //         return res.status(404).json({ error: 'No position data found for the given device ID' });
    //     }

    //     // Start SSE (Server-Sent Events) stream only when API is called
    //     // res.setHeader('Content-Type', 'text/event-stream');
    //     // res.setHeader('Cache-Control', 'no-cache');
    //     // res.setHeader('Connection', 'keep-alive');
    //     res.setHeader('Content-Type', 'text/event-stream');
    //     res.setHeader('Cache-Control', 'no-cache');
    //     res.setHeader('Connection', 'keep-alive');
    //     res.flushHeaders();


    //     // Send the latest position immediately
    //     res.write(`data: ${JSON.stringify(position)}\n\n`);

    //     // Define the function to send updates to the client
    //     const sendUpdate = (data) => {
    //         // Send the position update to the client
    //         res.write(`data: ${JSON.stringify(data)}\n\n`);
    //     };

    //     console.log(positionEvents);  // Should print the EventEmitter object

    //     // Listen for position updates and send to client
    //     // positionEvents.on(`update-${deviceid}`, sendUpdate);
    //     if (positionEvents) {
    //         positionEvents.on(`update-${deviceid}`, sendUpdate);
    //     } else {
    //         console.error("positionEvents is undefined");
    //     }


    //     // Ensure that when the client closes the connection, we remove the event listener
    //     req.on('close', () => {
    //         positionEvents.removeListener(`update-${deviceid}`, sendUpdate);
    //     });
    // } catch (error) {
    //     console.error('Error fetching positions:', error);
    //     // Ensure you only send a response once.
    //     if (!res.headersSent) {
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // }
// }


module.exports = { getLatestPositionByDeviceId };



// app.get('/events/:deviceid', (req, res) => {
  
//   });