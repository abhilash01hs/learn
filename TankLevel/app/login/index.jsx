import { Alert, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../util/firebaseutil";
import {
	Button,
	MD2Colors,
	Snackbar,
	Text,
	TextInput,
} from "react-native-paper";
import { createStyles } from "./style";
import { markUserStatus } from "../../firebase/database";
import { initializeMessaging } from "../../util/notificationutil";
import messaging from "@react-native-firebase/messaging";
import { setUserWithToken } from "../../util/userdatautil";

const Login = () => {
	const styles = createStyles({ MD2Colors: MD2Colors });
	const router = useRouter();
	const auth = firebaseAuth();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [revealPass, setRevealPass] = useState(false);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [fcmToken, setFcmToken] = useState(null);

	const generateEmail = () => {
		if (name) {
			return name.replaceAll(" ", ".") + "@neodyt.com";
		}
	};

	const fetchToken = async (userId) => {
		try {
			const token = await initializeMessaging();
			setFcmToken(token);
			console.log("fcmToken: ", token);
			console.log("userId: ", userId);
			await setUserWithToken(userId, token, true);
		} catch (error) {
			console.error("Error fetching token:", error);
		}
	};

	// useEffect(() => {
	// 	console.log("IN");
	// 	const unsubscribe = messaging().onMessage(async (remoteMessage) => {
	// 		if (auth.currentUser) {
	// 			console.log(
	// 				"JSON.stringify(remoteMessage): ",
	// 				JSON.stringify(remoteMessage)
	// 			);
	// 			// setSnackbarVisible(true);
	// 			// setSnackbarMessage(remoteMessage);
	// 			Alert.alert(remoteMessage);
	// 		}
	// 	});
	// 	console.log("effect");
	// 	return unsubscribe;
	// }, [auth.currentUser]);

	const handleLogin = () => {
		setLoading(true);
		const email = generateEmail();
		signInWithEmailAndPassword(auth, email, password)
			.then(async (data) => {
				markUserStatus(data?.user?.uid, "active");
				await fetchToken(data?.user?.uid);
				setLoading(false);
				router.push("/home");
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
				setSnackbarVisible(true);
				setSnackbarMessage(error.message);
			});
	};

	const handleSignUp = () => {
		router.push("/signup");
	};

	const snackbarOnClose = () => {
		setSnackbarVisible(false);
	};

	const handleRevealPress = () => {
		setRevealPass((prev) => !prev);
	};

	return (
		<View>
			<Button
				mode="contained"
				dark
				onPress={handleSignUp}
				textColor={MD2Colors.black}
				icon={"lead-pencil"}
				buttonColor="#F39F5A"
				style={styles.signup}
			>
				Sign Up
			</Button>

			<View style={styles.loginContainer}>
				<View style={styles.titleContainer}>
					<Text variant="titleLarge" style={styles.title}>
						Log In
					</Text>
				</View>
				<TextInput
					placeholder="Enter your Username"
					label="Username"
					value={name}
					onChangeText={setName}
					style={styles.textInput}
					activeUnderlineColor={MD2Colors.white}
					textColor={MD2Colors.white}
				/>
				<TextInput
					placeholder="Enter your Password"
					label="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry={!revealPass}
					right={
						<TextInput.Icon
							icon={revealPass ? "eye-off" : "eye"}
							onPress={handleRevealPress}
						/>
					}
					style={styles.textInput}
					activeUnderlineColor={MD2Colors.white}
					textColor={MD2Colors.white}
				/>
				<Button
					mode="contained"
					dark
					onPress={handleLogin}
					textColor={MD2Colors.black}
					icon={"login"}
					buttonColor="#78A083"
					loading={loading}
					disabled={!name || !password}
				>
					Login
				</Button>
			</View>
			<Snackbar
				visible={snackbarVisible}
				duration={2000}
				onDismiss={snackbarOnClose}
			>
				{snackbarMessage}
			</Snackbar>
		</View>
	);
};

export default Login;
