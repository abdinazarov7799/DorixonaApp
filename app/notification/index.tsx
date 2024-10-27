import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
	FlatList,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
	RefreshControl,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ENDPOINTS, KEYS } from "@/constants";
import { get, head, isEqual } from "lodash";
import React from "react";
import { request } from "@/lib/api";
import {Center} from "native-base";

const Index = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const minHeight = useWindowDimensions().height;
	const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage } = useInfiniteScroll({
		key: KEYS.notification_get_mine,
		url: ENDPOINTS.notification_get_mine,
		limit: 20,
	});

	const viewNotification = (item) => {
		request.get(`${ENDPOINTS.notification_get_mine}/${get(item, 'id')}`);
		if (isEqual(head(get(item, 'type', '').split('_')), 'ORDER')) {
			router.push(`/order?id=${get(item, 'orderId')}`);
		}
	};

	return (
		<View style={[styles.container, { minHeight }]}>
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<Ionicons
						name="arrow-back"
						size={24}
						color="#215ca0"
						onPress={() => router.back()}
					/>
					<Text style={styles.headerText}>{t("Xabarnomalar")}</Text>
				</View>
			</View>
			<FlatList
				onEndReached={onEndReached}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
				keyExtractor={item => get(item, 'id')}
				data={data}
				ListEmptyComponent={
					<Center style={styles.emptyContainer}>
						<Text style={styles.emptyText}>{t("No notification")}</Text>
					</Center>
				}
				ListFooterComponent={
					<View style={styles.footer}>
						{isFetchingNextPage && <ActivityIndicator />}
					</View>
				}
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.notificationItem} onPress={() => viewNotification(item)}>
						<View style={styles.iconContainer}>
							<View
								style={[
									styles.notificationDot,
									!get(item, 'viewed') && styles.unreadDot,
								]}
							/>
						</View>
						<View style={styles.notificationContent}>
							<View style={styles.notificationHeader}>
								<Text style={styles.notificationTitle}>{t(get(item, 'type'))}</Text>
								<Text style={styles.notificationTime}>
									{new Date(get(item, 'createdTime'))?.toLocaleString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Text>
								<Ionicons name="chevron-forward" size={14} color="#215ca0" />
							</View>
						</View>
					</TouchableOpacity>
				)}
			/>
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
		width: "100%",
		paddingVertical: 17,
		paddingHorizontal: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "#919DA63D",
		backgroundColor: "white",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerText: {
		marginLeft: 16,
		fontFamily: "ALSSiriusMedium",
		fontSize: 18,
	},
	footer: {
		flexDirection: "row",
		height: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	notificationItem: {
		flexDirection: "row",
		padding: 16,
		paddingLeft: 0,
		borderBottomWidth: 1,
		borderBottomColor: "#919DA63D",
	},
	iconContainer: {
		width: 16,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 12,
	},
	notificationDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	unreadDot: {
		backgroundColor: "#215CA0",
	},
	notificationContent: {
		flex: 1,
	},
	notificationHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	notificationTitle: {
		fontFamily: "ALSSiriusMedium",
		fontSize: 15,
	},
	notificationTime: {
		marginLeft: "auto",
		marginRight: 4,
		fontSize: 13,
		color: "#919DA6",
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
});

export default Index;
