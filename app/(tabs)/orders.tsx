import {Center} from "native-base";
import {useTranslation} from "react-i18next";
import {ActivityIndicator, FlatList, RefreshControl, Text, View} from "react-native";
import Loader from "@/components/shared/Loader";
import React, {useState} from "react";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {ENDPOINTS, KEYS} from "@/constants";
import {get} from "lodash";

export default function TabOrdersScreen() {
    const { t } = useTranslation();
    const [search, setSearch] = useState(null);
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage,isLoading } = useInfiniteScroll({
        key: KEYS.order_get_mine,
        url: ENDPOINTS.order_get_mine,
        limit: 15,
        filters: {
            search
        }
    });
    const data1 = [
        {
            status: "Yuborildi",
            id: "89217315",
            totalPrice: "14 820 000",
            pharmacy: "ФЕРУЗ ФАРМ-СЕРВИС ООО",
            phoneNumber: "+998 90 000 00 00",
            createdTime: "19:36",
            acceptedTime: "17 августа, 19:24"
        },
        {
            status: "Tasdiqlandi",
            id: "37283193",
            totalPrice: "14 820 000",
            pharmacy: "Akmal Pharm",
            phoneNumber: "+998 90 000 00 00",
            createdTime: "19:36",
            acceptedTime: "17 августа, 19:24"
        },
        {
            status: "Bekor qilindi",
            id: "89217315",
            totalPrice: "14 820 000",
            pharmacy: "ФЕРУЗ ФАРМ-СЕРВИС ООО",
            phoneNumber: "+998 90 000 00 00",
            createdTime: "19:36",
            acceptedTime: "17 августа, 19:24"
        },
    ]
    const renderProductCard = ({ item }) => {
        let statusColor = ''
        switch (get(item,'status')) {
            case "Yuborildi": statusColor = '#248BF2'; break;
            case "Tasdiqlandi": statusColor = '#00B268'; break;
            case "Bekor qilindi": statusColor = '#E04917'; break;
        }
        return (
            <View className="bg-gray-100 p-[16px] rounded-[12px] mb-4 ">
                <View className={"flex-row justify-between mb-4"}>
                    <View>
                        <Text className="text-[16px] font-medium mb-1">
                            {t("Buyurtma") + "#" + get(item,'id')}
                        </Text>
                        <Text className="text-[13px] text-[#919DA6]">
                            {get(item,'createdTime')} &middot; {get(item,'pharmacy')}
                        </Text>
                    </View>
                    <View className={`bg-[${statusColor}] text-white`}>
                        <Text>{get(item, 'status')}</Text>
                    </View>
                </View>
                <View className={"flex-row justify-between"}>
                    <Text className={"text-[#919DA6] text-[15px]"}>{t("Umumiy summasi")}</Text>
                    <Text className={"text-[15px] font-medium"}>{get(item,'totalPrice')}</Text>
                </View>
            </View>
        );
    };

    return (
        <View className={'px-4 pt-5 bg-white flex-1'}>

            {
                isLoading ? <Loader /> : (
                    <>
                        <FlatList
                            onEndReached={onEndReached}
                            data={data1}
                            initialNumToRender={10}
                            removeClippedSubviews={true}
                            keyExtractor={(item) => item?.id}
                            renderItem={renderProductCard}
                            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
                            ListEmptyComponent={
                                <Center className={'p-10 text-xl'}>{t("No data")}</Center>
                            }
                            ListFooterComponent={
                                <View style={{
                                    flexDirection: 'row',
                                    height: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {isFetchingNextPage && <ActivityIndicator/>}
                                </View>
                            }
                        />
                    </>
                )
            }
        </View>
    );
}
