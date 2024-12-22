import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../../components/custombutton";
import { dataFetch, dataWrite } from "../../firebase/database";
import AnimatedTank from "../../components/animated/tank";
import { MD2Colors } from "react-native-paper";
import AnimatedLoader from "../../components/animated/loader";
import CustomBox from "../../components/custombox";
import { DataPaths } from "../../constants/DataConstants";
import { useStore } from "../../store/store";

const Home = () => {
	const [dbValue, setDbValue] = useState("");
	const [tankSensorValue, setTankSensorValue] = useState({});
	const [relaySensorValue, setRelaySensorValue] = useState({});
	const [tankSensorReady, setTankSensorReady] = useState(false);
	const [relaySensorReady, setRelaySensorReady] = useState(false);
	const [tankLevel, setTankLevel] = useState(0);
	const [motorRunning, setMotorRunning] = useState(false);

	const checkSensor = (sensor) => {
		const {powerStatus, wifiStatus} = {...sensor};
		return powerStatus && wifiStatus;
	}

	const updateTankSensor = (data) => {
		setTankSensorValue(data);
		const tSensorStatus = checkSensor(data);
		setTankSensorReady(tSensorStatus);
	}

	const updateRelaySensor = (data) => {
		setRelaySensorValue(data);
		const rSensorStatus = checkSensor(data);
		setRelaySensorReady(rSensorStatus);
	}

	const calculateWaterLevel = (level) => {
		const tankHeight = 85;
		const waterFullHeight = 65;
		const adjusted = tankHeight - level;
		const value = (adjusted / waterFullHeight) * 100;
		return Math.round(value);
	}

	useEffect(() => {
		if (dbValue) {
			const { waterLevel, motorRunning } = dbValue;
			setTankLevel(calculateWaterLevel(waterLevel));
			setMotorRunning(motorRunning);
		} else {
			dataFetch(setDbValue, DataPaths.DATA);
			dataFetch(updateTankSensor, DataPaths.TANK_SENSOR);
			dataFetch(updateRelaySensor, DataPaths.RELAY_SENSOR);
		}
	}, [dbValue]);

	const handleStartMotor = async (e) => {
		await dataWrite({ ...dbValue, motorRunning: true }, DataPaths.DATA);
		console.log("Start Motor");
	};

	const handleStopMotor = async (e) => {
		await dataWrite({ ...dbValue, motorRunning: false }, DataPaths.DATA);
		console.log("Stop Motor");
	};

	return (
		<View>
			<AnimatedLoader
				title={"Motor Running"}
				loading={motorRunning}
				loaderColor={MD2Colors.green200}
				textColor={MD2Colors.green200}
				size={25}
			/>
			<AnimatedTank tankLevel={tankLevel} />
			<View style={styles.labelFrame}>
				<Text style={styles.label}>{tankLevel}%</Text>
			</View>
			<View style={styles.pressableFrame}>
				<CustomButton
					title={"START MOTOR"}
					key={"button-start"}
					disabled={motorRunning || !relaySensorReady || !tankSensorReady}
					handlePress={handleStartMotor}
					color="#005B41"
				/>
				<CustomButton
					title={"STOP MOTOR"}
					key={"button-stop"}
					disabled={!motorRunning || !relaySensorReady || !tankSensorReady}
					handlePress={handleStopMotor}
					color="#C63C51"
				/>
			</View>
			<View style={styles.iconFrame}>
				<CustomBox
					title={"Tank Sensor: Power"}
					active={tankSensorValue?.powerStatus ?? false}
					iconId={"lightning-bolt-outline"}
					iconSize={30}
				/>
				<CustomBox
					title={"Tank Sensor: Wifi"}
					active={tankSensorValue?.wifiStatus ?? false}
					iconId={"wifi"}
					iconSize={30}
				/>
				<CustomBox
					title={"Tank Sensor: Ready"}
					active={tankSensorReady}
					iconId={"lightbulb-variant"}
					iconSize={30}
				/>
				<CustomBox
					title={"Relay Sensor: Power"}
					active={relaySensorValue?.powerStatus ?? false}
					iconId={"lightning-bolt-outline"}
					iconSize={30}
				/>
				<CustomBox
					title={"Relay Sensor: Wifi"}
					active={relaySensorValue?.wifiStatus ?? false}
					iconId={"wifi"}
					iconSize={30}
				/>
				<CustomBox
					title={"Relay Sensor: Ready"}
					active={relaySensorReady}
					iconId={"lightbulb-variant"}
					iconSize={30}
				/>
			</View>
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#1E201E",
		display: "flex",
		height: "100%",
	},
	labelFrame: {
		width: "100%",
		marginTop: 10,
		alignItems: "center",
		height: "fill-content",
	},
	label: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#ffffff",
	},
	titleFrame: {
		marginTop: "12%",
		backgroundColor: "#0C0C0C",
		width: "100%",
		alignItems: "center",
		height: "5%",
	},
	pageTitle: {
		marginTop: "2%",
		fontSize: 18,
		fontWeight: "bold",
		color: "#ffffff",
	},
	pressableFrame: {
		flexDirection: "row",
		justifyContent: "space-between",
		height: "10%",
	},
	iconFrame: {
		marginTop: "5%",
		alignItems: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: 20,
		gap: 35,
		justifyContent: "flex-start",
		marginLeft: "5%",
		marginRight: "5%",
	},
	surface: {
		height: 100,
		width: 100,
		textAlignVertical: "center",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#0C0C0C",
	},
});
