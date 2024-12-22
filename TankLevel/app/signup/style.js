import { StyleSheet } from "react-native";

export const createStyles = (props) =>
	StyleSheet.create({
		titleContainer: {
			alignItems: "center",
			justifyContent: "center",
			marginTop: "10%",
			marginBottom: "10%",
			backgroundColor: "#040D12",
			height: "15%",
		},
		title: {
			color: "#E19898",
		},
		loginContainer: { marginTop: "35%" },
		textInput: {
			backgroundColor: props.MD2Colors.black,
			marginBottom: "5%",
		},
	});
