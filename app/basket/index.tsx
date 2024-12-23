import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Dimensions
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { get, isNil } from "lodash";
import { Button, Input } from "native-base";
import {useStore} from "@/store";

const Index = () => {
    const { t } = useTranslation();
    const { orders, increment, decrement, addToOrder, setOrders, fullPrice } = useStore();
    const ordersList = Object.values(orders);
    const getCountForItem = (itemId) => {
        return orders[itemId] ? orders[itemId]?.count : 0;
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <AntDesign name="close" size={24} color="black" onPress={() => router.push("/")} />
                            <Text style={styles.headerText}>{t("Mahsulotlar roʻyxati")}</Text>
                        </View>
                        <AntDesign name="delete" size={24} color="black" onPress={() => setOrders([])} />
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {ordersList && ordersList.map((item) => (
                            <View style={styles.orderItem} key={item?.id}>
                                <Image
                                    source={item?.imageUrl ? { uri: item?.imageUrl } : require("@/assets/images/no-photo.png")}
                                    style={styles.itemImage}
                                />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item?.name}</Text>
                                    <Text style={styles.itemPrice}>{item?.price} {t("so'm")}</Text>
                                </View>
                                <View style={styles.quantityControls}>
                                    <Button style={styles.controlButton} shadow={"1"} onPress={() => decrement(get(item, 'id'))}>
                                        <AntDesign name="minus" size={12} color="black" />
                                    </Button>
                                    <Input
                                        variant="unstyled"
                                        value={String(getCountForItem(get(item, 'id')))}
                                        onChangeText={(count) => addToOrder({ ...item, count })}
                                        keyboardType="number-pad"
                                        w={70}
                                        h={9}
                                        textAlign="center"
                                        style={styles.input}
                                    />
                                    <Button style={styles.controlButton} shadow={"1"} onPress={() => increment(item)}>
                                        <AntDesign name="plus" size={12} color="black" />
                                    </Button>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>{t("Umumiy narxi")}</Text>
                            <Text style={styles.totalPrice}>{Intl.NumberFormat('en-US').format(fullPrice)} {t("so'm")}</Text>
                        </View>
                        <Button style={styles.selectPharmacyButton} disabled={isNil(orders)} onPress={() => router.push('/basket/company')}>
                            <Text style={styles.selectPharmacyButtonText}>{t("Dorixonani belgilash")}</Text>
                        </Button>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 60,
        paddingBottom: 110,
        paddingHorizontal: 16,
    },
    header: {
        position: "absolute",
        top: 0,
        width: Dimensions.get("window").width,
        paddingVertical: 17,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#919DA63D",
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    headerText: {
        marginLeft: 16,
        fontFamily: "ALSSiriusMedium",
        fontSize: 18,
    },
    scrollView: {
        flex: 1,
    },
    orderItem: {
        padding: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemImage: {
        width: 60,
        height: 60,
        resizeMode: "cover",
    },
    itemInfo: {
        width: "45%",
    },
    itemName: {
        marginTop: 4,
        fontSize: 13,
        paddingHorizontal: 4,
    },
    itemPrice: {
        marginTop: 4,
        fontSize: 13,
        fontFamily: "ALSSiriusMedium",
        color: "black",
        paddingHorizontal: 4,
        marginBottom: 8,
    },
    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
    },
    controlButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        textAlign: "center",
        marginHorizontal: 8
    },
    footer: {
        position: "absolute",
        bottom: 0,
        width: Dimensions.get("window").width,
        height: 114,
        padding: 12,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#919DA63D",
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: "ALSSiriusRegular",
        color: "#656E78",
    },
    totalPrice: {
        fontFamily: "ALSSiriusBold",
        fontSize: 18,
    },
    selectPharmacyButton: {
        backgroundColor: "#215ca0",
        height: 44,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    selectPharmacyButtonText: {
        color: "white",
        fontFamily: "ALSSiriusMedium",
        fontSize: 16,
    },
});

export default Index;
