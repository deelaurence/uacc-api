const axios = require('axios');
const { sendMail } = require('./mailer');

require("dotenv").config();

const apiUrl = 'https://api.brevo.com/v3/smtp/email';
const apiKey = process.env.brevo_secret;

const sendBrevoMail = async (email, name, link) => {
  const requestData = {
    sender: {
      name: 'Odunayo from UACC',
      email: 'deverenceconnect@yah.com'
    },
    to: [
      {
        email,
        name
      }
    ],
    subject: 'Verify Your Account',
    htmlContent: `<html>
  <head>
    <meta charset="utf-8" />
    <title>Verify Account</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Aboreto&family=Blinker:wght@100;200;300;400;600;700;800;900");
      /* Reset styles to ensure consistent rendering across different email clients */
      body,
      #bodyTable {
        height: 100% !important;
        margin: 0;
        padding: 0;
        width: 100% !important;
      }

      table {
        border-collapse: collapse;
      }

      td {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333333;
      }

      /* Main email container */
      #bodyTable {
        background-color: #f4f4f4;
      }

      /* Email content */
      #emailContainer {
        background-color: #ffffff;
        max-width: 600px;
        margin: 0 auto;
      }

      /* Email header */
      #header {
        background-color: #4caf4f43;
        padding: 20px;
        font-family: aboreto;
        text-align: center;
        font-size: 10px;
        color: white;
        height: 260px;
        position: relative;
        overflow: hidden;
      }
      img {
        border: 0;
        margin: 0 5%;
        left: 0;
        top: 50%;
        outline: none;
        width: 90%;
        text-decoration: none;
        position: absolute;

        z-index: 1;
      }
      .overlay {
        position: absolute;
        bottom: 0;
        height: 100%;
        width: 100%;
        left: 0;
        z-index: 999;
      }
      h1 {
        position: relative;
        z-index: 2;
        font-size: 65px;
        color: tomato;
        display: none;
        margin-bottom: -40px;
      }
      /* Email body */
      #body {
        padding: 5%;
      }

      /* Button styles */
      .button {
        display: inline-block;
        margin: 10px 0;
        padding: 12px 24px;
        background-color: #4caf50;
        color: white !important;
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        border-radius: 4px;
      }

      /* Email footer */
      #footer {
        background-color: #f9fafb;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <table id="bodyTable" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <table id="emailContainer" cellpadding="0" cellspacing="0" border="0">
            <!-- Email header -->
            <tr>
              <td id="header">
                <h1>UACC</h1>
                <div class="overlay"></div>
                <img
                  src="https://images.unsplash.com/photo-1599406079829-a91deeb440de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNyb3NzfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60"
                />
              </td>
            </tr>
            <!-- Email body -->
            <tr>
              <td id="body">
                <p>
                  Hello ${name}, We are excited to have you on board, click on
                  the button below to verify your email
                </p>
                <a class="button" href="${link}">Verify Email</a>
              </td>
            </tr>
            <!-- Email footer -->
            <tr>
              <td id="footer">
                &copy; 2023 Mt. Of Mercy. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
 `
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      }
    });

    console.log('Email sent successfully:', email, name, response.status);
    return response.status;
  } catch (error) {
    console.error('Error sending email:', error.response);
  }
};
const sendPasswordResetMail = async (email, name, link) => {
  const requestData = {
    sender: {
      name: 'Odunayo from UACC',
      email: 'deverenceconnect@yah.com'
    },
    to: [
      {
        email,
        name
      }
    ],
    subject: 'Verify Your Account',
    htmlContent: `<html>
  <head>
    <meta charset="utf-8" />
    <title>Verify Account</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Aboreto&family=Blinker:wght@100;200;300;400;600;700;800;900");
      /* Reset styles to ensure consistent rendering across different email clients */
      body,
      #bodyTable {
        height: 100% !important;
        margin: 0;
        padding: 0;
        width: 100% !important;
      }

      table {
        border-collapse: collapse;
      }

      td {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333333;
      }

      /* Main email container */
      #bodyTable {
        background-color: #f4f4f4;
      }

      /* Email content */
      #emailContainer {
        background-color: #ffffff;
        max-width: 600px;
        margin: 0 auto;
      }

      /* Email header */
      #header {
        background-color: #4caf4f43;
        padding: 20px;
        font-family: aboreto;
        text-align: center;
        font-size: 10px;
        color: white;
        height: 260px;
        position: relative;
        overflow: hidden;
      }
      img {
        border: 0;
        margin: 0 5%;
        left: 0;
        top: 50%;
        outline: none;
        width: 90%;
        text-decoration: none;
        position: absolute;

        z-index: 1;
      }
      .overlay {
        position: absolute;
        bottom: 0;
        height: 100%;
        width: 100%;
        left: 0;
        z-index: 999;
      }
      h1 {
        position: relative;
        z-index: 2;
        font-size: 65px;
        color: tomato;
        display: none;
        margin-bottom: -40px;
      }
      /* Email body */
      #body {
        padding: 5%;
      }

      /* Button styles */
      .button {
        display: inline-block;
        margin: 10px 0;
        padding: 12px 24px;
        background-color: #4caf50;
        color: white !important;
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        border-radius: 4px;
      }

      /* Email footer */
      #footer {
        background-color: #f9fafb;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <table id="bodyTable" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <table id="emailContainer" cellpadding="0" cellspacing="0" border="0">
            <!-- Email header -->
            <tr>
              <td id="header">
                <h1>UACC</h1>
                <div class="overlay"></div>
                <img
                  src="https://images.unsplash.com/photo-1599406079829-a91deeb440de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNyb3NzfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60"
                />
              </td>
            </tr>
            <!-- Email body -->
            <tr>
              <td id="body">
                <p>
                  Hello ${name}, You have initiated a password reset. Click on the link below to 
                  reset your password
                </p>
                <a class="button" href="${link}">Verify Email</a>
                <p>
                  Ignore this mail if you haven't requested for a passsword reset. 
                </p>
              </td>
            </tr>
            <!-- Email footer -->
            <tr>
              <td id="footer">
                &copy; 2023 Mt. Of Mercy. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
 `
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      }
    });

    console.log('Email sent successfully:', email, name, response.status);
    return response.status;
  } catch (error) {
    console.error('Error sending email:', error.response);
  }
};

module.exports = { sendBrevoMail, sendPasswordResetMail };
