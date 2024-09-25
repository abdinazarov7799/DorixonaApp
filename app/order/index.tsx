import React from 'react';
import {View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {router, useLocalSearchParams} from "expo-router";
import {Text} from "native-base";
import {useTranslation} from "react-i18next";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {ENDPOINTS, KEYS} from "@/constants";
import Loader from "@/components/shared/Loader";

const OrderView = () => {
    const {id} = useLocalSearchParams();
    const {t} = useTranslation();
    const {data,isLoading} = useFetchRequest({
        queryKey: `${KEYS.getOrder}_${id}`,
        endpoint: `${ENDPOINTS.getOrder}/${id}`,
        enabled: !!id
    })
    console.log(data,'data')
    if (isLoading) return <Loader />

    return (
        <View className="flex-1 bg-[#F5F6F7] relative pt-[60px]">
            <View className="absolute top-0 bg-white w-[100vw] p-[17px] px-[20px] flex-row justify-between border-b border-[#919DA63D]">
                <Ionicons
                    name="close"
                    size={24}
                    color="#215ca0"
                    onPress={() => router.back()}
                />
            </View>
            <View className={"px-[16px] py-[12px] bg-white"}>
                <Text className={'text-center font-bold text-[22px]'}>
                    {t("Buyurtma")} {`#${id}`}
                </Text>
                <Text className={'text-center text-[15px] mt-[4px]'}>
                    {}
                </Text>
            </View>
        </View>
    );
};

export default OrderView;