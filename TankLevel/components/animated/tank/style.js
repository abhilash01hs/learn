import { StyleSheet } from "react-native";

export const createStyles = (props) =>
	StyleSheet.create({
		tank: {
			marginTop: "20%",
			marginLeft: "35%",
			width: "30%",
			height: 200,
			borderColor: "black",
			borderWidth: 2,
			borderRadius: 10,
			overflow: "hidden",
			justifyContent: "flex-end",
			backgroundColor: "#818FB4",
		},
		fill: {
			width: "100%",
		},
	});
