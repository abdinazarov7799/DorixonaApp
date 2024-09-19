import React from "react";
import {Slot} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

const NotificationLayout = () => {
	return (
		<SafeAreaView className={"flex-1"}>
			<Slot />
		</SafeAreaView>
	);
};

export default NotificationLayout;
