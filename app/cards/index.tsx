import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Button} from "native-base";
import {useTranslation} from "react-i18next";
import {Image, Pressable, ScrollView, Text, View} from "react-native";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {ENDPOINTS, KEYS} from "@/constants";

const Index = () => {
	const router = useRouter();
	const {t} = useTranslation();
	const { data, isLoading } = useFetchRequest({
		queryKey: KEYS.card_list,
		endpoint: ENDPOINTS.card_list,
	})

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
					<Text className={"ml-[16px] font-ALSSiriusMedium text-[18px]"}>
						{t("Kartalarim")}
					</Text>
				</View>
			</View>
			<ScrollView className="flex-1 px-4">
				{data?.map(card => (
					<Card
						key={card.id}
						cardNumber={card?.number}
						cardName={card?.name}
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
					onPress={() => router.push('/cards/add')}
					disabled={data?.length >= 2}
					className={"bg-[#215ca0] w-full h-[44px] rounded-lg"}
				>
					<Text className={"text-white font-ALSSiriusMedium text-[16px]"}>
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
			className="border border-[#919DA63D] rounded-lg px-4 py-3 flex-row items-center mb-4"
			onPress={onPress}
		>
			<View>
				<Text className="text-[13px] text-[#656E78]">
					{cardName}{cardName && " ···· "}{String(cardNumber).slice(-4)}
				</Text>
			</View>
			<View className="ml-auto max-h-8 h-8 max-w-12 w-12 ">
				<Image
					resizeMode="contain"
					style={{height: "100%", width: "100%"}}
					source={
						String(cardNumber).substring(0,4) == "8600"
							? require("@/assets/images/uzcard.png")
							: require("@/assets/images/humo.png")
					}
				/>
			</View>
		</Pressable>
	);
};

export default Index;
