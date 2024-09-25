import {Center} from "native-base";
import {useTranslation} from "react-i18next";
import {ActivityIndicator, FlatList, RefreshControl, Text, View, Image, TouchableOpacity} from "react-native";
import Loader from "@/components/shared/Loader";
import React, {useState} from "react";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {ENDPOINTS, KEYS} from "@/constants";
import {get} from "lodash";
import dayjs from "dayjs";
import {router} from "expo-router";

export default function TabOrdersScreen() {
    const { t } = useTranslation();
    const [search, setSearch] = useState(null);
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage, isLoading } = useInfiniteScroll({
        key: KEYS.order_get_mine,
        url: ENDPOINTS.order_get_mine,
        limit: 15,
        filters: {
            search
        }
    });

    const formatDate = (timestamp) => {
        return dayjs(timestamp).format("HH:mm");
    };

    const renderProductCard = ({ item }) => {
        const status = get(item, 'status');
        const products = get(item, 'products', []);

        return (
            <TouchableOpacity className="bg-gray-100 p-[16px] rounded-[12px] mb-4" onPress={() => router.push(`/order/${get(item,'id')}`)}>
                <View className={"flex-row justify-between mb-4"}>
                    <View>
                        <Text className="text-[16px] font-medium mb-1">
                            {t("Buyurtma") + "#" + get(item, 'id')}
                        </Text>
                        <Text className="text-[13px] text-[#919DA6]">
                            {formatDate(get(item, 'createdTime'))} &middot; {get(item, 'pharmacy')}
                        </Text>
                    </View>
                    <View
                        className={`rounded-full py-1 px-2 h-[24px]`} style={{backgroundColor: `${status === "SENT" ? "#248BF2" : status === "CONFIRMED" ? "#00B268" : status === "REJECTED" ? "#E04917" : "#919DA6"}`}}>
                        <Text className="text-white text-[11px] font-medium">
                            {status === "SENT" ? t("Yuborildi") : status === "CONFIRMED" ? t("Tasdiqlandi") : status === "REJECTED" ? t("Bekor qilindi") : t("Holat noaniq")}
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center space-x-2 mb-4">
                    {products?.slice(0, 4).map((product, index) => (
                        <Image key={index} source={{ uri: product?.imageUrl }} className="w-[40px] h-[40px] rounded-md" />
                    ))}
                    {products?.length > 4 && (
                        <View className="w-[40px] h-[40px] rounded-md bg-gray-300 flex items-center justify-center">
                            <Text className="text-gray-600">+{products?.length - 4}</Text>
                        </View>
                    )}
                </View>
                <View className={"flex-row justify-between"}>
                    <Text className={"text-[#919DA6] text-[15px]"}>{t("Umumiy summasi")}</Text>
                    <Text className={"text-[15px] font-medium"}>{get(item, 'totalPrice')} so'm</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className={'px-4 pt-5 bg-white flex-1'}>
            {
                isLoading ? <Loader /> : (
                    <>
                        <FlatList
                            onEndReached={onEndReached}
                            data={data}
                            initialNumToRender={10}
                            removeClippedSubviews={true}
                            keyExtractor={(item) => item?.id.toString()}
                            renderItem={renderProductCard}
                            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
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
                                    {isFetchingNextPage && <ActivityIndicator />}
                                </View>
                            }
                        />
                    </>
                )
            }
        </View>
    );
}
