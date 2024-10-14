import {HistoryBottomSheet} from "@/components/history";
import {FontAwesome5} from "@expo/vector-icons";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import React, {useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {
	FlatList,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions, RefreshControl, ActivityIndicator,
} from "react-native";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {ENDPOINTS, KEYS} from "@/constants";

const Report = () => {
	const [transaction, setTransaction] = useState<ActionItemProps | null>(null);
	const minHeight = useWindowDimensions().height;
	const sheetRef = useRef<BottomSheetModal>(null);
	const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage } = useInfiniteScroll({
		key: KEYS.transaction_history_list,
		url: ENDPOINTS.transaction_history_list,
		limit: 20,
	});

	const handlePress =
		(item: ActionItemProps) => () => {
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
			<View className="flex-1 bg-[#F5F6F7] relative pt-4" style={{ minHeight }}>
				<View className="flex-1 px-4">
					<FlatList
						data={data as ActionItemProps[]}
						onEndReached={onEndReached}
						refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
						keyExtractor={(item) => item?.number}
						renderItem={({ item }) => (
							<ActionItem {...item} onPress={handlePress(item)} />
						)}
						ListFooterComponent={
							<View style={{
								flexDirection: 'row',
								height: 100,
								justifyContent: 'center',
								alignItems: 'center',
							}}>
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
				<TouchableOpacity className="flex-row mb-4" onPress={onPress}>
					<View className="w-10 h-10 rounded-full justify-center items-center bg-[#B4C0CC29] mr-3">
						<FontAwesome5 name="arrow-down" size={18} color="#292C30" />
					</View>
					<View>
						<Text className="text-[15px] max-w-[80%] font-ALSSiriusRegular" numberOfLines={1} ellipsizeMode="tail">
							{t(pharmacy)}
						</Text>
						<Text className="text-[13px] text-[#919DA6] font-ALSSiriusRegular">{t("Tushum")}</Text>
					</View>
					<View className="ml-auto">
						<Text className="text-[15px] text-[#00B268] font-ALSSiriusMedium">
							{Number(amount)?.toLocaleString("en-US")} {t("so'm")}
						</Text>
						{updatedTime && (
							<Text className="text-[13px] text-[#919DA6] text-right font-ALSSiriusRegular">
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
				<TouchableOpacity className="flex-row mb-4" onPress={onPress}>
					<View className="w-10 h-10 rounded-full justify-center items-center bg-[#B4C0CC29] mr-3">
						<FontAwesome5 name="arrow-up" size={18} color="#292C30" />
					</View>
					<View>
						<Text className="text-[15px] max-w-[80%] font-ALSSiriusRegular" numberOfLines={1} ellipsizeMode="tail">
							{t(pharmacy)}
						</Text>
						<Text className="text-[13px] text-[#919DA6] font-ALSSiriusRegular">{t("Chiqim")}</Text>
					</View>
					<View className="ml-auto">
						<Text className="text-[15px] text-[#292C30] font-ALSSiriusMedium">
							{Number(amount)?.toLocaleString("en-US")} {t("so'm")}
						</Text>
						{updatedTime && (
							<Text className="text-[13px] text-[#919DA6] text-right font-ALSSiriusRegular">
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


export default Report;
