const accountSid = 'AC655e568404fcb512214a4f02cc62cf77';
const authToken = '91d624bec727d34e98f5e01d54b1a23a';
const client = require('twilio')(accountSid, authToken);

client.verify.v2.services("VA17e9adc16effdc12c2182fb161baaef4")
      .verificationChecks
      .create({to: '+918918633877', code: '[Code]'})
      .then(verification_check => console.log(verification_check.status));