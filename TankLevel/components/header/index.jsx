import { View, Text } from "react-native";
import React, { useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { Button, MD2Colors, Snackbar } from "react-native-paper";
import CustomBox from "../custombox";
import { createStyles } from "./style";
import { signOut } from "firebase/auth";
import { markUserStatus } from "../../firebase/database";
import { setUserWithToken } from "../../util/userdatautil";
import { getToken } from "../../util/notificationutil";

const Header = (props) => {
	const { auth, email, userDetails } = props;
	const styles = createStyles(props);
	const router = useRouter();
	const routePath = usePathname();
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const isLoggedIn = () => {
		return routePath === "/home";
	};

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			console.log("dad");
			await markUserStatus(userDetails?.uid, "inActive");
			const token = await getToken();
			await setUserWithToken(userDetails?.uid, token, false);
			setSnackbarVisible(true);
			setSnackbarMessage("You have been signed out.");
			router.replace("/login");
		} catch (error) {
			setSnackbarVisible(true);
			setSnackbarMessage("Sign out error:  " + error.message);
			console.error("Sign out error: ", error);
		}
	};

	const getUserName = () => {
		if (email) {
			const value = email.split("@")[0].replaceAll(".", " ");
			return value
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		}
	};

	const snackbarOnClose = () => {
		setSnackbarVisible(false);
	};

	return (
		<>
			<View style={styles.titleFrame}>
				<Text style={styles.pageTitle}>TankLevel</Text>
			</View>
			<View
				style={{
					height: "5%",
					display: !isLoggedIn() ? "none" : "flex",
				}}
			>
				<CustomBox
					iconId={"account-circle"}
					title={getUserName()}
					active={true}
					style={{
						height: "80%",
						marginTop: "1%",
						flexDirection: "row",
						gap: 5,
						width: "30%",
						display: !userDetails ? "none" : "flex",
					}}
					iconSize={20}
				/>
				<Button
					mode="contained"
					dark
					onPress={handleSignOut}
					textColor={MD2Colors.black}
					icon={"lead-pencil"}
					buttonColor="#F39F5A"
					style={styles.signout}
				>
					Sign out
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

export default Header;
