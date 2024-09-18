import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Button} from "native-base";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Image, Pressable, ScrollView, Text, View} from "react-native";

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

const Index = () => {
	const [myCards] = useState(cards);
	const router = useRouter();
	const {t} = useTranslation();
	const handleNavigateToCard = (id: number) => () => {
		router.push(`/cards/${id}`);
	};
	return (
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
						{t("Kartalarim")}
					</Text>
				</View>
			</View>
			<ScrollView className="flex-1 px-4">
				{myCards.map(card => (
					<Card
						key={card.id}
						{...card}
						onPress={handleNavigateToCard(card.id)}
					/>
				))}
			</ScrollView>
			<View
				className={
					"absolute bottom-0 z-10 w-[100vw] h-[114px] p-[12px] bg-white border-t border-[#919DA63D]"
				}
			>
				<Button
					disabled={myCards.length >= 2}
					className={"bg-[#215ca0] w-full h-[44px] rounded-lg"}
				>
					<Text className={"text-white font-medium text-[16px]"}>
						{t("Yangi karta qo'shish")}
					</Text>
				</Button>
				<Text className="text-[13px] text-[#919DA6] text-center mt-2 mx-auto w-3/4">
					{t("Umumiy 2 tadan ortiq karta qo'shish mumkin emas")}
				</Text>
			</View>
		</View>
	);
};

type CardProps = {
	cardType: string;
	cardName: string;
	cardNumber: string;
	id: number;
	onPress?: () => void;
	balance: number;
};

const Card = ({
	balance,
	cardName,
	cardNumber,
	cardType,
	onPress,
}: CardProps) => {
	return (
		<Pressable
			className="border border-[#919DA63D] rounded-lg px-4 py-3 flex-row mb-4"
			onPress={onPress}
		>
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
		</Pressable>
	);
};

export default Index;
