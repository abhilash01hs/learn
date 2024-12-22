import { useEffect } from "react";
import { Animated, View } from "react-native";
import { createStyles } from "./style";

const AnimatedTank = (props) => {
	const { tankLevel } = props;
	const styles = createStyles(props);

	const fillAnimation = new Animated.Value(tankLevel ?? 0);

	useEffect(() => {
		Animated.timing(fillAnimation, {
			toValue: tankLevel,
			duration: 500,
			useNativeDriver: false,
		}).start();
	}, [tankLevel]);

	const fillHeight = fillAnimation.interpolate({
		inputRange: [0, 100],
		outputRange: ["0%", "100%"],
	});

	const getFillColor = (level) => {
		if (level <= 10) return "#FF0000"; // Red
		if (level <= 20) return "#FF7F00"; // Orange
		if (level <= 50) return "#FFFF00"; // Yellow
		if (level <= 70) return "#ADFF2F"; // Light Green
		return "#006400"; // Dark Green
	};

	return (
		<View style={styles.tank}>
			<Animated.View
				style={[
					styles.fill,
					{
						height: fillHeight,
						backgroundColor: getFillColor(tankLevel),
					},
				]}
			/>
		</View>
	);
};

export default AnimatedTank;
