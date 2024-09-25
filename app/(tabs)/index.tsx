import {
    View,
    Text,
    Image,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { KEYS, ENDPOINTS } from "@/constants";
import Loader from "@/components/shared/Loader";
import React, {useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {Button, Center, Icon, Input} from "native-base";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import useStore from "@/store";
import {get, isEmpty, isEqual, isNil} from "lodash";
import {router} from "expo-router";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {BaseBottomSheet} from "@/components/shared/bottom-sheet";

export default function HomeScreen() {
    const { t } = useTranslation();
    const [search, setSearch] = useState(null);
    const {orders,increment,decrement,addToOrder,fullPrice} = useStore();
    const [selected, setSelected] = useState<object>({});
    const viewBottomSheetRef = useRef<BottomSheetModal>(null);
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage,isLoading } = useInfiniteScroll({
        key: KEYS.get_product,
        url: ENDPOINTS.get_product,
        limit: 16,
        filters: {
            search
        }
    });

    const getCountForItem = (itemId) => {
        const order = orders.find((order) => order?.id === itemId);
        return order ? order.count : 0;
    };

    const handleOpenViewBottomSheet = (item) => {
        setSelected(item)
        viewBottomSheetRef.current?.present();
    };

    const handleCloseViewBottomSheet = () => {
        setSelected({})
        viewBottomSheetRef.current?.dismiss();
    };

    const renderProductCard = ({ item }) => {
        return (
            <View className="bg-gray-100 p-2 rounded-[16px] mb-4 w-[48%] flex justify-between">
                <TouchableOpacity onPress={() => handleOpenViewBottomSheet(item)}>
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
                    <Text className="mt-1 p-1 mb-3 text-black text-[13px] font-medium">{item?.price} {t("so'm")}</Text>
                </TouchableOpacity>
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
            <BaseBottomSheet bottomSheetRef={viewBottomSheetRef} snap={"90%"}>
                <Button variant={"unstyled"} shadow={1} className={"absolute right-3 rounded-full bg-white z-10"} onPress={handleCloseViewBottomSheet}>
                    <AntDesign name="close" size={22} color="black" onPress={handleCloseViewBottomSheet}/>
                </Button>
                <View className={"h-[87vh]"}>
                    <View className="p-4">
                        <Image
                            source={selected?.imageUrl ? { uri: selected?.imageUrl } : require("@/assets/images/no-photo.png")}
                            style={{width: "auto",height: 350, resizeMode: 'cover' }}
                        />
                        <Text
                            className="mt-1 text-[24px] p-1 font-bold"
                        >
                            {selected?.name}
                        </Text>
                    </View>
                    <View className={"absolute w-full p-4 bottom-0"}>
                        {
                            orders?.some(order => isEqual(get(order,"id"),get(selected,"id"))) ? (
                                <View className={"flex-row justify-between items-center"}>
                                    <View>
                                        <Text className={"text-[#919DA6] text-[16px] mb-1"}>{t("Mahsulot narxi")}</Text>
                                        <Text className={"text-[#292C30] text-[18px] font-bold"}>{selected?.price} {t("so'm")}</Text>
                                    </View>
                                    <View className={"flex-row justify-between items-center space-x-2"}>
                                        <Button className="bg-white rounded-[10px]" shadow={"1"} onPress={() => decrement(get(selected,'id'))}>
                                            <AntDesign name="minus" size={22} color="black" />
                                        </Button>
                                        <Input
                                            variant={"unstyled"}
                                            value={String(getCountForItem(get(selected, 'id')))}
                                            onChangeText={(count) => addToOrder({...selected,count})}
                                            type={"number"}
                                            keyboardType={"number-pad"}
                                            w={85}
                                            textAlign={"center"}
                                            className="rounded-[10px] border border-gray-200"
                                        />
                                        <Button className="bg-white rounded-[10px]" shadow={"1"} onPress={() => increment(selected)}>
                                            <AntDesign name="plus" size={22} color="black" />
                                        </Button>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View className={"flex-row justify-between items-center mb-3"}>
                                        <Text className={"text-[#919DA6] text-[16px]"}>{t("Mahsulot narxi")}</Text>
                                        <Text className={"text-[#292C30] text-[18px] font-bold"}>{selected?.price} {t("so'm")}</Text>
                                    </View>
                                    <Button className={"bg-[#215ca0] w-full h-[44px] rounded-lg"} shadow={"1"} onPress={() => increment(selected)}>
                                        <Text className="text-center text-white text-[15px] font-medium">{t("Qo'shish")}</Text>
                                    </Button>
                                </>
                            )
                        }
                    </View>
                </View>
            </BaseBottomSheet>
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
                        <Button className={"bg-[#215ca0] w-full h-full rounded-lg"} onPress={() => router.push('/basket')}>
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