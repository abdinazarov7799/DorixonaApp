import {HistoryBottomSheet} from "@/components/history";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useRouter} from "expo-router";
import {useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {
	FlatList,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from "react-native";

const data = [
	{
		id: 1,
		createdAt: "2021-09-01T12:00:00",
		status: "pending",
		type: "transfer",
		amount: -120000,
		cardType: "Uzcard",
		cardNumber: "9860010187569345",
	},
	{
		id: 2,
		createdAt: "2021-09-01T12:00:00",
		status: "success",
		type: "order",
		orderNumber: "8921734",
		sender: "Grandpharm",
		cardType: "Uzcard",
		amount: 1650000,
		cardNumber: "9860010187569345",
	},
	{
		id: 3,
		createdAt: "2021-09-01T12:00:00",
		status: "success",
		type: "order",
		orderNumber: "89249983",
		sender: "OXY med",
		amount: 110000,
		cardType: "Uzcard",
		cardNumber: "9860010187569345",
	},
	{
		id: 4,
		createdAt: "2021-09-01T12:00:00",
		status: "success",
		type: "order",
		orderNumber: "8929382",
		sender: "Grandpharm",
		amount: 78000,
		cardType: "Uzcard",
		cardNumber: "9860010187569345",
	},
	{
		id: 5,
		createdAt: "2021-09-01T12:00:00",
		status: "success",
		type: "transfer",
		amount: -460000,
		cardType: "Humo",
		cardNumber: "9860010143567489",
	},
	{
		id: 6,
		createdAt: "2021-09-01T12:00:00",
		status: "success",
		type: "order",
		orderNumber: "8929382",
		sender: "Grandpharm",
		amount: 78000,
		cardType: "Uzcard",
		cardNumber: "9860010187569345",
	},
];

const Report = () => {
	const [transaction, setTransaction] = useState<ActionItemProps | null>(null);
	const minHeight = useWindowDimensions().height;
	const sheetRef = useRef<BottomSheetModal>(null);

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
			<View className="flex-1 bg-[#F5F6F7] relative pt-4" style={{minHeight}}>
				<View className="flex-1 px-4">
					<FlatList
						data={data as ActionItemProps[]}
						keyExtractor={item => item.id.toString()}
						renderItem={({item}) => (
							<ActionItem {...item} onPress={handlePress( item)} />
						)}
					/>
				</View>
			</View>
		</>
	);
};

export type ActionItemProps = {
	id: number;
	type: "transfer" | "order";
	status: "success" | "pending";
	cardType?: string;
	cardNumber?: string;
	sender?: string;
	amount?: number;
	orderNumber?: string;
	createdAt?: string;
	onPress: () => void;
};

function ActionItem({
	type,
	amount,
	cardNumber,
	cardType,
	orderNumber,
	createdAt,
	status,
	sender,
	onPress,
}: ActionItemProps) {
	const {t} = useTranslation();

	const ActionTypes = useMemo(
		() => ({
			transfer: (
				<TouchableOpacity className="flex-row mb-4" onPress={onPress}>
					<View className="w-10 h-10 relative rounded-full justify-center items-center bg-[#B4C0CC29] mr-3 ">
						<FontAwesome5 name="arrow-up" size={18} color="#292C30" />

						{status === "pending" && (
							<View className="absolute bottom-0 right-0">
								<Ionicons name="time" size={16} color="black" />
							</View>
						)}
					</View>
					<View>
						<Text className="text-[15px]">{t("Pul o'tkazish")}</Text>
						<Text className="text-[13px] text-[#919DA6]">
							{cardType} ····{String(cardNumber)?.slice(-4)}
						</Text>
						{status === "pending" && (
							<Text className="text-[13px] text-[#FA8042]">
								{t("Kutilmoqda")}
							</Text>
						)}
					</View>
					<View className="ml-auto">
						<Text className="text-[15px] text-[#292C30] font-medium">
							{Number(amount).toLocaleString("ru-RU")} so'm
						</Text>
						<Text className="text-[13px] text-[#919DA6] text-right">
							{new Date(createdAt!).toLocaleString("ru-RU", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					</View>
				</TouchableOpacity>
			),
			order: (
				<TouchableOpacity className="flex-row mb-4" onPress={onPress}>
					<View className="w-10 h-10 rounded-full justify-center items-center bg-[#B4C0CC29] mr-3">
						<FontAwesome5 name="arrow-down" size={18} color="#292C30" />
					</View>
					<View>
						<Text className="text-[15px]">
							{t(sender!)}
							{/* {orderNumber} */}
						</Text>
						<Text className="text-[13px] text-[#919DA6]">{t("Tushum")}</Text>
					</View>
					<View className="ml-auto">
						<Text className="text-[15px] text-[#00B268] font-medium">
							{Number(amount).toLocaleString("ru-RU")} so'm
						</Text>
					</View>
				</TouchableOpacity>
			),
		}),
		[type]
	);

	return ActionTypes[type];
}

export default Report;
