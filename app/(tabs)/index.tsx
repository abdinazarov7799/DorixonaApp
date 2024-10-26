import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { KEYS, ENDPOINTS } from "@/constants";
import Loader from "@/components/shared/Loader";
import { useTranslation } from "react-i18next";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button, Center, Icon, Input } from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import useStore from "@/store";
import { get, isEmpty, isNil } from "lodash";
import { router } from "expo-router";
import { BaseBottomSheet } from "@/components/shared/bottom-sheet";

export default function HomeScreen() {
    const { t } = useTranslation();
    const [search, setSearch] = useState(null);
    const { orders, increment, decrement, addToOrder, fullPrice } = useStore();
    const [selected, setSelected] = useState({});
    const viewBottomSheetRef = useRef(null);
    const inputRefs = useRef({});
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage, isLoading } = useInfiniteScroll({
        key: KEYS.get_product,
        url: ENDPOINTS.get_product,
        limit: 16,
        filters: { search }
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

    const renderProductCard = ({ item }) => (
        <View style={styles.productCard}>
            <TouchableOpacity onPress={() => handleOpenViewBottomSheet(item)}>
                <Image
                    source={item?.imageUrl ? { uri: item?.imageUrl } : require("@/assets/images/no-photo.png")}
                    style={styles.productImage}
                />
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                    {item?.name}
                </Text>
                <Text style={styles.productPrice}>{item?.price} {t("so'm")}</Text>
            </TouchableOpacity>
            {!orders[get(item, "id")] ? (
                <Button style={styles.addButton} onPress={() => {
                    increment(item);
                    handleFocusInput(get(item, 'id'));
                }}>
                    <Text style={styles.addButtonText}>{t("Qo'shish")}</Text>
                </Button>
            ) : (
                <View style={styles.counterContainer}>
                    <Button style={styles.counterButton} onPress={() => decrement(get(item, 'id'))}>
                        <AntDesign name="minus" size={12} color="black" />
                    </Button>
                    <Input
                        variant="unstyled"
                        ref={(ref) => (inputRefs.current[get(item, 'id')] = ref)}
                        value={String(getCountForItem(get(item, 'id')))}
                        onChangeText={(count) => addToOrder({ ...item, count })}
                        type="number"
                        keyboardType="number-pad"
                        w={85}
                        h={9}
                        textAlign="center"
                        style={styles.counterInput}
                    />
                    <Button style={styles.counterButton} onPress={() => increment(item)}>
                        <AntDesign name="plus" size={12} color="black" />
                    </Button>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <BaseBottomSheet bottomSheetRef={viewBottomSheetRef} snap="90%">
                <Button variant="unstyled" style={styles.closeButton} onPress={handleCloseViewBottomSheet}>
                    <AntDesign name="close" size={22} color="black" />
                </Button>
                <View style={styles.bottomSheetContent}>
                    <View style={styles.bottomSheetImageContainer}>
                        <Image
                            source={selected?.imageUrl ? { uri: selected?.imageUrl } : require("@/assets/images/no-photo.png")}
                            style={styles.bottomSheetImage}
                        />
                        <Text style={styles.bottomSheetTitle}>{selected?.name}</Text>
                    </View>
                    <View style={styles.bottomSheetFooter}>
                        {orders[get(selected, "id")] ? (
                            <View style={styles.counterContainer}>
                                <Text style={styles.productPriceLabel}>{t("Mahsulot narxi")}</Text>
                                <Text style={styles.bottomSheetPrice}>{selected?.price} {t("so'm")}</Text>
                                <View style={styles.counterContainer}>
                                    <Button style={styles.counterButton} onPress={() => decrement(get(selected, 'id'))}>
                                        <AntDesign name="minus" size={22} color="black" />
                                    </Button>
                                    <Input
                                        variant="unstyled"
                                        value={String(getCountForItem(get(selected, 'id')))}
                                        onChangeText={(count) => addToOrder({ ...selected, count })}
                                        type="number"
                                        keyboardType="number-pad"
                                        style={styles.counterInput}
                                    />
                                    <Button style={styles.counterButton} onPress={() => increment(selected)}>
                                        <AntDesign name="plus" size={22} color="black" />
                                    </Button>
                                </View>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.productPriceLabel}>{t("Mahsulot narxi")}</Text>
                                <Text style={styles.bottomSheetPrice}>{selected?.price} {t("so'm")}</Text>
                                <Button style={styles.addToCartButton} onPress={() => increment(selected)}>
                                    <Text style={styles.addToCartButtonText}>{t("Qo'shish")}</Text>
                                </Button>
                            </>
                        )}
                    </View>
                </View>
            </BaseBottomSheet>
            <View style={styles.searchContainer}>
                <Input
                    variant="unstyled"
                    style={styles.searchInput}
                    value={search}
                    placeholder={t("Kerakli mahsulotni izlash")}
                    onChangeText={(text) => setSearch(text)}
                    InputLeftElement={
                        <Icon as={<Ionicons name="search" />} size={6} ml="3" mr="1" color="black" />
                    }
                />
            </View>
            {!isNil(fullPrice) && fullPrice > 0 && (
                <View style={styles.cartFooter}>
                    <Button style={styles.cartButton} onPress={() => router.push('/basket')}>
                        <View style={styles.cartButtonContent}>
                            <Text style={styles.cartButtonText}>{t("Savat")}</Text>
                            <Text style={styles.cartButtonText}>{Intl.NumberFormat('en-US').format(fullPrice)} {t("so'm")}</Text>
                        </View>
                    </Button>
                </View>
            )}
            {isLoading ? (
                <Loader />
            ) : (
                <FlatList
                    onEndReached={onEndReached}
                    data={data}
                    initialNumToRender={10}
                    removeClippedSubviews={true}
                    keyExtractor={(item) => item?.id}
                    numColumns={2}
                    columnWrapperStyle={styles.flatListColumn}
                    renderItem={renderProductCard}
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <Center style={styles.emptyContainer}>
                            <Image source={require("@/assets/images/search-icon.png")} style={styles.emptyImage} />
                            <Text style={styles.emptyText}>{t("Товар не найден")}</Text>
                            <Text style={styles.emptyText}>{t("Повторите запрос")}</Text>
                        </Center>
                    }
                    ListHeaderComponent={
                        !isEmpty(data) && <Text style={styles.listHeader}>{t("Mahsulotlar roʻyxati")}</Text>
                    }
                    ListFooterComponent={
                        isFetchingNextPage && (
                            <View style={styles.listFooter}>
                                <ActivityIndicator />
                            </View>
                        )
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    productCard: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 16,
        marginBottom: 16,
        width: '48%',
        justifyContent: 'space-between',
    },
    productImage: {
        width: '100%',
        height: 148,
        resizeMode: 'cover',
    },
    productName: {
        marginTop: 10,
        paddingHorizontal: 4,
        fontSize: 13,
    },
    productPrice: {
        paddingHorizontal: 4,
        marginTop: 8,
        marginBottom: 8,
        fontSize: 13,
        fontWeight: 'bold',
        color: 'black',
    },
    addButton: {
        paddingVertical: 8,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    addButtonText: {
        textAlign: 'center',
        fontSize: 13,
    },
    counterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    counterButton: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
    counterInput: {
        borderRadius: 10,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        width: 85,
        height: 36,
        textAlign: 'center',
    },
    searchContainer: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 16,
        marginBottom: 8,
    },
    searchInput: {
        color: 'gray',
        fontSize: 15,
    },
    cartFooter: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 74,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
    },
    cartButton: {
        backgroundColor: '#215ca0',
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    cartButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cartButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    bottomSheetContent: {
        height: '87%',
    },
    bottomSheetImageContainer: {
        padding: 16,
    },
    bottomSheetImage: {
        width: '100%',
        height: 350,
        resizeMode: 'cover',
    },
    bottomSheetTitle: {
        marginTop: 8,
        paddingHorizontal: 4,
        fontSize: 24,
        fontWeight: 'bold',
    },
    bottomSheetFooter: {
        paddingHorizontal: 16,
        paddingTop: 16,
        marginTop: 'auto',
    },
    productPriceLabel: {
        color: '#919DA6',
        fontSize: 16,
        marginBottom: 4,
    },
    bottomSheetPrice: {
        color: '#292C30',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addToCartButton: {
        backgroundColor: '#215ca0',
        width: '100%',
        height: 44,
        borderRadius: 10,
        marginTop: 8,
    },
    addToCartButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 8,
    },
    emptyContainer: {
        marginTop: 96,
        alignItems: 'center',
    },
    emptyImage: {
        width: 72,
        height: 72,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '400',
        marginTop: 4,
    },
    listHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 8,
        marginBottom: 16,
    },
    listFooter: {
        flexDirection: 'row',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListColumn: {
        justifyContent: 'space-between',
    },
});
