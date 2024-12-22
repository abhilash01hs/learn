import messaging from "@react-native-firebase/messaging";

export const initializeMessaging = async () => {
	let token = null;
	const authStatus = await messaging().requestPermission();
	const enabled =
		authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
		authStatus === messaging.AuthorizationStatus.PROVISIONAL;

	if (enabled) {
		console.log("Authorization status:", authStatus);
		token = await getToken();
	}
	return token;
};

export const getToken = async () => {
	let result;
	await messaging()
		.getToken()
		.then((s) => {
			result = s;
		})
		.catch((e) => {
			console.error(e);
			result = null;
		});
	return result;
};
