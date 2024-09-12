import {View, Text, Image, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import { KEYS, ENDPOINTS } from "@/constants";
import Loader from "@/components/shared/Loader";
import React from "react";
import { useTranslation } from "react-i18next";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {Center} from "native-base";
import useStore from "@/store";

export default function HomeScreen() {
    const { t } = useTranslation();
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage,isLoading } = useInfiniteScroll({
        key: KEYS.get_product,
        url: ENDPOINTS.get_product,
        limit: 15,
    });

    console.log(useStore.getState().accessToken,'data')
    const renderProductCard = ({ item }) => (
        <View className="bg-white p-3 rounded-lg mb-4 w-[48%]">
            <Image
                source={{ uri: item.imageUrl }}
                style={{ width: '100%', height: 100, resizeMode: 'cover' }}
            />
            <Text className="mt-2 text-lg font-semibold">{item.name}</Text>
            <Text className="mt-1 text-black font-bold">{item.price} so'm</Text>
            <TouchableOpacity className="mt-2 py-2 bg-blue-500 rounded-full">
                <Text className="text-center text-white">{t("Qo'shish")}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className={'px-4 py-5 bg-[#F2F2F2] flex-1'}>
            {isLoading && <Loader />}
            <FlatList
                onEndReached={onEndReached}
                data={data}
                initialNumToRender={10}
                removeClippedSubviews={true}
                keyExtractor={(item) => item.id}
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
