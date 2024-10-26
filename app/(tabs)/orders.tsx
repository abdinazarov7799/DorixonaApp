import { Center } from "native-base";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import Loader from "@/components/shared/Loader";
import React, { useRef } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ENDPOINTS, KEYS } from "@/constants";
import { get } from "lodash";
import dayjs from "dayjs";
import { router } from "expo-router";

export default function TabOrdersScreen() {
    const { t } = useTranslation();
    const lastDateRef = useRef(null);
    const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage, isLoading } = useInfiniteScroll({
        key: KEYS.order_get_mine,
        url: ENDPOINTS.order_get_mine,
        limit: 15,
    });

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
                    <Text style={styles.dateHeader}>{formattedDate}</Text>
                )}

                <TouchableOpacity style={styles.orderCard} onPress={() => router.push(`/order?id=${get(item,'id')}`)}>
                    <View style={styles.orderCardHeader}>
                        <View style={styles.orderInfo}>
                            <Text style={styles.orderTitle}>
                                {t("Buyurtma") + "#" + get(item, 'id')}
                            </Text>
                            <Text style={styles.orderDetails}>
                                {dayjs(get(item, 'createdTime')).format("HH:mm")} &middot; {get(item, 'pharmacy')}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor:
                                        status === "SENT" ? "#248BF2" :
                                            status === "CONFIRMED" ? "#00B268" :
                                                status === "REJECTED" ? "#E04917" : "#919DA6"
                                }
                            ]}
                        >
                            <Text style={styles.statusText}>
                                {t(status)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.orderSummary}>
                        <Text style={styles.summaryLabel}>{t("Umumiy summasi")}</Text>
                        <Text style={styles.summaryValue}>
                            {Number(get(item, 'totalPrice'))?.toLocaleString('en-US')} {t("so'm")}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {isLoading ? <Loader /> : (
                <FlatList
                    onEndReached={onEndReached}
                    data={data}
                    initialNumToRender={10}
                    removeClippedSubviews={true}
                    keyExtractor={(item) => item?.id.toString()}
                    renderItem={renderProductCard}
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <Center style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>{t("No order")}</Text>
                        </Center>
                    }
                    ListFooterComponent={
                        <View style={styles.footer}>
                            {isFetchingNextPage && <ActivityIndicator />}
                        </View>
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
    dateHeader: {
        fontSize: 20,
        paddingHorizontal: 8,
        marginBottom: 16,
        color: '#919DA6',
        fontWeight: 'bold',
    },
    orderCard: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    orderCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderInfo: {
        maxWidth: '75%',
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    orderDetails: {
        fontSize: 13,
        color: '#919DA6',
    },
    statusBadge: {
        borderRadius: 12,
        paddingVertical: 3,
        paddingHorizontal: 8,
        height: 20,
    },
    statusText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600',
    },
    orderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryLabel: {
        fontSize: 15,
        color: '#919DA6',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '400',
        color: '#919DA6',
    },
    footer: {
        flexDirection: 'row',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
