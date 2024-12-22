import { StyleSheet } from "react-native";

export const createStyles = (props) =>
	StyleSheet.create({
		loaderFrame: {
			marginTop: "10%",
			marginLeft: "30%",
			alignItems: "flex-start",
			flexDirection: "row",
			display: props.loading ? "flex" : "none",
			position: "absolute",
		},
		label: {
			fontSize: 18,
			fontWeight: "bold",
			color: "#ffffff",
		},
	});
