import { View } from "react-native";
import React, { useState } from "react";
import {
	Button,
	MD2Colors,
	Snackbar,
	Text,
	TextInput,
} from "react-native-paper";
import { createStyles } from "./style";
import { useRouter } from "expo-router";
import { firebaseAuth, firebaseInstance } from "../../util/firebaseutil";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { DataPaths } from "../../constants/DataConstants";

const signup = () => {
	const styles = createStyles({ MD2Colors: MD2Colors });
	const router = useRouter();
	const auth = firebaseAuth();

	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [revealPass, setRevealPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const handleRevealPress = () => {
		setRevealPass((prev) => !prev);
	};

	const generateEmail = () => {
		if (name) {
			return name.replaceAll(" ", ".") + "@neodyt.com";
		}
	};

	const handleSignUp = () => {
		const app = firebaseInstance();
		const db = getDatabase(app);
		const email = generateEmail();
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const uid = userCredential.user.uid;
				set(ref(db, DataPaths.USERS + uid))
					.then(() => {
						setSnackbarVisible(true);
						setSnackbarMessage("User registered successfully!");
						router.replace("/login");
					})
					.catch((error) => {
						console.error("set error: ", error);
						setSnackbarVisible(true);
						setSnackbarMessage(error.message);
					});
			})
			.catch((error) => {
				console.error("set error: ", error);
				setSnackbarVisible(true);
				setSnackbarMessage("Sign Up Error: " + error.message);
			});
	};

	const snackbarOnClose = () => {
		setSnackbarVisible(false);
	};

	return (
		<>
			<View style={styles.loginContainer}>
				<View style={styles.titleContainer}>
					<Text variant="titleLarge" style={styles.title}>
						Sign Up
					</Text>
				</View>
				<TextInput
					placeholder="Enter new Username"
					label="Username"
					value={name}
					onChangeText={setName}
					style={styles.textInput}
					activeUnderlineColor={MD2Colors.white}
					textColor={MD2Colors.white}
				/>
				<TextInput
					placeholder="Enter new Password"
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
					onPress={handleSignUp}
					textColor={MD2Colors.black}
					icon={"lead-pencil"}
					buttonColor="#78A083"
					loading={loading}
					disabled={!name || !password}
				>
					Create User
				</Button>
			</View>
			<Snackbar
				visible={snackbarVisible}
				duration={2000}
				onDismiss={snackbarOnClose}
			>
				{snackbarMessage}
			</Snackbar>
		</>
	);
};

export default signup;
