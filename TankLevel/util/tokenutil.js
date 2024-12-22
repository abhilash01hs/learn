const express = require("express");
const admin = require("firebase-admin");
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");
const serviceAccount = require("../tanklevel-a7581-f938c11da030.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 5000;

// Function to get an OAuth 2.0 access token
async function getAccessToken() {
	const auth = new GoogleAuth({
		credentials: serviceAccount,
		scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
	});

	const client = await auth.getClient();
	const accessToken = await client.getAccessToken();
	return accessToken.token;
}

app.get("/api/token", async (req, res) => {
	try {
		// Get the access token
		const token = await getAccessToken();
		console.log("token", token);
		// Prepare the FCM message
		const message = {
			message: {
				token: "dI6HRQiZRcqdULgKxRuEk7:APA91bHGuKy9abI0iZU4SBcO-ATS36_LzY_GhiFwqnOMMvr7JXmvjEex7HOOSZ0XjttXMls8gxwZjFDxkDxF6KNvHdu4M1EBsPnk6_25h4075WkY6BKt2Uo", // Replace with your device registration token
				notification: {
					title: "Hello",
					body: "This is a test notification",
				},
				data: {
					key1: "value1",
					key2: "value2",
				},
			},
		};

		// Send the message via FCM
		const response = await axios.post(
			"https://fcm.googleapis.com/v1/projects/tanklevel-a7581/messages:send",
			message,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		console.log("Message sent successfully:", response.data);
		res.json({ success: true, messageId: response.data.name }); // Return success response
	} catch (error) {
		console.error(
			"Error sending message:",
			error.response ? error.response.data : error.message
		);
		res.status(500).send(
			error.response ? error.response.data : error.message
		);
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
