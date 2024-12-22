import { useEffect, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../util/firebaseutil";
import { Slot, useRouter } from "expo-router";
import Header from "../components/header";
import { markUserStatus } from "../firebase/database";
import { StoreProvider } from "../store/store";
import messaging from "@react-native-firebase/messaging";
import { Button, Dialog, Text } from "react-native-paper";

export default function RootLayout() {
	const auth = firebaseAuth();
	const router = useRouter();
	const [userDetails, setUserDetails] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(true);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (!currentUser) {
				router.replace("/login");
			} else {
				setUserDetails(currentUser);
				setEmail(currentUser.email);
				setLoading(false);
			}
		});
		return unsubscribe;
	}, []);

	const handleAppStateChange = async (nextAppState) => {
		if (userDetails) {
			if (nextAppState === "background" || nextAppState === "inactive") {
				markUserStatus(userDetails?.uid, "inActive");
			} else if (nextAppState === "active") {
				markUserStatus(userDetails?.uid, "active");
			}
		}
	};
	useEffect(() => {
		console.log("IN");
		// if (auth.currentUser) {
		messaging().setBackgroundMessageHandler(async (remoteMessage) => {});
		// }
		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
			if (auth.currentUser) {
				console.log(
					"JSON.stringify(remoteMessage): ",
					JSON.stringify(remoteMessage)
				);
				setDialogVisible(true);
				setDialogMessage(remoteMessage?.notification?.body);
				
			}
		});
		return unsubscribe;
	}, [auth.currentUser]);

	useEffect(() => {
		const sub = AppState.addEventListener("change", handleAppStateChange);
		return () => {
			sub.remove();
		};
	}, [userDetails]);

	const dialogOnClose = () => {
		setDialogVisible(false);
	};

	return (
		<View style={styles.container}>
			<StoreProvider>
				<Header auth={auth} email={email} userDetails={userDetails} />
				<Slot />
				<Dialog visible={dialogVisible} onDismiss={dialogOnClose}>
					<Dialog.Content>
						<Text variant="bodyMedium">{dialogMessage}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={dialogOnClose}>OK</Button>
					</Dialog.Actions>
				</Dialog>
			</StoreProvider>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#1E201E",
		display: "flex",
		height: "100%",
	},
});
