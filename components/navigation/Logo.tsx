import React from 'react';
import {Image, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";

const Logo = () => {
    return (
        <TouchableOpacity onPress={() => router.push(`/incoming`)}>
            <View style={{width: 10, height: 1, marginLeft: 10, marginBottom: 25}}>
            </View>
        </TouchableOpacity>
    );
};

export default Logo;