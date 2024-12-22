// import { getApp } from "@react-native-firebase/app";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import firebase from "@react-native-firebase/app";

const firebaseName = "firebaseapp";

const firebaseConfig = {
	apiKey: "AIzaSyDENhwfRWfODX6gN4ntxzBy5eMA4lEdmhA",
	authDomain: "TankLevel.firebaseapp.com",
	databaseURL:
		"https://tanklevel-a7581-default-rtdb.asia-southeast1.firebasedatabase.app/",
	projectId: "tanklevel-a7581",
	storageBucket: "tanklevel-a7581.firebasestorage.app",
	messagingSenderId: "342868723234",
	appId: "1:342868723234:android:94c76f0e7947868434ac7b",
};

export const firebaseInstance = () => {
	try {
		return getApp(firebaseName);
	} catch (e) {
		return initializeApp(firebaseConfig, firebaseName);
	}
};

// export const reactFirebaseInstance = async () => {
// 	try {
// 		console.log("try");

// 		return firebase.app("foo");
// 	} catch (e) {
// 		console.log("catch");
// 		return await firebase.initializeApp(firebaseConfig, "foo");
// 	}
// };

export const firebaseAuth = () => {
	// const auth = getAuth(firebaseInstance());
	// auth.setPersistence(getReactNativePersistence(ReactNativeAsyncStorage));
	// return auth;
	// let auth;
	const app = firebaseInstance();
	// if (getAuth(app)._isInitialized) {
	const auth = getAuth(app);
	auth.setPersistence(getReactNativePersistence(AsyncStorage));
	// } else {
	// 	auth = initializeAuth(app, {
	// 		persistence: getReactNativePersistence(AsyncStorage),
	// 	});
	// }
	return auth;
	// return getAuth(firebaseInstance());
};
