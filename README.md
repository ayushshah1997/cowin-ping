# cowin-ping

### Main.js

Script will check for slots in district for a particular date every 7 seconds and play mp3 file if it matches the conditions set.
Change date variable to date you want slots for, and add any mp3 file that you want to play in root folder and name it beep.mp3
Current district codes are set for Mumbai and Thane optional. Set boolean thane to true if you to search for slots in both. To use for some other districts find district codes from https://apisetu.gov.in/public/marketplace/api/cowin Metadata APIs

### vaccineSlotsSMSAlert.js


Modified versio of Main.js
Asked friends and family to fill out a google form with vaccine and location preference and phone number.
The script pings cowin API ever 15 seconds and send sms update if slots are available as per location and vaccine preference. 
Sms body contains vaccine center and number of doses available. Added rate limiter functionaity which ensures only 1 sms is sent every 30 minutes to preven spamming.

Sample screenshot of sms sent

<img alt="SMS Screenshot" src="/smsScreenshot.jpeg">
