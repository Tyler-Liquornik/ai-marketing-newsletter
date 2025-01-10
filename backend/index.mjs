// to deploy changes:
// in the backend folder, run:
// zip -r function.zip index.mjs node_modules/
// and then upload to AWS Lambda

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "us-east-2" });

export const handler = async (event) => {
  try {
    // Parse the text/plain content into JSON
    const { emailRecipients, emailContent } = JSON.parse(event.body);

    // Validate the payload
    if (!emailRecipients || emailRecipients.length === 0 || !emailContent) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({
          message: "Invalid request: Missing email recipients or email content.",
        }),
      };
    }

    // Prepare SES email commands
    const emailPromises = emailRecipients.map(({ fName, email }) => {
      const command = new SendEmailCommand({
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
        Source: "contact.futbol.lads@gmail.com", // Replace with your verified SES email
      });

      return ses.send(command);
    });

    // Send all emails
    await Promise.all(emailPromises);

    // Return success response with CORS headers
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "Emails sent successfully.",
      }),
    };
  } catch (error) {
    console.error("Error sending emails:", error);

    // Return error response with CORS headers
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "Failed to send emails.",
        error: error.message,
      }),
    };
  }
};
