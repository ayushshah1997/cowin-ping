const sound = require("sound-play");
const axios = require('axios')
const sampleUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
let i = 0;
let date = '23-05-2021';
let seshMap = {};
let thane = false;
async function pingCowin() {
    axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=395&date=${date}`, { headers: { 'User-Agent': sampleUserAgent } }).then((result) => {
        //console.log(result.data.sessions.length)sesh.min_age_limit == 45 && 
        if (i % 10 == 0) console.log(i / 10 + " None Yet!")
        i++
        for (const sesh of result.data.sessions) {
            if (sesh.min_age_limit == 18 && sesh.available_capacity_dose1 > 2 && sesh.vaccine=="COVISHIELD") {
                console.log("****************************")
                seshMap[sesh.name] = true
                console.log(sesh.name)
                console.log(sesh.available_capacity)
                console.log("Age: " + sesh.min_age_limit)
                console.log(sesh.pincode)
                sound.play(__dirname + "/beep.mp3");

            }
        }
    }).catch((err) => {
        console.log("Error: " + err.message);
    });
    if (thane) {
        axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=392&date=${date}`, { headers: { 'User-Agent': sampleUserAgent } }).then((result) => {
            for (const sesh of result.data.sessions) {
                if (sesh.min_age_limit == 18 && sesh.available_capacity_dose1 > 0) {
                    console.log("****************************")
                    console.log(sesh.name)
                    console.log(sesh.available_capacity)
                    console.log(sesh.pincode)
                    sound.play(__dirname + "/beep.mp3");
                }
            }
        }).catch((err) => {
            console.log("Error: " + err.message);
        });
    }
}


setInterval(() => {
    pingCowin()
}, 7000);

pingCowin()