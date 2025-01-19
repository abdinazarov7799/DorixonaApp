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
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ENDPOINTS, KEYS } from "@/constants";
import { HistoryBottomSheet } from "@/components/history";
import {Center} from "native-base";
import Loader from "@/components/shared/Loader";

const Report = () => {
	const [transaction, setTransaction] = useState<ActionItemProps | null>(null);
	const minHeight = useWindowDimensions().height;
	const sheetRef = useRef<BottomSheetModal>(null);
	const {t} = useTranslation();
	const { data, isLoading ,isRefreshing, onRefresh, onEndReached, isFetchingNextPage } = useInfiniteScroll({
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
					{
						isLoading ? <Loader /> : (
							<FlatList
								data={data as ActionItemProps[]}
								onEndReached={onEndReached}
								refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
								keyExtractor={(item) => item?.number}
								renderItem={({ item }) => (
									<ActionItem {...item} onPress={handlePress(item)} />
								)}
								ListEmptyComponent={
									<Center style={styles.emptyContainer}>
										<Text style={styles.emptyText}>{t("No data")}</Text>
									</Center>
								}
								ListFooterComponent={
									<View style={styles.footer}>
										{isFetchingNextPage && <ActivityIndicator />}
									</View>
								}
							/>
						)
					}
				</View>
			</View>
		</>
	);
};

export type ActionItemProps = {
	id: number;
	type: "INCOME" | "WITHDRAWAL";
	status: "DONE" | "PENDING" | "REJECTED";
	amount: number;
	pharmacy: string;
	number: number;
	createdTime: string | null;
	updatedTime: string | null;
	onPress: () => void;
	cardNumber: string
	cardName: string
};

function ActionItem({ type, amount, pharmacy, updatedTime, onPress, cardNumber, cardName, status }: ActionItemProps) {
	const { t } = useTranslation();
	const ActionTypes = useMemo(
		() => ({
			INCOME: (
				<TouchableOpacity style={styles.actionItemContainer} onPress={onPress}>
					<View style={styles.iconContainer}>
						{
							status == "REJECTED" ? (
								<FontAwesome5 name="ban" size={18} color="red" />
							) : (
								<FontAwesome5 name="arrow-down" size={18} color="#292C30" />
							)
						}

					</View>
					<View>
						<Text style={styles.pharmacyText} numberOfLines={1} ellipsizeMode="tail">
							{t(pharmacy)}
						</Text>
						<Text style={styles.incomeText}>{t("Tushum")}</Text>
					</View>
					<View style={styles.amountContainer}>
						<Text style={status == "REJECTED" ? styles.expenseAmount : styles.incomeAmount}>
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
			WITHDRAWAL: (
				<TouchableOpacity style={styles.actionItemContainer} onPress={onPress}>
					<View style={styles.iconContainer}>
						{
							status == "REJECTED" ? (
								<FontAwesome5 name="ban" size={18} color="red" />
							) : (
								<FontAwesome5 name="arrow-up" size={18} color="#292C30" />
							)
						}
						{status == "PENDING" && (
							<View style={{position: "absolute", bottom: 0, right: 0}}>
								<Ionicons name="time" size={16} color="black" />
							</View>
						)}
					</View>
					<View>
						<Text style={styles.pharmacyText2}>
							{t("Pul oʻtkazish")}
						</Text>
						<Text style={styles.expenseText}>
							{cardName}
							{cardName && " ···· "}
							{cardNumber}
						</Text>
						{status == "PENDING" && (
							<Text style={{fontSize: 13, color: "#FA8042"}}>
								{t("Kutilmoqda")}
							</Text>
						)}
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
	pharmacyText2: {
		fontSize: 15,
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

export default Report;
