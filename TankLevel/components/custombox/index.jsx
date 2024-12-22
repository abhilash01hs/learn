import React from "react";
import { Icon, MD2Colors, Surface, Text } from "react-native-paper";
import { createStyles } from "./style";

const CustomBox = (props) => {
	const { active, title, iconId, style, iconSize } = props;
	const styles = createStyles(props);

	return (
		<Surface style={{ ...styles.surface, ...style }} elevation={5}>
			<Icon
				source={iconId}
				color={active ? MD2Colors.green600 : MD2Colors.red600}
				size={iconSize}
			/>
			<Text variant="bodyMedium" style={{ color: "white" }}>
				{title}
			</Text>
		</Surface>
	);
};

export default CustomBox;
