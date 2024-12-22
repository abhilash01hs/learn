import { StyleSheet } from "react-native";

export const createStyles = (props) =>
	StyleSheet.create({
		titleContainer: {
			alignItems: "center",
			justifyContent: "center",
			marginTop: "10%",
			marginBottom: "10%",
			height: "15%",
		},
		title: {
			color: "#DFF2EB",
		},
		loginContainer: { marginTop: "35%" },
		textInput: {
			backgroundColor: props.MD2Colors.black,
			marginBottom: "5%",
		},
		signup: {
			position: "absolute",
			marginTop: "15%",
			marginRight: "3%",
			right: 0,
		},
	});
