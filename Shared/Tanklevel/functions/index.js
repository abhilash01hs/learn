/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {info, error, warn} = require("firebase-functions/logger");
const {PATH, CONSTANTS} = require("./config");
// Initialize Firebase Admin SDK
admin.initializeApp();

const getMessageBody = (newValue) => {
	const levelPrefix = "Water level at";
	const motorPrefix = "Motor ";
	let motoring = false;
	let isApprovedUsers = false;
	let message = "";
	const group = new Set();
	group.add(CONSTANTS.admin);
	switch (newValue) {
	case "START":
		message = `${motorPrefix} Started`;
		motoring = true;
		isApprovedUsers = true;
		break;
	case "STOP":
		message = `${motorPrefix} Stopped`;
		motoring = true;
		isApprovedUsers = true;
		break;
	case "MIN10":
		message = `${levelPrefix} 10%`;
		isApprovedUsers = true;
		break;
	case "MIN20":
		message = `${levelPrefix} 20%`;
		break;
	case "NOR50":
		message = `${levelPrefix} 50%`;
		break;
	case "MAX90":
		message = `${levelPrefix} 90%`;
		isApprovedUsers = true;
		break;
	case "MAX95":
		message = `${levelPrefix} 95%`;
		break;
	case "MAX100":
		message = `${levelPrefix} 100%`;
		isApprovedUsers = true;
		break;
	default:
		break;
	}
	if (isApprovedUsers) {
		group.add(CONSTANTS.approved);
	}
	return {message: message, motoring: motoring, sendRoles: group};
};

const getUserGroups = async (roles) => {
	let array = [];
	try {
		await admin.database().ref(PATH.userGroups)
			.get().then((s) => {
				roles.forEach((role) => {
					const val = s.val()[role];
					if (val) {
						array = [...array, ...val];
					}
				});
			});
	} catch (e) {
		error("Retrieving v1 failed, ", e);
	}
	info("Users Array: ", array);
	return array;
};

const getFcmTokens = async (users) => {
	const fcmSet = new Set();
	try {
		await admin
			.database()
			.ref(PATH.deviceToken)
			.get().then((d) => {
				const tokens = d.val();
				info("Tokens: ", tokens);
				users.forEach((user) => {
					try {
						tokens[user].forEach((tokenUser) => {
							fcmSet.add(tokenUser);
						});
					} catch (e) {
						warn("Token not found for user id: ", user);
					}
				});
			});
	} catch (e) {
		error("Retrieving token failed, ", e);
	}
	return fcmSet;
};

const getMessagePayload = (motoring, fcmSet, message) => {
	const title = motoring ? "Motor" : "TankLevel";
	const fcmToken = Array.from(fcmSet);
	const payload = {
		notification: {
			title: `${title} Alert!`,
			body: message,
		},
		android: {
			priority: "high",
			notification: {
				defaultVibrateTimings: true,
				defaultSound: true,
			},
		},
		tokens: fcmToken,
	};
	info("payload: ", payload);
	return payload;
};

exports.checkValueAndNotify = functions.database
	.onValueUpdated({ref: PATH.data + PATH.notification, region: CONSTANTS.db_region},
		async (change) => {
			const newValue = change.data.after.val();
			const prevValue = change.data.before.val();
			info("Current Value: ", newValue);
			const {message, motoring, sendRoles} = getMessageBody(newValue);
			if (prevValue !== newValue && message) {
				info("Roles: ", sendRoles);
				// Construct users groups
				const users = await getUserGroups(sendRoles);
				// Construct fcm tokens
				const fcmSet = await getFcmTokens(users);
				// Construct the notification payload
				const payload = getMessagePayload(motoring, fcmSet, message);
				// Send notification to the list of FCM tokens
				return admin
					.messaging()
					.sendEachForMulticast(payload)
					.then((response) => {
						info("Notification sent successfully:", response);
						return null;
					})
					.catch((error) => {
						error("Error sending notification:", error);
						return null;
					});
			}
			return null;
		});
// ------------------------------------------------------------------------------------------//
// ------------------------------------------------------------------------------------------//
const monitorPing = (devicePath, deviceId, newTimestamp) => {
	return setTimeout(async () => {
		const snapshot = await admin
			.database()
			.ref(devicePath + PATH.ping)
			.get();
		const deviceData = snapshot.val();
		if (deviceData.lastPing === newTimestamp) {
			// No update to lastPing, mark the device as offline
			console.log(`Ping timeout for ${deviceId}. Marking as offline.`);
			await admin.database().ref(devicePath + PATH.ping).update({
				powerStatus: false,
				wifiStatus: false,
			});
		} else {
			console.log(`${deviceId} is still online. Ping updated.`);
		}
	}, CONSTANTS.pingTimeout);
};

const timeOutId = {};

exports.pingRelaySensor = functions.database
	.onValueCreated({ref: PATH.currentActive, region: CONSTANTS.db_region},
		async (change) =>{
			const newTimestamp = change.after.val();
			console.log(`Ping received for Relay Sensor at: ${newTimestamp}`);
			timeOutId["relay"] = monitorPing(PATH.relaySensor, "Relay Sensor", newTimestamp);
		});

exports.pingTankSensor = functions.database
	.onValueCreated({ref: PATH.currentActive, region: CONSTANTS.db_region},
		async (change) =>{
			const newTimestamp = change.after.val();
			console.log(`Ping received for Tank Sensor at: ${newTimestamp}`);
			timeOutId["tank"] = monitorPing(PATH.tankSensor, "Tank Sensor", newTimestamp);
		});

exports.clearTimeouts = functions.database
	.onValueDeleted({ref: PATH.currentActive, region: CONSTANTS.db_region},
		async (change) =>{
			clearTimeout(timeOutId["relay"]);
			clearTimeout(timeOutId["tank"]);
			console.log("Timeouts cleared");
		});
