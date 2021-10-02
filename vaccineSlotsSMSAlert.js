/**
 * 
 * There are many ways I would improve the code, 
 * this was developed in 2 hours. In May india had a vaccine shortage
 * and slots would open up and get booked in a matter of minutes. 
 * The Cowin APIs offered vaccine slots available by district. 
 * To get isntant alerts when slots open up I wrote this simple script
 * that send an API request every 15 seconds and parsed to response to see 
 * if there were any vacant slots.
 * The script ran on my laptop and alerted with a beep sound when there were slots. 
 * To extend this to friends and family I used Tiwilio API to send SMS 
 * alerts when slots opened up.
 * 
 * This script was pointless after few feeks when government impose a rate 
 * limiter that you could call the API only 20 times in 30 mintues
 * and the vaccine supply also increased hence slots were available. 
 */


const axios = require('axios');
var nodemailer = require('nodemailer');
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);

const sampleUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'


// Data from Google sheet is stored as excel
var sheetData = [];
// Used to map phone number to timestamp of last SMS sent
// to be used to limit the number of SMS sent 
var rateLimited = {};

/*
Pull data from the Google Sheets with Gooogle Form submission
the data is refresed every 30 minutes
Using sheet.best api to get sheet data as a JSON
*/
async function pullSheet() {
  try {
    await axios.get(`https://sheet.best/api/sheets/72539cae-16c2-42ad-a77f-e3f074d64c0e`).then((result) => {
      sheetData = result.data;
      console.log(JSON.stringify(sheetData))
    })
  } catch (e) {
    console.log(e)
  }
}

pullSheet();

setInterval(() => {
    pullSheet()
  }, 60 * 1000 * 30);


var mumbai;
var thane;
let date = '11-05-2021';

async function pingCowin() {
  try {
    //Mumbai Data
    await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=395&date=${date}`, { headers: { 'User-Agent': sampleUserAgent } }).then((result) => {
      mumbai = result.data;
    }).catch((err) => {
      console.log('Error: ' + err.message);
    });

    //Thane Data
    await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=392&date=${date}`, { headers: { 'User-Agent': sampleUserAgent } }).then((result) => {
      thane = result.data;
    }).catch((err) => {
      console.log('Error: ' + err.message);
    });

    
    for (const row of sheetData) {
      if (row.Age != '') {
        // Initialize sms to be sent
        let smsBody = '';
        let age = row['Age'] == '18-44' ? 18 : 45;

        //Check if user prefers Mumbai
        if (row['Location Preference:'] == 'Mumbai' || row['Location Preference:'] == 'Mumbai or Thane') {
          // Check Mumbai centers for slots
          for (const sesh of mumbai.sessions) {
              // Check if center has empty slots, age limit criteria is satisfied and vaccine preference is also matching( Covaxin or Covishield)
            if (sesh.available_capacity > 2 && sesh.min_age_limit == age && (sesh.vaccine == row['Vaccine Preference'] || 'Any' == row['Vaccine Preference'])) {
              if (smsBody == '') {
                smsBody += "Mumbai:\n"
              }
              // Add center to SMS body
              smsBody += sesh.name + ' Slots: ' + sesh.available_capacity + '\n'
            }
          }
        }

        //Check if user prefers Thane
        if (row['Location Preference:'] == 'Mumbai or Thane') {
          let smsBody1 = '';
          // Check Thane centers for slots
          for (const sesh of thane.sessions) {
              // Check if center has empty slots, age limit criteria is satisfied and vaccine preference is also matching( Covaxin or Covishield)
            if (sesh.available_capacity > 2 && sesh.min_age_limit == age && (sesh.vaccine == row['Vaccine Preference'] || 'Any' == row['Vaccine Preference'])) {
              if (smsBody1 == '') {
                smsBody1 += "Thane:\n"
              }
              // Add center to SMS body
              smsBody1 += sesh.name + ' Slots: ' + sesh.available_capacity + '\n'
            }
          }
        }

        // Don't send Sms body is null hence no slots available
        if (smsBody != '' ){
          let phone = row['Phone Number for SMS Updates (10 digits Eg-9876543210)'];
          //Trim to single sms length
          if (smsBody.length > 160) {
            smsBody = smsBody.substring(0, 140) + '\nMany more....'
          }
          let currentTime = Date.now();                              
          // If sms was sent to phone number in last 30 minutes dont send again
          if (rateLimited[phone] == undefined || currentTime - rateLimited[phone] > 1000 * 30 * 60) {
            //Send sms via twilio
            await client.messages.create({
              to: `+91${phone}`,
              from: '+13862674308',
              body: smsBody,
            }).then(message => {
                // Store map of phone number and time last message sent
                // To avoid spam since we poll the api every 15 second
              rateLimited[phone] = currentTime;
              console.log(message.sid)
            }).catch(err => {
              console.log(err);
            })
          }
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}



// Ping cowin API every 15 seconds

setInterval(() => {
  pingCowin()
}, 15000);
