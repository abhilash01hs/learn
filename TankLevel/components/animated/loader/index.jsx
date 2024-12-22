import { Text, View } from "react-native";
import React from "react";
import { createStyles } from "./style";
import { ActivityIndicator } from "react-native-paper";

const AnimatedLoader = (props) => {
	const { title, loading, loaderColor, textColor, size } = props;
	const styles = createStyles(props);

	return (
		<View style={styles.loaderFrame}>
			<ActivityIndicator
				animating={loading}
				color={loaderColor}
				size={size}
				style={{ marginRight: "5%" }}
			/>
			<Text
				style={{
					...styles.label,
					color: textColor,
				}}
			>
				{title}
			</Text>
		</View>
	);
};

export default AnimatedLoader;
