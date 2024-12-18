import React from "react";
import {Slot} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

const CardsLayout = () => {
	return (
		<SafeAreaView style={{flex: 1}}>
			<Slot />
		</SafeAreaView>
	);
};

export default CardsLayout;
