const { fetchLatestPositionByDeviceId } = require('../models/positionModel');

// Controller function to get the most recent position for a device
async function getLatestPositionByDeviceId(req, res) {
    const { deviceid } = req.params;
    try {
        const position = await fetchLatestPositionByDeviceId(deviceid);
        if (position) {
            res.json(position);
        } else {
            res.status(200).json({ massage: 'No position data found for the given device ID', success:true });
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getLatestPositionByDeviceId };






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