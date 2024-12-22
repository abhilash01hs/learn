import { Pressable, Text } from "react-native";
import { createStyles } from "./style";

const CustomButton = ({ ...props }) => {
	const { key, disabled, title, handlePress } = props;
	const styles = createStyles(props);

	return (
		<Pressable
			key={key}
			style={styles.pressable}
			disabled={disabled}
			onPress={handlePress}
		>
			<Text style={styles.pressableLabel}>{title}</Text>
		</Pressable>
	);
};
export default CustomButton;
