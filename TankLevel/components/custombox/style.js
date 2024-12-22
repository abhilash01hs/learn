import { StyleSheet } from "react-native";

export const createStyles = (props) =>
	StyleSheet.create({
		surface: {
			height: 100,
			width: 100,
			textAlignVertical: "center",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#0C0C0C",
		},
	});
