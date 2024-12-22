import { DataPaths } from "../constants/DataConstants";
import { dataWrite, getData } from "../firebase/database";

export const setUserWithToken = async (userId, token, login) => {
	try {
		if (userId && token) {
			let deviceIds = await getData(DataPaths.DEVICE_ID);
			
			let payload;
			if (deviceIds) {
				deviceIds = JSON.parse(JSON.stringify(deviceIds));
				console.log("deviceIds: " + deviceIds?.[userId]);
				let data = null;
				if(deviceIds?.[userId]) {
					data = Object.values(deviceIds?.[userId]);
					console.log("data: ", JSON.stringify(data));
					if (login) {
						let filtered = data.filter((f) => f !== token);
						if (filtered) {
							data = [...filtered, token];
						}
					} else {
						console.log("else");
						data = data.filter((f) => f !== token);
					}
				} else {
					data = [token];
				}
				console.log("data after: ", data);
				payload = { ...deviceIds, ...{ [userId]: data } };
			} else {
				payload = { [userId]: [token] };
			}
			await dataWrite(payload, DataPaths.DEVICE_ID);
		}
	} catch (e) {
		console.error("Error occured when saving device token with user");
		console.error(e);
	}
};
