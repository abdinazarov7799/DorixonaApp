import React from 'react';
import {Image, ScrollView, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {router, useLocalSearchParams} from "expo-router";
import {Text} from "native-base";
import {useTranslation} from "react-i18next";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {ENDPOINTS, KEYS} from "@/constants";
import Loader from "@/components/shared/Loader";
import {get} from "lodash";
import dayjs from "dayjs";

const OrderView = () => {
    const {id} = useLocalSearchParams();
    const {t} = useTranslation();
    const {data,isLoading} = useFetchRequest({
        queryKey: `${KEYS.getOrder}_${id}`,
        endpoint: `${ENDPOINTS.getOrder}/${id}`,
        enabled: !!id
    })
    const {data:products,isLoading:isLoadingProducts} = useFetchRequest({
        queryKey: `${KEYS.get_product}_${id}`,
        endpoint: `${ENDPOINTS.get_product}/${id}`,
        params: {size:100},
        enabled: !!id
    })
    if (isLoading || isLoadingProducts) return <Loader />

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
            <View className={"px-[16px] py-[12px] bg-white space-y-[6px]"}>
                <Text className={'text-center font-ALSSiriusBold text-[22px]'}>
                    {t("Buyurtma")} {`#${id}`}
                </Text>
                <Text className={'text-center text-[15px] mt-[4px] max-w-[80%] mx-auto mb-[16px] font-ALSSiriusRegular'}>
                    {get(data,'pharmacy')}
                </Text>
                <View className={"flex-row justify-between items-center"}>
                    <Text className={"text-[15px] text-[#919DA6] font-ALSSiriusRegular"}>{t("Status")}</Text>
                    <View
                        className={`rounded-full py-[3px] px-[8px]`} style={{backgroundColor: `${get(data,'status') === "SENT" ? "#248BF2" : get(data,'status') === "CONFIRMED" ? "#00B268" : get(data,'status') === "REJECTED" ? "#E04917" : "#919DA6"}`}}>
                        <Text className="text-white text-[11px] font-ALSSiriusMedium">
                            {t(get(data,'status'))}
                        </Text>
                    </View>
                </View>
                <View className={"flex-row justify-between items-center"}>
                    <Text className={"text-[15px] text-[#919DA6] font-ALSSiriusRegular"}>{t("Время отправки")}</Text>
                    <Text className="text-[15px] font-ALSSiriusRegular">
                        {dayjs(get(data,'createdTime'))?.format("DD-MMMM, HH:mm")}
                    </Text>
                </View>
                <View className={"flex-row justify-between items-center"}>
                    <Text className={"text-[15px] text-[#919DA6] font-ALSSiriusRegular"}>{t("Время отправки")}</Text>
                    <Text className="text-[15px] font-ALSSiriusRegular">
                        {get(data,'phoneNumber')}
                    </Text>
                </View>
            </View>
            <View className={"px-[16px] py-[16px] bg-white space-y-[6px] my-[6px]"}>
                <Text className={'text-[20px] font-ALSSiriusBold'}>{t("Список продуктов")}</Text>
                <ScrollView>
                    {
                        get(products,'content',[])?.map(product => {
                            return (
                                <View key={get(product,'id')} className={"flex-row justify-between py-[12px]"}>
                                    <Image
                                        source={get(product,'imageUrl') ? { uri: get(product,'imageUrl') } : require("@/assets/images/no-photo.png")}
                                        style={{ width: 64, height: 64, resizeMode: 'cover' }}
                                    />
                                    <View className={"w-[45%]"}>
                                        <Text
                                            className="text-[13px] font-ALSSiriusRegular"
                                        >
                                            {get(product,'name')}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className={"text-[15px font-ALSSiriusMedium] ml-auto"}>
                                            {get(product,'price')?.toLocaleString("en-US")} {t("so'm")}
                                        </Text>
                                        <Text className={"text-[13px] text-[#919DA6] font-ALSSiriusRegular ml-auto"}>
                                            {get(product,'pricePerProduct')?.toLocaleString("en-US")}
                                            {" x "}{get(product,'quantity')} {t("шт")}
                                        </Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
            <View className={"px-[16px] py-[18px] bg-white space-y-[6px] my-[6px]"}>
                <View className={"flex-row justify-between items-center"}>
                    <Text className={"text-[15px] font-ALSSiriusRegular"}>{t("Общая сумма")}</Text>
                    <Text className="text-[15px] font-ALSSiriusMedium">
                        {get(data,'totalPrice')?.toLocaleString("en-US")} {t("so'm")}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default OrderView;