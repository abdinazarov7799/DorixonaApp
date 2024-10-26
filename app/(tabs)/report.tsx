import React, { useMemo, useRef, useState } from "react";
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
import { FontAwesome5 } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ENDPOINTS, KEYS } from "@/constants";
import { HistoryBottomSheet } from "@/components/history";

const Report = () => {
	const [transaction, setTransaction] = useState<ActionItemProps | null>(null);
	const minHeight = useWindowDimensions().height;
	const sheetRef = useRef<BottomSheetModal>(null);
	const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage } = useInfiniteScroll({
		key: KEYS.transaction_history_list,
		url: ENDPOINTS.transaction_history_list,
		limit: 20,
	});

	const handlePress = (item: ActionItemProps) => () => {
		setTransaction(item);
		sheetRef.current?.present();
	};

	const handleDismiss = () => {
		sheetRef.current?.dismiss();
	};

	return (
		<>
			<HistoryBottomSheet
				bottomSheetRef={sheetRef}
				onClose={handleDismiss}
				transaction={transaction}
			/>
			<View style={[styles.container, { minHeight }]}>
				<View style={styles.innerContainer}>
					<FlatList
						data={data as ActionItemProps[]}
						onEndReached={onEndReached}
						refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
						keyExtractor={(item) => item?.number}
						renderItem={({ item }) => (
							<ActionItem {...item} onPress={handlePress(item)} />
						)}
						ListFooterComponent={
							<View style={styles.footer}>
								{isFetchingNextPage && <ActivityIndicator />}
							</View>
						}
					/>
				</View>
			</View>
		</>
	);
};

export type ActionItemProps = {
	id: number;
	type: "INCOME" | "EXPENSE";
	status: "DONE" | "PENDING";
	amount: number;
	pharmacy: string;
	number: number;
	updatedTime: string | null;
	onPress: () => void;
};

function ActionItem({ type, amount, pharmacy, updatedTime, onPress }: ActionItemProps) {
	const { t } = useTranslation();

	const ActionTypes = useMemo(
		() => ({
			INCOME: (
				<TouchableOpacity style={styles.actionItemContainer} onPress={onPress}>
					<View style={styles.iconContainer}>
						<FontAwesome5 name="arrow-down" size={18} color="#292C30" />
					</View>
					<View>
						<Text style={styles.pharmacyText} numberOfLines={1} ellipsizeMode="tail">
							{t(pharmacy)}
						</Text>
						<Text style={styles.incomeText}>{t("Tushum")}</Text>
					</View>
					<View style={styles.amountContainer}>
						<Text style={styles.incomeAmount}>
							{Number(amount)?.toLocaleString("en-US")} {t("so'm")}
						</Text>
						{updatedTime && (
							<Text style={styles.updatedTimeText}>
								{new Date(updatedTime)?.toLocaleString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</Text>
						)}
					</View>
				</TouchableOpacity>
			),
			EXPENSE: (
				<TouchableOpacity style={styles.actionItemContainer} onPress={onPress}>
					<View style={styles.iconContainer}>
						<FontAwesome5 name="arrow-up" size={18} color="#292C30" />
					</View>
					<View>
						<Text style={styles.pharmacyText} numberOfLines={1} ellipsizeMode="tail">
							{t(pharmacy)}
						</Text>
						<Text style={styles.expenseText}>{t("Chiqim")}</Text>
					</View>
					<View style={styles.amountContainer}>
						<Text style={styles.expenseAmount}>
							{Number(amount)?.toLocaleString("en-US")} {t("so'm")}
						</Text>
						{updatedTime && (
							<Text style={styles.updatedTimeText}>
								{new Date(updatedTime)?.toLocaleString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</Text>
						)}
					</View>
				</TouchableOpacity>
			),
		}),
		[type]
	);

	return ActionTypes[type] || null;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F6F7",
		paddingTop: 16,
	},
	innerContainer: {
		flex: 1,
		paddingHorizontal: 16,
	},
	footer: {
		flexDirection: "row",
		height: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	actionItemContainer: {
		flexDirection: "row",
		marginBottom: 16,
	},
	iconContainer: {
		width: 40,
		height: 40,
		backgroundColor: "#B4C0CC29",
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	pharmacyText: {
		fontSize: 15,
		maxWidth: "80%",
		fontFamily: "ALSSiriusRegular",
	},
	incomeText: {
		fontSize: 13,
		color: "#919DA6",
		fontFamily: "ALSSiriusRegular",
	},
	expenseText: {
		fontSize: 13,
		color: "#919DA6",
		fontFamily: "ALSSiriusRegular",
	},
	amountContainer: {
		marginLeft: "auto",
		alignItems: "flex-end",
	},
	incomeAmount: {
		fontSize: 15,
		color: "#00B268",
		fontFamily: "ALSSiriusMedium",
	},
	expenseAmount: {
		fontSize: 15,
		color: "#292C30",
		fontFamily: "ALSSiriusMedium",
	},
	updatedTimeText: {
		fontSize: 13,
		color: "#919DA6",
		fontFamily: "ALSSiriusRegular",
	},
});

export default Report;
