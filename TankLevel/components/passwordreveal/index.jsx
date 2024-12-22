import { View, Text } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";

const PasswordRevealer = (props) => {
	const handlePress = () => {
		props.set(!props.value);
	};
	return (
		<TextInput.Icon
			icon={props.value ? "eye-off" : "eye"}
			onPress={handlePress}
		/>
	);
};

export default PasswordRevealer;
