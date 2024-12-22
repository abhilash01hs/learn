import { StyleSheet } from "react-native";

export const createStyles = (props) =>
	StyleSheet.create({
		titleFrame: {
			marginTop: "12%",
			backgroundColor: "#0C0C0C",
			width: "100%",
			alignItems: "center",
			justifyContent: "center",
			height: 50,
		},
		pageTitle: {
			marginTop: "2%",
			fontSize: 18,
			fontWeight: "bold",
			color: "#ffffff",
		},
		signout: {
			width: "30%",
			position: "absolute",
			right: 0,
			marginTop: "1%",
			marginRight: "1%",
		},
	});
