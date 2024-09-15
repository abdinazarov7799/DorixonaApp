import React from 'react';
import {Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

const Company = () => {
    const {t} = useTranslation();
    return (
        <View className="flex-1 bg-white relative p-[16px]">
            <Ionicons name="arrow-back" size={24} color="#215ca0" />
            <View className={"mt-[12px]"}>
                <Text className={"font-bold text-[24px] mb-[4px]"}>{t("Dorixonani haqida")}</Text>
                <Text className={"font-normal text-[15px] text-[#656E78]"}>{t("Dorixonaga tegishli boʻlgan maʻlumotlar bilan maydonlarni toʻldiring")}</Text>
            </View>
        </View>
    );
};

export default Company;