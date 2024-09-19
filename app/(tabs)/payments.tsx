import {Button} from "native-base";
import {useTranslation} from "react-i18next";
import {FlatList, Text, View} from "react-native";
import React, {useMemo, useState} from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {useRouter} from "expo-router";

const data = [
	{
		id: 1,
		type: "transfer",
		amount: -120000,
		cardType: "Uzcard",
		cardNumber: "9860010187569345",
	},
	{
		id: 2,
		type: "order",
		orderNumber: "8921734",
		amount: 1650000,
	},
	{
		id: 3,
		type: "order",
		orderNumber: "89249983",
		amount: 110000,
	},
	{
		id: 4,
		type: "order",
		orderNumber: "8929382",
		amount: 78000,
	},
	{
		id: 5,
		type: "transfer",
		amount: -460000,
		cardType: "Humo",
		cardNumber: "9860010143567489",
	},
];

export default function TabPaymentsScreen() {
	const router = useRouter();
	const {t} = useTranslation();
	const [cards] = useState([{}]);
	const [myBalance] = useState(12000000);
	const hasCards = cards.length > 0;

	const handleAddCard = () => {
		router.push("/cards/add");
	};
	const handleTransfer = () => {
		router.push("/transfer");
	};
	const handleNavigateToCards = () => {
		router.push("/cards");
	};
	const handleNavigateToHistory = () => {
		router.push("/history");
	};
	return (
		<View className="flex-1 bg-[#F5F6F7] pt-10">
			<View className="px-4">
				<Text>{t("Mening hisobim")}</Text>
				<Text className="text-[28px] font-bold py-2">
					{Number(myBalance).toLocaleString("ru-RU")} so'm
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
					<Text className="text-xl font-bold">{t("Oxirgi amallar")}</Text>
					<Button
						onPress={handleNavigateToHistory}
						className="rounded-full py-1 bg-[#919DA63D] text-black"
					>
						<View className="flex-row justify-between items-center gap-3">
							<Text className="font-medium">{t("Barchasi")}</Text>
							<FontAwesome5 name="chevron-right" size={16} color="black" />
						</View>
					</Button>
				</View>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={data as ActionItemProps[] & {id: number}[]}
					keyExtractor={item => String(item.id)}
					renderItem={({item: {id, ...action}}) => <ActionItem {...action} />}
				/>
			</View>
		</View>
	);
}

type ActionItemProps = {
	type: "transfer" | "order";
	cardType?: string;
	cardNumber?: string;
	amount?: number;
	orderNumber?: string;
};

function ActionItem({
	type,
	amount,
	cardNumber,
	cardType,
	orderNumber,
}: ActionItemProps) {
	const {t} = useTranslation();

	const ActionTypes = useMemo(
		() => ({
			transfer: (
				<View className="flex-row mb-4">
					<View className="w-10 h-10 rounded-full justify-center items-center bg-[#B4C0CC29] mr-3">
						<FontAwesome5 name="arrow-up" size={18} color="#292C30" />
					</View>
					<View>
						<Text className="text-[15px]">{t("Pul o'tkazish")}</Text>
						<Text className="text-[13px] text-[#919DA6]">
							{cardType} ····{String(cardNumber)?.slice(-4)}
						</Text>
					</View>
					<View className="ml-auto">
						<Text className="text-[15px] text-[#292C30] font-medium">
							{Number(amount).toLocaleString("ru-RU")} so'm
						</Text>
					</View>
				</View>
			),
			order: (
				<View className="flex-row mb-4">
					<View className="w-10 h-10 rounded-full justify-center items-center bg-[#B4C0CC29] mr-3">
						<FontAwesome5 name="arrow-down" size={18} color="#292C30" />
					</View>
					<View>
						<Text className="text-[15px]">
							{t("Buyurtma #")}
							{orderNumber}
						</Text>
						<Text className="text-[13px] text-[#919DA6]">{t("Tushum")}</Text>
					</View>
					<View className="ml-auto">
						<Text className="text-[15px] text-[#00B268] font-medium">
							{Number(amount).toLocaleString("ru-RU")} so'm
						</Text>
					</View>
				</View>
			),
		}),
		[type]
	);

	return ActionTypes[type];
}
