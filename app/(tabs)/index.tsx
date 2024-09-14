import {View, Text, Image, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import { KEYS, ENDPOINTS } from "@/constants";
import Loader from "@/components/shared/Loader";
import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {Button, Center, Icon, Input} from "native-base";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import useStore from "@/store";
import {get, isEmpty, isEqual, isNil} from "lodash";
import {router} from "expo-router";

export default function HomeScreen() {
    const { t } = useTranslation();
    const [search, setSearch] = useState(null);
    const [fullPrice, setFullPrice] = useState(0);
    const {orders,increment,decrement,addToOrder} = useStore();

    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage,isLoading } = useInfiniteScroll({
        key: KEYS.get_product,
        url: ENDPOINTS.get_product,
        limit: 16,
        filters: {
            search
        }
    });

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

    const renderProductCard = ({ item }) => {
        return (
            <View className="bg-gray-100 p-2 rounded-[16px] mb-4 w-[48%] flex justify-between">
                <Image
                    source={item?.imageUrl ? { uri: item?.imageUrl } : require("@/assets/images/no-photo.png")}
                    style={{ width: '100%', height: 148, resizeMode: 'cover' }}
                />
                <View>
                    <Text
                        className="mt-1 text-[13px] p-1"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item?.name}
                    </Text>
                    <Text className="mt-1 p-1 mb-3 text-black text-[13px] font-medium">{item?.price} so'm</Text>
                </View>
                {
                    !orders?.some(order => isEqual(get(order,"id"),get(item,"id"))) ? (
                        <Button className="py-2 bg-white rounded-[10px]" shadow={"1"} onPress={() => increment(item)}>
                            <Text className="text-center text-[13px]">{t("Qo'shish")}</Text>
                        </Button>
                    ) : (
                        <View className={"flex-row justify-between items-center space-x-2"}>
                            <Button className="bg-white rounded-[10px]" shadow={"1"} onPress={() => decrement(get(item,'id'))}>
                                <AntDesign name="minus" size={12} color="black" />
                            </Button>
                            <Input
                                variant={"unstyled"}
                                value={String(getCountForItem(get(item, 'id')))}
                                onChangeText={(count) => addToOrder({...item,count})}
                                type={"number"}
                                keyboardType={"number-pad"}
                                w={85}
                                h={9}
                                textAlign={"center"}
                                className="rounded-[10px] border border-gray-200"
                            />
                            <Button className="bg-white rounded-[10px]" shadow={"1"} onPress={() => increment(item)}>
                                <AntDesign name="plus" size={12} color="black" />
                            </Button>
                        </View>
                    )
                }
            </View>
        );
    };



    return (
        <View className={'px-4 pt-5 bg-white flex-1'}>
            <View className={"bg-gray-100 p-2 rounded-full mb-2"}>
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
                !isNil(fullPrice) && fullPrice > 0 && (
                    <View className={"absolute bottom-0 z-10 w-[100vw] h-[74px] p-[12px] bg-white"}>
                        <Button className={"bg-blue-500 w-full h-full rounded-lg"} onPress={() => router.push('/basket')}>
                            <View className={"flex-row justify-between w-full items-center"}>
                                <Text className={"text-white font-medium text-[16px]"}>
                                    {t("Savat")}
                                </Text>
                                <Text className={"text-white font-medium text-[16px]"}>
                                    {Intl.NumberFormat('en-US').format(fullPrice)} {t("so'm")}
                                </Text>
                            </View>
                        </Button>
                    </View>
                )
            }
            {
                isLoading ? <Loader /> : (
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
                            <Center className={'mt-24'}>
                                <Image source={require("@/assets/images/search-icon.png")} width={72} height={72}/>
                                <Text>{t("Товар не найден")}</Text>
                                <Text>{t("Повторите запрос")}</Text>
                            </Center>
                        }
                        ListHeaderComponent={
                            isEmpty(data) ? <></> : (
                                <Text
                                    className={"font-bold text-[20px] mt-3 mb-4"}
                                >
                                    {t("Mahsulotlar roʻyxati")}
                                </Text>
                            )
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
                )
            }
        </View>
    );
}
