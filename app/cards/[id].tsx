import {BaseBottomSheet} from "@/components/shared/bottom-sheet";
import {Ionicons} from "@expo/vector-icons";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Button} from "native-base";
import {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Image, Text, TextInput, View} from "react-native";

const cards = [
	{
		cardType: "uzcard",
		cardName: "Uzcard",
		cardNumber: "9860010187569345",
		id: 1,
		balance: 12000000,
	},
	{
		cardType: "humo",
		cardName: "Humo",
		cardNumber: "9860010143567489",
		id: 2,
		balance: 4600000,
	},
];

const CardScreen = () => {
	const router = useRouter();
	const {id} = useLocalSearchParams();
	const {t} = useTranslation();
	const deleteBottomSheetRef = useRef<BottomSheetModal>(null);
	const card = cards?.find(card => card.id === Number(id));

	const handleOpenDeleteBottomSheet = () => {
		deleteBottomSheetRef.current?.present();
	};

	const handleCloseDeleteBottomSheet = () => {
		deleteBottomSheetRef.current?.dismiss();
	};
	return (
		<>
			<DeleteBottomSheet
				bottomSheetRef={deleteBottomSheetRef}
				onClose={handleCloseDeleteBottomSheet}
			/>
			<View className="flex-1 bg-white relative pt-[80px] pb-[110px]">
				<View className="absolute top-0 w-[100vw] py-[17px] px-[20px] flex-row justify-between border-b border-[#919DA63D]">
					<View className="flex-row items-center gap-4">
						<Ionicons
							name="arrow-back"
							size={24}
							color="#215ca0"
							onPress={() => router.back()}
						/>
						<Text className={"ml-[16px] font-medium text-[18px]"}>
							{t("Karta sozlamalari")}
						</Text>
					</View>
				</View>

				<View className="px-4">
					<Card key={card?.id!} {...card!} />
					<View className="rounded-lg px-4 py-3 bg-[#B4C0CC29]">
						<Text className="text-[13px] text-[#656E78]">
							{t("Karta nomi (shart emas)")}
						</Text>
						<TextInput defaultValue={card?.cardName} />
					</View>
				</View>

				<View
					className={
						"absolute bottom-0 z-10 w-[100vw] h-[134px] p-[12px] bg-white border-t border-[#919DA63D] gap-2"
					}
				>
					<Button
						className={"bg-[#B4C0CC29] w-full h-[44px] rounded-lg"}
						onPress={handleOpenDeleteBottomSheet}
					>
						<Text className={"text-[#292C30] font-medium text-[16px]"}>
							{t("Kartani o'chirish")}
						</Text>
					</Button>
					<Button className={"bg-[#215ca0] w-full h-[44px] rounded-lg"}>
						<Text className={"text-white font-medium text-[16px]"}>
							{t("O'zgarishni saqlash")}
						</Text>
					</Button>
				</View>
			</View>
		</>
	);
};

type CardProps = {
	cardType: string;
	cardName: string;
	cardNumber: string;
	id: number;
	balance: number;
};

const Card = ({balance, cardName, cardNumber, cardType}: CardProps) => {
	return (
		<View className="border border-[#919DA63D] rounded-lg px-4 py-3 flex-row mb-4">
			<View>
				<Text className="text-[13px] text-[#656E78]">
					{cardName} ····{String(cardNumber).slice(-4)}
				</Text>
				<Text className="text-[#292C30] font-medium text-[16px]">
					{Number(balance).toLocaleString("ru-RU")} so'm
				</Text>
			</View>
			<View className="ml-auto max-h-8 h-8 max-w-12 w-12 ">
				<Image
					resizeMode="contain"
					style={{height: "100%", width: "100%"}}
					source={
						cardType === "uzcard"
							? require("@/assets/images/uzcard.jpg")
							: require("@/assets/images/humo.png")
					}
				/>
			</View>
		</View>
	);
};

type DeleteBottomSheetProps = {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	onClose: () => void;
};
const DeleteBottomSheet = ({
	bottomSheetRef,
	onClose,
}: DeleteBottomSheetProps) => {
	const {t} = useTranslation();
	return (
		<BaseBottomSheet bottomSheetRef={bottomSheetRef} snap={"35%"}>
			<View className="p-4 ">
				<Text className="text-2xl font-bold mb-2">
					{t("Kartangizni o'chirmoqchimisiz?")}
				</Text>
				<Text className="text-[15px] text-[#919DA6]">
					{t(
						"Chindan ham kartangizni oʻchirmoqchimisiz? Ehtimol behosdan bosilib ketgan boʻlishi mumkin."
					)}
				</Text>
				<View className="flex flex-row gap-3 mt-6">
					<Button className="flex-1 px-4 py-3 rounded-lg bg-[#E04917]">
						<Text className="text-[15px] font-medium text-white">
							{t("O'chirish")}
						</Text>
					</Button>
					<Button
						className="flex-1 px-4 py-3 rounded-lg bg-[#B4C0CC29]"
						onPress={onClose}
					>
						<Text className="text-[15px] font-medium text-[#292C30]">
							{t("Bekor qilish")}
						</Text>
					</Button>
				</View>
			</View>
		</BaseBottomSheet>
	);
};

export default CardScreen;
