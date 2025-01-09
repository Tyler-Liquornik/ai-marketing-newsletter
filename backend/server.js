const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });
const ses = new AWS.SES();

const app = express();

// Enable CORS
app.use(cors());

// Middleware to handle text/plain requests
app.use(express.text());

app.post("/sendEmails", async (req, res) => {
  try {
    console.log("Raw Request Body:", req.body);

    // Parse the text/plain body to JSON
    const { emailRecipients, emailContent } = JSON.parse(req.body);

    if (!emailRecipients || emailRecipients.length === 0 || !emailContent) {
      return res.status(400).send("Missing email recipients or content.");
    }

    const emailPromises = emailRecipients.map(({ fName, email }) => {
      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Text: {
              Data: emailContent.replace("[First Name]", fName),
            },
          },
          Subject: {
            Data: "Your Special Offer!",
          },
        },
        Source: "contact.futbol.lads@gmail.com",
      };

      return ses.sendEmail(params).promise();
    });

    await Promise.all(emailPromises);

    res.status(200).send("Emails sent successfully.");
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send("Failed to send emails: " + error.message);
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
