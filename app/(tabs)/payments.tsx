import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import {Button, Center} from "native-base";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import { ENDPOINTS, KEYS } from "@/constants";
import { get } from "lodash";

export default function TabPaymentsScreen() {
	const router = useRouter();
	const { t } = useTranslation();
	const [cards] = useState([{}]);
	const hasCards = cards.length > 0;

	const { data: balance } = useFetchRequest({
		queryKey: KEYS.transaction_info,
		endpoint: ENDPOINTS.transaction_info,
	});
	const { data } = useFetchRequest({
		queryKey: `${KEYS.transaction_history_list}_get_10`,
		endpoint: ENDPOINTS.transaction_history_list,
		params: {
			pageSize: 10,
		},
	});

	const handleAddCard = () => router.push("/cards/add");
	const handleTransfer = () => router.push(`/transfer?balance=${get(balance, 'balance')}`);
	const handleNavigateToCards = () => router.push("/cards");
	const handleNavigateToHistory = () => router.push("/(tabs)/report");

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.accountLabel}>{t("Mening hisobim")}</Text>
				<Text style={styles.balanceText}>
					{Number(get(balance, 'balance', 0))?.toLocaleString("en-US")} {t("so'm")}
				</Text>
				{!hasCards && (
					<Text style={styles.noCardText}>
						{t("Hisobingizdagi pulni o'tkazish uchun sizda karta mavjud emas")}
					</Text>
				)}
				<View style={styles.buttonsContainer}>
					<Button
						shadow={1}
						style={styles.actionButton}
						onPress={handleTransfer}
					>
						<View style={styles.buttonContent}>
							<FontAwesome5 name="arrow-circle-up" size={24} color="white" />
							<Text style={styles.buttonText}>{t("Pul o'tkazish")}</Text>
						</View>
					</Button>
					<Button
						shadow={1}
						style={styles.actionButton}
						onPress={hasCards ? handleNavigateToCards : handleAddCard}
					>
						<View style={styles.buttonContent}>
							<FontAwesome5
								name={hasCards ? "credit-card" : "plus-circle"}
								size={24}
								color="white"
							/>
							<Text style={styles.buttonText}>
								{hasCards ? t("Kartalarim") : t("Karta qo'shish")}
							</Text>
						</View>
					</Button>
				</View>
			</View>
			<View style={styles.transactionsContainer}>
				<View style={styles.transactionsHeader}>
					<Text style={styles.transactionsTitle}>{t("Oxirgi amallar")}</Text>
					<Button
						onPress={handleNavigateToHistory}
						style={styles.viewAllButton}
					>
						<View style={styles.viewAllContent}>
							<Text style={styles.viewAllText}>{t("Barchasi")}</Text>
							<FontAwesome5 name="chevron-right" size={16} color="black" />
						</View>
					</Button>
				</View>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={get(data, 'content', [])}
					keyExtractor={item => String(item?.number)}
					ListEmptyComponent={
						<Center style={styles.emptyContainer}>
							<Text style={styles.emptyText}>{t("No data")}</Text>
						</Center>
					}
					renderItem={({ item: { id, ...action } }) => <ActionItem {...action} />}
				/>
			</View>
		</View>
	);
}

type ActionItemProps = {
	id: number;
	type: "INCOME" | "EXPENSE";
	status: "DONE" | "PENDING";
	amount: number;
	pharmacy: string;
	number: number;
	updatedTime: string | null;
	onPress: () => void;
};

function ActionItem({
						type,
						amount,
						pharmacy,
						updatedTime,
						onPress,
					}: ActionItemProps) {
	const { t } = useTranslation();

	const ActionTypes = useMemo(
		() => ({
			INCOME: (
				<TouchableOpacity style={styles.actionItemContainer} onPress={onPress}>
					<View style={styles.incomeIcon}>
						<FontAwesome5 name="arrow-down" size={18} color="#292C30" />
					</View>
					<View>
						<Text style={styles.actionItemTitle} numberOfLines={1} ellipsizeMode="tail">
							{t(pharmacy)}
						</Text>
						<Text style={styles.incomeText}>{t("Tushum")}</Text>
					</View>
					<View style={styles.amountContainer}>
						<Text style={styles.incomeAmount}>
							{Number(amount)?.toLocaleString("en-US")} {t("so'm")}
						</Text>
						{updatedTime && (
							<Text style={styles.timeText}>
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
					<View style={styles.expenseIcon}>
						<FontAwesome5 name="arrow-up" size={18} color="#292C30" />
					</View>
					<View>
						<Text style={styles.actionItemTitle} numberOfLines={1} ellipsizeMode="tail">
							{t(pharmacy)}
						</Text>
						<Text style={styles.expenseText}>{t("Chiqim")}</Text>
					</View>
					<View style={styles.amountContainer}>
						<Text style={styles.expenseAmount}>
							{Number(amount)?.toLocaleString("en-US")} {t("so'm")}
						</Text>
						{updatedTime && (
							<Text style={styles.timeText}>
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
		paddingTop: 20,
	},
	headerContainer: {
		paddingHorizontal: 16,
	},
	accountLabel: {
		fontFamily: "ALSSiriusRegular",
	},
	balanceText: {
		fontSize: 28,
		fontFamily: "ALSSiriusRegular",
		paddingVertical: 8,
	},
	noCardText: {
		width: "75%",
		fontSize: 13,
		color: "#919DA6",
		fontFamily: "ALSSiriusRegular",
		marginBottom: 16,
	},
	buttonsContainer: {
		flexDirection: "row",
		gap: 8,
		marginTop: 8,
	},
	actionButton: {
		flex: 1,
		backgroundColor: "#246BB2",
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 8,
		paddingVertical: 12,
	},
	buttonContent: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	buttonText: {
		color: "white",
		fontFamily: "ALSSiriusRegular",
	},
	transactionsContainer: {
		flex: 1,
		backgroundColor: "white",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		marginTop: 24,
		padding: 16,
	},
	transactionsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
	},
	transactionsTitle: {
		fontSize: 20,
		fontFamily: "ALSSiriusBold",
	},
	viewAllButton: {
		borderRadius: 16,
		backgroundColor: "#919DA63D",
		paddingVertical: 4,
	},
	viewAllContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	viewAllText: {
		fontFamily: "ALSSiriusMedium",
	},
	actionItemContainer: {
		flexDirection: "row",
		marginBottom: 16,
	},
	incomeIcon: {
		width: 40,
		height: 40,
		backgroundColor: "#B4C0CC29",
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	expenseIcon: {
		width: 40,
		height: 40,
		backgroundColor: "#B4C0CC29",
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	actionItemTitle: {
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
	timeText: {
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
