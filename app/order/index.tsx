import React from 'react';
import { Image, ScrollView, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "native-base";
import { useTranslation } from "react-i18next";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import { ENDPOINTS, KEYS } from "@/constants";
import Loader from "@/components/shared/Loader";
import { get } from "lodash";
import dayjs from "dayjs";

const OrderView = () => {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const { data, isLoading } = useFetchRequest({
        queryKey: `${KEYS.getOrder}_${id}`,
        endpoint: `${ENDPOINTS.getOrder}/${id}`,
        enabled: !!id
    });
    const { data: products, isLoading: isLoadingProducts } = useFetchRequest({
        queryKey: `${KEYS.get_product}_${id}`,
        endpoint: `${ENDPOINTS.get_product}/${id}`,
        params: { size: 100 },
        enabled: !!id
    });
    if (isLoading || isLoadingProducts) return <Loader />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons
                    name="close"
                    size={24}
                    color="#215ca0"
                    onPress={() => router.back()}
                />
            </View>
            <View style={styles.orderInfo}>
                <Text style={styles.orderTitle}>
                    {t("Buyurtma")} {`#${id}`}
                </Text>
                <Text style={styles.pharmacyText}>
                    {get(data, 'pharmacy')}
                </Text>
                <View style={styles.row}>
                    <Text style={styles.label}>{t("Status")}</Text>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: get(data, 'status') === "SENT" ? "#248BF2" : get(data, 'status') === "CONFIRMED" ? "#00B268" : get(data, 'status') === "REJECTED" ? "#E04917" : "#919DA6" }
                        ]}
                    >
                        <Text style={styles.statusText}>
                            {t(get(data, 'status'))}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{t("Время отправки")}</Text>
                    <Text style={styles.valueText}>
                        {dayjs(get(data, 'createdTime'))?.format("DD-MMMM, HH:mm")}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{t("Время отправки")}</Text>
                    <Text style={styles.valueText}>
                        {get(data, 'phoneNumber')}
                    </Text>
                </View>
            </View>
            <View style={styles.productListContainer}>
                <Text style={styles.productListTitle}>{t("Список продуктов")}</Text>
                <ScrollView>
                    {
                        get(products, 'content', [])?.map(product => {
                            return (
                                <View key={get(product, 'id')} style={styles.productRow}>
                                    <Image
                                        source={get(product, 'imageUrl') ? { uri: get(product, 'imageUrl') } : require("@/assets/images/no-photo.png")}
                                        style={styles.productImage}
                                    />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName}>
                                            {get(product, 'name')}
                                        </Text>
                                    </View>
                                    <View style={styles.productPriceContainer}>
                                        <Text style={styles.productPrice}>
                                            {get(product, 'price')?.toLocaleString("en-US")} {t("so'm")}
                                        </Text>
                                        <Text style={styles.productQuantity}>
                                            {get(product, 'pricePerProduct')?.toLocaleString("en-US")} {" x "}{get(product, 'quantity')} {t("шт")}
                                        </Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
            <View style={styles.totalContainer}>
                <View style={styles.row}>
                    <Text style={styles.totalLabel}>{t("Общая сумма")}</Text>
                    <Text style={styles.totalValue}>
                        {get(data, 'totalPrice')?.toLocaleString("en-US")} {t("so'm")}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6F7",
        paddingTop: 60,
    },
    header: {
        position: "absolute",
        top: 0,
        backgroundColor: "white",
        width: "100%",
        paddingVertical: 17,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#919DA63D",
    },
    orderInfo: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "white",
        marginBottom: 6,
    },
    orderTitle: {
        textAlign: "center",
        fontFamily: "ALSSiriusBold",
        fontSize: 22,
    },
    pharmacyText: {
        textAlign: "center",
        fontSize: 15,
        marginTop: 4,
        marginBottom: 16,
        fontFamily: "ALSSiriusRegular",
        maxWidth: "80%",
        alignSelf: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    label: {
        fontSize: 15,
        color: "#919DA6",
        fontFamily: "ALSSiriusRegular",
    },
    statusBadge: {
        borderRadius: 999,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    statusText: {
        color: "white",
        fontSize: 11,
        fontFamily: "ALSSiriusMedium",
    },
    valueText: {
        fontSize: 15,
        fontFamily: "ALSSiriusRegular",
    },
    productListContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: "white",
        marginBottom: 6,
    },
    productListTitle: {
        fontSize: 20,
        fontFamily: "ALSSiriusBold",
    },
    productRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    productImage: {
        width: 64,
        height: 64,
        resizeMode: "cover",
    },
    productInfo: {
        width: "45%",
    },
    productName: {
        fontSize: 13,
        fontFamily: "ALSSiriusRegular",
    },
    productPriceContainer: {
        alignItems: "flex-end",
    },
    productPrice: {
        fontSize: 15,
        fontFamily: "ALSSiriusMedium",
        color: "#292C30",
    },
    productQuantity: {
        fontSize: 13,
        color: "#919DA6",
        fontFamily: "ALSSiriusRegular",
    },
    totalContainer: {
        paddingHorizontal: 16,
        paddingVertical: 18,
        backgroundColor: "white",
        marginBottom: 6,
    },
    totalLabel: {
        fontSize: 15,
        fontFamily: "ALSSiriusRegular",
    },
    totalValue: {
        fontSize: 15,
        fontFamily: "ALSSiriusMedium",
        color: "#292C30",
    },
});

export default OrderView;
