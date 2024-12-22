import {
	getDatabase,
	ref,
	onValue,
	set,
	update,
	get,
	child,
} from "firebase/database";
import { firebaseInstance } from "../util/firebaseutil";
import { DataPaths } from "../constants/DataConstants";

export const dataFetch = (setValue, path) => {
	const app = firebaseInstance();
	const db = getDatabase(app);
	const userRef = ref(db, path);
	onValue(
		userRef,
		(snapshot) => {
			setValue(snapshot.val());
			console.log("Path: " + path + ": ", snapshot.val());
		},
		(error) => {
			setValue({});
			console.error("Error reading data: ", error);
		}
	);
};

export const dataWrite = async (data, path) => {
	const app = firebaseInstance();
	const db = getDatabase(app);
	const dbRef = ref(db, path); // Replace with data path
	await set(dbRef, data)
		.then(() => {
			console.log("Data set.");
		})
		.catch((error) => {
			console.error("Error setting data: ", error);
		});
};

export const getData = async (path) => {
	const app = firebaseInstance();
	const db = getDatabase(app);
	const dbRef = ref(db, path);
	return get(dbRef)
		.then((data) => {
			if (data.exists()) {
				console.log("Get Data returned");
				return data;
			}
			return null;
		})
		.catch((error) => {
			console.error("Error getting data: ", error);
			return null;
		});
};

export const markUserStatus = async (userId, status) => {
	const app = firebaseInstance();
	const db = getDatabase(app);
	const userStatusRef = ref(db, `${DataPaths.USER_DETAILS}${userId}`);
	const statusUpdate = {
		status: status,
		lastActive: new Date().toISOString(),
	};
	await update(userStatusRef, statusUpdate);
	status === "active"
		? await markUserActive(userId)
		: await markUserInActive(userId);
};

export const markUserInActive = async (userId) => {
	const path = DataPaths.ACTIVE_USER;
	getData(path).then((activeUsers) => {
		if (activeUsers) {
			const values = Object.values(activeUsers.val());
			const data = values?.filter((f) => f !== userId);
			if (data) {
				dataWrite(data, path);
			} else {
				dataWrite(null, path);
			}
		}
	});
};

export const markUserActive = async (userId) => {
	const path = DataPaths.ACTIVE_USER;
	getData(path).then((activeUsers) => {
		let data = [];
		if (activeUsers) {
			const values = Object.values(activeUsers.val());
			const filtered = values?.filter((f) => f !== userId);
			data = [...filtered, userId];
		} else {
			data = [userId];
		}
		dataWrite(data, path);
	});
};
