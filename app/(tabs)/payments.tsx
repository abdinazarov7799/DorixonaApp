import {Button} from "native-base";
import {useTranslation} from "react-i18next";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import React, {useMemo, useState} from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {useRouter} from "expo-router";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {ENDPOINTS, KEYS} from "@/constants";
import {get} from "lodash";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";

export default function TabPaymentsScreen() {
	const router = useRouter();
	const {t} = useTranslation();
	const [cards] = useState([{}]);
	const hasCards = cards.length > 0;

	const { data:balance } = useFetchRequest({
		queryKey: KEYS.transaction_info,
		endpoint: ENDPOINTS.transaction_info
	})
	const { data } = useFetchRequest({
		queryKey: KEYS.transaction_history_list,
		endpoint: ENDPOINTS.transaction_history_list,
		params: {
			pageSize: 10,
		}
	});

	const handleAddCard = () => {
		router.push("/cards/add");
	};
	const handleTransfer = () => {
		router.push(`/transfer?balance=${get(balance,'balance')}`);
	};
	const handleNavigateToCards = () => {
		router.push("/cards");
	};
	const handleNavigateToHistory = () => {
		router.push("/(tabs)/report");
	};
	return (
		<View className="flex-1 bg-[#F5F6F7] pt-10">
			<View className="px-4">
				<Text>{t("Mening hisobim")}</Text>
				<Text className="text-[28px] font- py-2">
					{Number(get(balance,'balance')).toLocaleString("en-US")} {t("so'm")}
				</Text>
				{!hasCards && (
					<Text className="w-3/4 text-[13px] text-[#919DA6] mb-4">
						{t("Hisobingizdagi pulni o'tkazish uchun sizda karta mavjud emas")}
					</Text>
				)}
				<View className="flex flex-row gap-2 mt-2">
					<Button
						shadow={1}
						className="flex-1 bg-[#246BB2] flex flex-row items-center rounded-lg px-4 py-3"
						onPress={handleTransfer}
					>
						<View className="w-full flex-row items-center gap-3">
							<FontAwesome5 name="arrow-circle-up" size={24} color="white" />
							<Text className="text-white">{t("Pul o'tkazish")}</Text>
						</View>
					</Button>
					<Button
						shadow={1}
						className="flex-1 bg-[#246BB2] flex flex-row items-center rounded-lg px-4 py-3"
						onPress={hasCards ? handleNavigateToCards : handleAddCard}
					>
						<View className="w-full flex-row items-center gap-3">
							<FontAwesome5
								name={hasCards ? "credit-card" : "plus-circle"}
								size={24}
								color="white"
							/>
							<Text className="text-white">
								{hasCards ? t("Kartalarim") : t("Karta qo'shish")}
							</Text>
						</View>
					</Button>
				</View>
			</View>
			<View className="bg-white flex-1 rounded-t-3xl mt-6 p-4">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-ALSSiriusBold">{t("Oxirgi amallar")}</Text>
					<Button
						onPress={handleNavigateToHistory}
						className="rounded-full py-1 bg-[#919DA63D] text-black"
					>
						<View className="flex-row justify-between items-center gap-3">
							<Text className="font-ALSSiriusMedium">{t("Barchasi")}</Text>
							<FontAwesome5 name="chevron-right" size={16} color="black" />
						</View>
					</Button>
				</View>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={get(data,'content',[]) as ActionItemProps[] & {id: number}[]}
					keyExtractor={item => String(item.id)}
					renderItem={({item: {id, ...action}}) => <ActionItem {...action} />}
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
						number,
						pharmacy,
						status,
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
						<Text className="text-[15px] max-w-[80%]" numberOfLines={1} ellipsizeMode="tail">
							{t(pharmacy)}
						</Text>
						<Text className="text-[13px] text-[#919DA6]">{t("Tushum")}</Text>
					</View>
					<View className="ml-auto">
						<Text className="text-[15px] text-[#00B268] font-ALSSiriusMediumm">
							{Number(amount).toLocaleString("en-US")} {t("so'm")}
						</Text>
						{updatedTime && (
							<Text className="text-[13px] text-[#919DA6] text-right">
								{new Date(updatedTime).toLocaleString("en-US", {
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
						<Text className="text-[15px]">
							{t(pharmacy)}
						</Text>
						<Text className="text-[13px] text-[#919DA6]">{t("Chiqim")}</Text>
					</View>
					<View className="ml-auto">
						<Text className="text-[15px] text-[#292C30] font-ALSSiriusMedium">
							{Number(amount).toLocaleString("en-US")} {t("so'm")}
						</Text>
						{updatedTime && (
							<Text className="text-[13px] text-[#919DA6] text-right">
								{new Date(updatedTime).toLocaleString("en-US", {
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