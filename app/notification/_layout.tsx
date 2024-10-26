import React from "react";
import {Slot} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

const NotificationLayout = () => {
	return (
		<SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
			<Slot />
		</SafeAreaView>
	);
};

export default NotificationLayout;
