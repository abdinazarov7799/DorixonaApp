import {View, Text, Image, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import { KEYS, ENDPOINTS } from "@/constants";
import Loader from "@/components/shared/Loader";
import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {Button, Center, Icon, Input} from "native-base";
import {Ionicons} from "@expo/vector-icons";

export default function HomeScreen() {
    const { t } = useTranslation();
    const [search, setSearch] = useState(null);
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage,isLoading } = useInfiniteScroll({
        key: KEYS.get_product,
        url: ENDPOINTS.get_product,
        limit: 15,
        filters: {
            search
        }
    });
    const renderProductCard = ({ item }) => {
        return (
            <View className="bg-gray-100 p-2 rounded-[16px] mb-4 w-[48%]">
                <Image
                    source={item?.imageUrl ? { uri: item?.imageUrl } : require("@/assets/images/no-photo.png")}
                    style={{ width: '100%', height: 148, resizeMode: 'cover' }}
                />
                <Text
                    className="mt-1 text-[13px] p-1"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {item?.name}
                </Text>
                <Text className="mt-1 p-1 mb-3 text-black text-[13px] font-medium">{item?.price} so'm</Text>
                <Button className="py-2 bg-white rounded-[10px]" shadow={"1"}>
                    <Text className="text-center text-[13px]">{t("Qo'shish")}</Text>
                </Button>
            </View>
        );
    };



    return (
        <View className={'px-4 pt-5 bg-white flex-1'}>
            <View className={"bg-gray-100 p-2 rounded-full"}>
                <Input
                    variant="unstyled"
                    className={"text-gray-500 text-[15px]"}
                    value={search}
                    placeholder={t("Kerakli mahsulotni izlash")}
                    onChangeText={(text) => setSearch(text)}
                    InputLeftElement={
                        <Icon
                            as={<Ionicons name="search" />}
                            size={6}
                            ml="3"
                            mr="1"
                            color="black"
                        />
                    }
                />
            </View>
            {
                isLoading ? <Loader /> : (
                    <>
                        <Text
                            className={"font-bold text-[20px] mt-5 mb-4"}
                        >
                            {t("Mahsulotlar roʻyxati")}
                        </Text>
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
                    </>
                )
            }
        </View>
    );
}
