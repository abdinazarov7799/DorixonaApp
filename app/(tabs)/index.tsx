import {
    View,
    Text,
    Image,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { KEYS, ENDPOINTS } from "@/constants";
import Loader from "@/components/shared/Loader";
import React, {useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {Button, Center, Icon, Input} from "native-base";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {useStore} from "@/store";
import {get, isEmpty, isNil} from "lodash";
import {router} from "expo-router";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {BaseBottomSheet} from "@/components/shared/bottom-sheet";

export default function HomeScreen() {
    const { t } = useTranslation();
    const [search, setSearch] = useState(null);
    const {orders, increment, decrement, addToOrder, fullPrice} = useStore();
    const [selected, setSelected] = useState<object>({});
    const viewBottomSheetRef = useRef<BottomSheetModal>(null);
    const inputRefs = useRef({});
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage, isLoading } = useInfiniteScroll({
        key: KEYS.get_product,
        url: ENDPOINTS.get_product,
        limit: 16,
        filters: {
            search
        }
    });

    const getCountForItem = (itemId) => {
        return orders[itemId] ? orders[itemId]?.count : 0;
    };

    const handleOpenViewBottomSheet = (item) => {
        setSelected(item);
        viewBottomSheetRef.current?.present();
    };

    const handleCloseViewBottomSheet = () => {
        setSelected({});
        viewBottomSheetRef.current?.dismiss();
    };

    const handleFocusInput = (itemId) => {
        if (inputRefs.current[itemId]) {
            inputRefs.current[itemId].focus();
        }
    };

    const renderProductCard = ({ item }) => {
        return (
            <View style={{ backgroundColor: '#f3f4f6', padding: 8, borderRadius: 16, marginBottom: 16, width: '48%', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => handleOpenViewBottomSheet(item)}>
                    <Image
                        source={item?.imageUrl ? { uri: item?.imageUrl } : require("@/assets/images/no-photo.png")}
                        style={{ width: '100%', height: 148, resizeMode: 'cover' }}
                    />
                    <Text
                        style={{ marginTop: 4, fontSize: 13, padding: 4 }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item?.name}
                    </Text>
                    <Text
                        style={{ marginTop: 4, fontSize: 13, padding: 4, color: "#919DA6" }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item?.description}
                    </Text>
                    <Text style={{ marginTop: 4, padding: 4, marginBottom: 12, color: '#000', fontSize: 13, fontFamily: 'ALSSiriusMedium' }}>
                        {item?.price} {t("so'm")}
                    </Text>
                </TouchableOpacity>
                {
                    !orders[get(item, "id")] ? (
                        <Button
                            style={{ paddingVertical: 8, backgroundColor: '#fff', borderRadius: 10 }}
                            shadow={"1"}
                            isDisabled={!get(item,'isActive')}
                            onPress={() => {
                                increment(item);
                                handleFocusInput(get(item, 'id'));
                            }}
                        >
                            <Text style={{ textAlign: 'center', fontSize: 13 }}>{t("Qo'shish")}</Text>
                        </Button>
                    ) : (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button style={{ backgroundColor: '#fff', borderRadius: 10, height: 35 }} shadow={"1"} onPress={() => decrement(get(item, 'id'))}>
                                <AntDesign name="minus" size={12} color="black" />
                            </Button>
                            <Input
                                variant={"unstyled"}
                                ref={ref => inputRefs.current[get(item, 'id')] = ref}
                                value={String(getCountForItem(get(item, 'id')))}
                                onChangeText={(count) => addToOrder({ ...item, count })}
                                type={"number"}
                                keyboardType={"number-pad"}
                                width={"24"}
                                style={{ textAlign: 'center', borderRadius: 10, borderColor: '#e5e7eb', borderWidth: 1, height: 35 }}
                            />
                            <Button style={{ backgroundColor: '#fff', borderRadius: 10, height: 35 }} shadow={"1"} onPress={() => increment(item)}>
                                <AntDesign name="plus" size={12} color="black" />
                            </Button>
                        </View>
                    )
                }
            </View>
        );
    };

    return (
        <View style={{ paddingHorizontal: 16, paddingTop: 20, backgroundColor: '#fff', flex: 1 }}>
            <BaseBottomSheet bottomSheetRef={viewBottomSheetRef} snap={"90%"}>
                <Button
                    variant={"unstyled"}
                    shadow={1}
                    style={{ position: 'absolute', right: 12, borderRadius: 999, backgroundColor: '#fff', zIndex: 10 }}
                    onPress={handleCloseViewBottomSheet}
                >
                    <AntDesign name="close" size={22} color="black" onPress={handleCloseViewBottomSheet} />
                </Button>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                                keyboardShouldPersistTaps="handled">
                        <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: 16}}>
                            <View style={{ padding: 16 }}>
                                <Image
                                    source={selected?.imageUrl ? { uri: selected?.imageUrl } : require("@/assets/images/no-photo.png")}
                                    style={{ width: "auto", height: 350, resizeMode: 'cover' }}
                                />
                                <Text style={{ marginTop: 4, fontSize: 24, padding: 4, fontFamily: 'ALSSiriusBold' }}>
                                    {selected?.name}
                                </Text>
                                <Text style={{ marginTop: 4, fontSize: 16, padding: 4, fontFamily: 'ALSSiriusRegular' }}>
                                    {selected?.description}
                                </Text>
                            </View>

                            <View style={{ width: '100%', padding: 16 }}>
                                {
                                    orders[get(selected, "id")] ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View>
                                                <Text style={{ color: '#919DA6', fontSize: 16, marginBottom: 4, fontFamily: 'ALSSiriusRegular' }}>
                                                    {t("Mahsulot narxi")}
                                                </Text>
                                                <Text style={{ color: '#292C30', fontSize: 18, fontFamily: 'ALSSiriusBold' }}>
                                                    {selected?.price} {t("so'm")}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Button
                                                    style={{ backgroundColor: '#fff', borderRadius: 10 }}
                                                    shadow={"1"}
                                                    onPress={() => decrement(get(selected, 'id'))}
                                                >
                                                    <AntDesign name="minus" size={22} color="black" />
                                                </Button>
                                                <Input
                                                    variant={"unstyled"}
                                                    value={String(getCountForItem(get(selected, 'id')))}
                                                    onChangeText={(count) => addToOrder({ ...selected, count })}
                                                    type={"number"}
                                                    keyboardType={"number-pad"}
                                                    width={90}
                                                    height={10}
                                                    style={{ textAlign: 'center', borderRadius: 10, borderColor: '#e5e7eb', borderWidth: 1, marginHorizontal: 10 }}
                                                />
                                                <Button
                                                    style={{ backgroundColor: '#fff', borderRadius: 10 }}
                                                    shadow={"1"}
                                                    onPress={() => increment(selected)}
                                                >
                                                    <AntDesign name="plus" size={22} color="black" />
                                                </Button>
                                            </View>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                                <Text style={{ color: '#919DA6', fontSize: 16 }}>{t("Mahsulot narxi")}</Text>
                                                <Text style={{ color: '#292C30', fontSize: 18, fontFamily: 'ALSSiriusBold' }}>
                                                    {selected?.price} {t("so'm")}
                                                </Text>
                                            </View>
                                            <Button
                                                isDisabled={!get(selected,'isActive')}
                                                style={{ backgroundColor: '#215ca0', width: '100%', height: 44, borderRadius: 10 }}
                                                shadow={"1"}
                                                onPress={() => increment(selected)}
                                            >
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 15, fontFamily: 'ALSSiriusMedium' }}>
                                                    {t("Qo'shish")}
                                                </Text>
                                            </Button>
                                        </>
                                    )
                                }
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </BaseBottomSheet>
            <View style={{ backgroundColor: '#f3f4f6', padding: 8, borderRadius: 999, marginBottom: 8 }}>
                <Input
                    variant="unstyled"
                    style={{ color: '#6b7280', fontSize: 15 }}
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
                    <View style={{ position: 'absolute', bottom: 0, zIndex: 10, width: Dimensions.get("window").width, height: 74, padding: 12, backgroundColor: '#fff' }}>
                        <Button style={{ backgroundColor: '#215ca0', width: '100%', height: '100%', borderRadius: 10 }} onPress={() => router.push('/basket')}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
                                <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'ALSSiriusMedium' }}>
                                    {t("Savat")}
                                </Text>
                                <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'ALSSiriusMedium' }}>
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
                            <Center style={{ marginTop: 96 }}>
                                <Image source={require("@/assets/images/search-icon.png")} width={72} height={72}/>
                                <Text style={{ fontFamily: 'ALSSiriusRegular' }}>{t("Товар не найден")}</Text>
                                <Text style={{ fontFamily: 'ALSSiriusRegular' }}>{t("Повторите запрос")}</Text>
                            </Center>
                        }
                        ListHeaderComponent={
                            isEmpty(data) ? <></> : (
                                <Text style={{ fontFamily: 'ALSSiriusBold', fontSize: 20, marginTop: 12, marginBottom: 16 }}>
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
