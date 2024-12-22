import { StyleSheet } from "react-native";

export const createStyles = (props) =>
	StyleSheet.create({
		pressable: {
			marginLeft: "5%",
			marginTop: "5%",
			alignItems: "center",
			justifyContent: "center",
			paddingVertical: 12,
			borderRadius: 4,
			elevation: 3,
			backgroundColor: props.disabled ? "#B0A4A4" : props.color,
			width: "40%",
			marginRight: "5%",
		},
		pressableLabel: {
			fontSize: 16,
			lineHeight: 21,
			fontWeight: "bold",
			letterSpacing: 0.25,
			color: props.disabled ? "#F3F6F9" : "white",
		},
	});
