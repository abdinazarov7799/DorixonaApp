import {View, Text, Image, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import { KEYS, ENDPOINTS } from "@/constants";
import Loader from "@/components/shared/Loader";
import React from "react";
import { useTranslation } from "react-i18next";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {Center} from "native-base";

export default function HomeScreen() {
    const { t } = useTranslation();
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage,isLoading } = useInfiniteScroll({
        key: KEYS.product_list,
        url: ENDPOINTS.product_list,
        limit: 15,
    });

    const renderProductCard = ({ item }) => {
        return (
            <View className="bg-gray-100 p-3 rounded-[10px] mb-4 w-[48%]">
                <Image
                    source={{ uri: item?.imageUrl }}
                    style={{ width: '100%', height: 148, resizeMode: 'cover' }}
                />
                <Text
                    className="mt-1 text-[13px] font-semibold"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {item?.name}
                </Text>
                <Text className="mt-1 text-black text-[13px] font-bold">{item?.price} so'm</Text>
                <TouchableOpacity className="mt-3 py-2 bg-white rounded-full border border-gray-300">
                    <Text className="text-center text-[13px]">{t("Qo'shish")}</Text>
                </TouchableOpacity>
            </View>
        );
    };



    return (
        <View className={'px-4 py-5 bg-white flex-1'}>
            {isLoading && <Loader />}
            <FlatList
                onEndReached={onEndReached}
                data={data}
                initialNumToRender={10}
                removeClippedSubviews={true}
                keyExtractor={(item) => item?.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
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
        </View>
    );
}
