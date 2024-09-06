import React from 'react';
import { TouchableOpacity} from "react-native";
import {Icon} from "native-base";
import {MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";

const Index = ({url='#'}) => {

    return (
        <>
            <TouchableOpacity onPress={()=>router.push(`${url}`)}>
                <Icon size={10} as={MaterialIcons} name="chevron-left"/>
            </TouchableOpacity>
        </>
    );
};

export default Index;