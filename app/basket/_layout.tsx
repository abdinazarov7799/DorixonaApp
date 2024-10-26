import React from 'react';
import {Slot} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

const BasketLayout = () => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <Slot/>
        </SafeAreaView>
    );
};

export default BasketLayout;