import {Ionicons} from "@expo/vector-icons";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Button} from "native-base";
import {useTranslation} from "react-i18next";
import {Image, Text, View} from "react-native";
import usePostQuery from "@/hooks/api/usePostQuery";
import {useEffect, useState} from "react";
import {ENDPOINTS} from "@/constants";
import Loader from "@/components/shared/Loader";

const Info = () => {
	const router = useRouter();
	const {cardNumber,cardId,amount} = useLocalSearchParams();
	const {t} = useTranslation();
	const [data, setData] = useState({});
	const {mutate,isPending} = usePostQuery({})
	useEffect(() => {
		mutate({ endpoint: ENDPOINTS.withdraw, attributes: {cardId,amount}},{
			onSuccess: (res) => {
				setData(res)
			},
			onError: (res) => {
				setData(res)
			}
		});
	},[amount])

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
			{
				isPending ? <Loader /> : (
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
								<Text className="text-[15px]">{cardNumber}</Text>
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
								<Text className="text-[15px]">{Number(amount).toLocaleString("en-US")} {t("so'm")}</Text>
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
				)
			}
		</View>
	);
};

export default Info;
