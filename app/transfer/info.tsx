import {Ionicons} from "@expo/vector-icons";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Button} from "native-base";
import {useTranslation} from "react-i18next";
import {Image, Text, View} from "react-native";

const Info = () => {
	const router = useRouter();
	const {cardNumber} = useLocalSearchParams();
	console.log(cardNumber);
	const {t} = useTranslation();
	return (
		<View className="flex-1 bg-[#F5F6F7] relative pt-[90px]">
			<View className="absolute top-0 w-[100vw] py-[17px] px-[20px] flex-row justify-between border-b border-[#919DA63D]">
				<View className="flex-row items-center gap-4">
					<Ionicons
						name="close"
						size={24}
						color="#215ca0"
						onPress={() => router.replace("/payments")}
					/>
				</View>
			</View>
			<View className="flex-1 items-center pt-20 pb-6 px-6">
				<Image
					source={require("@/assets/images/exclamation.png")}
					className="w-20 h-20"
				/>
				<Text className="text-xl text-center w-3/4 font-semibold">
					{t("So'rov yuborildi, pul o'tkazish kutilmoqda")}
				</Text>
				<View className="pt-10 gap-3">
					<View className="flex-row justify-between w-full">
						<Text className="text-[15px] text-[#919DA6]">
							{t("Qabul qiluvchi karta")}
						</Text>
						<Text className="text-[15px]">{t(cardNumber)}</Text>
					</View>
					<View className="flex-row justify-between w-full">
						<Text className="text-[15px] text-[#919DA6]">
							{t("So'rov yuborilgan vaqti")}
						</Text>
						<Text className="text-[15px]">{t("18-avgust, 09:28")}</Text>
					</View>
					<View className="flex-row justify-between w-full">
						<Text className="text-[15px] text-[#919DA6]">
							{t("Tranzaksiya raqami")}
						</Text>
						<Text className="text-[15px]">{t("38941831")}</Text>
					</View>
					<View className="flex-row justify-between w-full">
						<Text className="text-[15px] text-[#919DA6]">
							{t("O'tkazma summasi")}
						</Text>
						<Text className="text-[15px]">{t("650 000")} so'm</Text>
					</View>
				</View>
				<Button
					className="mt-auto w-full rounded-lg bg-[#B4C0CC29]"
					onPress={() => router.replace("/payments")}
				>
					<Text className="text-[15px] text-[#292C30] font-medium">
						{t("Bosh oynaga qaytish")}
					</Text>
				</Button>
			</View>
		</View>
	);
};

export default Info;