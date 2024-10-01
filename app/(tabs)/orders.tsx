import {Center} from "native-base";
import {useTranslation} from "react-i18next";
import {ActivityIndicator, FlatList, RefreshControl, Text, View, TouchableOpacity} from "react-native";
import Loader from "@/components/shared/Loader";
import React, {useState, useRef} from "react";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {ENDPOINTS, KEYS} from "@/constants";
import {get} from "lodash";
import dayjs from "dayjs";
import {router} from "expo-router";

export default function TabOrdersScreen() {
    const { t } = useTranslation();
    const [search, setSearch] = useState(null);
    const lastDateRef = useRef(null);
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage, isLoading } = useInfiniteScroll({
        key: KEYS.order_get_mine,
        url: ENDPOINTS.order_get_mine,
        limit: 15,
        filters: {
            search
        }
    });
    console.log(data,'data')
    const formatDateHeader = (timestamp) => {
        return dayjs(timestamp).format("DD-MMMM");
    };

    const renderProductCard = ({ item }) => {
        const status = get(item, 'status');
        const time = get(item, 'createdTime');
        const formattedDate = formatDateHeader(time);

        let showDateHeader = false;

        if (lastDateRef.current !== formattedDate) {
            showDateHeader = true;
            lastDateRef.current = formattedDate;
        }

        return (
            <View>
                {showDateHeader && (
                    <Text className="font-ALSSiriusBold text-[20px] px-[8px] mb-[16px] text-[#919DA6]">
                        {formattedDate}
                    </Text>
                )}

                <TouchableOpacity className="bg-gray-100 p-[16px] rounded-[12px] mb-4" onPress={() => router.push(`/order?id=${get(item,'id')}`)}>
                    <View className={"flex-row justify-between mb-6"}>
                        <View className={'max-w-[75%]'}>
                            <Text className="text-[16px] font-ALSSiriusMedium mb-1">
                                {t("Buyurtma") + "#" + get(item, 'id')}
                            </Text>
                            <Text className="text-[13px] text-[#919DA6]">
                                {dayjs(get(item, 'createdTime')).format("HH:mm")} &middot; {get(item, 'pharmacy')}
                            </Text>
                        </View>
                        <View
                            className={`rounded-full py-[3px] px-[8px] h-[24px]`} style={{backgroundColor: `${status === "SENT" ? "#248BF2" : status === "CONFIRMED" ? "#00B268" : status === "REJECTED" ? "#E04917" : "#919DA6"}`}}>
                            <Text className="text-white text-[11px] font-ALSSiriusMedium">
                                {t(status)}
                            </Text>
                        </View>
                    </View>

                    <View className={"flex-row justify-between"}>
                        <Text className={"text-[#919DA6] text-[15px]"}>{t("Umumiy summasi")}</Text>
                        <Text className={"text-[15px] font-ALSSiriusMedium"}>{Number(get(item, 'totalPrice')).toLocaleString('en-US')} {t("so'm")}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View className={'px-4 pt-5 bg-white flex-1'}>
            {isLoading ? <Loader /> : (
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
            )}
        </View>
    );
}
