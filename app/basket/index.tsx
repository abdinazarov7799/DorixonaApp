import React, {useEffect, useState} from 'react';
import {View, Text, RefreshControl, Image, ActivityIndicator, FlatList, ScrollView} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import {router} from "expo-router";
import {get, isEmpty, isEqual, isNil} from "lodash";
import {Button, Center, Input} from "native-base";
import useStore from "@/store";

const Index = () => {
    const { t } = useTranslation();
    const [fullPrice, setFullPrice] = useState(0);
    const {orders,increment,decrement,addToOrder,setOrders} = useStore();

    useEffect(() => {
        let price = 0
        orders?.map((order) => {
            price += (get(order,'count') * get(order,'price'))
        })
        setFullPrice(price)
    }, [orders]);

    const getCountForItem = (itemId) => {
        const order = orders.find((order) => order?.id === itemId);
        return order ? order.count : 0;
    };

    return (
        <View className="flex-1 bg-white relative pt-[60px] pb-[110px] px-4">
            <View className="absolute top-0 w-[100vw] py-[17px] px-[20px] flex-row justify-between border-b border-[#919DA63D]">
                <View className="flex-row items-center">
                    <AntDesign name="close" size={24} color="black" onPress={() => router.push("/")} />
                    <Text className={"ml-[16px] font-medium text-[18px]"}>{t("Mahsulotlar roʻyxati")}</Text>
                </View>
                <AntDesign name="delete" size={24} color="black" onPress={() => setOrders([])} />
            </View>
            <ScrollView className={"divide-y divide-[#919DA63D]"}>
                {
                    orders && (
                        orders?.map(item => {
                            return (
                                <View className="p-2 flex-row justify-between items-center space-x-2" key={item?.id}>
                                    <Image
                                        source={item?.imageUrl ? { uri: item?.imageUrl } : require("@/assets/images/no-photo.png")}
                                        style={{ width: 60, height: 60, resizeMode: 'cover' }}
                                    />
                                    <View className={"w-[45%]"}>
                                        <Text
                                            className="mt-1 text-[13px] p-1"
                                        >
                                            {item?.name}
                                        </Text>
                                        <Text className="mt-1 p-1 mb-3 text-black text-[13px] font-medium">{item?.price} so'm</Text>
                                    </View>
                                    <View className={"flex-row justify-between items-center space-x-1"}>
                                        <Button className="bg-gray-100 rounded-[10px]" shadow={"1"} onPress={() => decrement(get(item,'id'))}>
                                            <AntDesign name="minus" size={12} color="black" />
                                        </Button>
                                        <Input
                                            variant={"unstyled"}
                                            value={String(getCountForItem(get(item, 'id')))}
                                            onChangeText={(count) => addToOrder({...item,count})}
                                            type={"number"}
                                            keyboardType={"number-pad"}
                                            w={50}
                                            h={9}
                                            textAlign={"center"}
                                            className="rounded-[10px] border border-gray-200"
                                        />
                                        <Button className="bg-gray-100 rounded-[10px]" shadow={"1"} onPress={() => increment(item)}>
                                            <AntDesign name="plus" size={12} color="black" />
                                        </Button>
                                    </View>
                                </View>
                            )
                        })
                    )
                }
            </ScrollView>
            <View className={"absolute bottom-0 z-10 w-[100vw] h-[114px] p-[12px] bg-white border-t border-[#919DA63D]"}>
                <View className={"flex-row justify-between items-center mb-[16px]"}>
                    <Text className={"text-[16px] text-[#656E78]"}>
                        {t("Umumiy narxi")}
                    </Text>
                    <Text className={"font-bold text-[18px]"}>
                        {Intl.NumberFormat('en-US').format(fullPrice)} {t("so'm")}
                    </Text>
                </View>
                <Button className={"bg-blue-500 w-full h-[44px] rounded-lg"} disabled={isNil(orders)} onPress={() => router.push('/basket')}>
                    <Text className={"text-white font-medium text-[16px]"}>
                        {t("Dorixonani belgilash")}
                    </Text>
                </Button>
            </View>
        </View>
    );
};

export default Index;