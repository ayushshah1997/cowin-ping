# cowin-ping

Developed these scripts in month of May when India just opened up Covid vaccines for 18-44 age category. There too few slots that time and they were going out in matter of minutes. Developed main.js and got my vaccine early and decided to extend it to friends and family by send SMS alerts. This was devloped in 2 hours and code is far from optimal. But it was designed to work and boy did it work.



### Main.js

Script will check for slots in district for a particular date every 7 seconds and play mp3 file if it matches the conditions set.
Change date variable to date you want slots for, and add any mp3 file that you want to play in root folder and name it beep.mp3
Current district codes are set for Mumbai and Thane optional. Set boolean thane to true if you to search for slots in both. To use for some other districts find district codes from https://apisetu.gov.in/public/marketplace/api/cowin Metadata APIs

### vaccineSlotsSMSAlert.js


Modified version of Main.js
Asked friends and family to fill out a google form with vaccine and location preference and phone number.
The script pulls the data from the Google sheet, then pings cowin API every 15 seconds and send sms update to every person in the sheet if slots are available as per their location and vaccine preference. 
SMS body contains vaccine center and number of doses available. Limited SMS size to 160 characters to avoid excess charges. Added rate limiter functionaity which ensures only 1 SMS is sent every 30 minutes to prevent spamming. SMS is sent via Twilio API.

The script was redundant once vaccine shortage was resolved and government rate limited the API to 20 request per 30 minutes.

Sample screenshot of sms sent

<img alt="SMS Screenshot" src="/smsScreenshot.jpeg">
