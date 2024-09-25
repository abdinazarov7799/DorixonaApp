import CardCarousel from "@/components/shared/carousel/carousel";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Button} from "native-base";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {
	Image,
	Pressable,
	Text,
	TextInput,
	View,
	useWindowDimensions, TouchableOpacity,
} from "react-native";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {ENDPOINTS, KEYS} from "@/constants";

const Index = () => {
	const [focused, setFocused] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const [amount,setAmount] = useState(0);
	const minHeight = useWindowDimensions().height;
	const {balance} = useLocalSearchParams()
	const { data:myCards } = useFetchRequest({
		queryKey: KEYS.card_list,
		endpoint: ENDPOINTS.card_list,
	})
	const router = useRouter();
	const {t} = useTranslation();
	const hasCards = myCards?.length > 0;

	return (
		<View
			className="flex-1 bg-[#F5F6F7] relative pt-[90px] "
			style={{minHeight}}
		>
			<View className="absolute top-0 w-[100vw] py-[17px] px-[20px] flex-row justify-between border-b border-[#919DA63D]">
				<View className="flex-row items-center gap-4">
					<Ionicons
						name="arrow-back"
						size={24}
						color="#215ca0"
						onPress={() => router.back()}
					/>
					<Text className={"ml-[16px] font-medium text-[18px]"}>
						{t("Kartaga pul o'tkazish")}
					</Text>
				</View>
			</View>

			<View className="px-4 mb-5">
				<Text className="text-[13px] font-medium text-[#919DA6]">
					{t("Qayerdan")}
				</Text>
				<View className="p-4 flex-row bg-white mt-3 rounded-lg items-center">
					<View>
						<Text className="text-[#656E78] text-[13px]">Mening hisobim</Text>
						<Text className="text-[#292C30] text-[16px] font-medium">
							{Number(balance).toLocaleString("ru-RU")} so'm
						</Text>
					</View>
					<View className="h-8 w-8 overflow-hidden ml-auto">
						<Ionicons name="wallet-sharp" size={32} color="#215ca0" />
					</View>
				</View>
			</View>
			<View>
				<Text className="text-[13px] font-medium text-[#919DA6] px-4">
					{t("Qayerga")}
				</Text>
				{hasCards ? (
					<CardCarousel
						myCards={myCards}
						activeIndex={activeIndex}
						setActiveIndex={index => setActiveIndex(index)}
					/>
				) : (
					<TouchableOpacity className="px-4" onPress={() => router.push('/cards/add')}>
						<View className="px-4 py-6 flex-row bg-white mt-3 rounded-lg items-center justify-center">
							<FontAwesome5 name={"plus-circle"} size={24} color="#292C30" />
							<Text className="ml-4 text-[15px]">{t("Karta qo'shish")}</Text>
						</View>
						<Text className="text-[13px] font-medium text-[#919DA6] mt-3">
							{t(
								"Pul o'tkazishdan oldin pul o'tkazmoqchi bo'lgan kartangizni qo'shishingiz kerak"
							)}
						</Text>
					</TouchableOpacity>
				)}
			</View>
			<View className="flex-1 bg-white px-4 py-6 mt-6 rounded-3xl">
				<Text className="">{t("O'tkazma summasi")}</Text>
				<View className="flex-row items-center mt-4 ">
					<TextInput
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
						value={amount}
						onChangeText={(amount) => setAmount(amount)}
						keyboardType="numeric"
						className="text-2xl font-semibold mr-auto"
						placeholder="0 so'm"
						placeholderTextColor={"#292C30"}
					/>
					{focused && (
						<Ionicons
							name="close"
							size={24}
							color="#292C30"
							className="ml-auto"
						/>
					)}
				</View>
				<View
					className="w-full border-t my-4"
					style={{borderTopColor: focused ? "#246BB2" : "#e2e8f0"}}
				/>
				<Text className="text-[13px] font-medium text-[#919DA6]">
					{t("Maksimal summa - ")}
					{Number(balance).toLocaleString("ru-RU")} so'm
				</Text>

				<Button
					onPress={() =>
						router.push(
							`/transfer/info?cardNumber=${myCards[activeIndex].number}&cardId=${myCards[activeIndex]?.id}&amount=${amount}`
						)
					}
					className={"bg-[#215ca0] w-full h-[48px] rounded-lg mt-auto"}
				>
					<Text className={"text-white font-medium text-[16px]"}>
						{t("Pulni o'tkazish")}
					</Text>
				</Button>
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
