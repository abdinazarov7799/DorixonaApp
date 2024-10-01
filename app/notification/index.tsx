import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
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
		title: "Buyurtma tasdiqlandi",
		description:
			"#4348934923 buyurtmadan sizning hisobingizga 1 245 000 so‘m o‘tkazildi",
		createdAt: "2021-09-01T12:00:00",
		read: false,
	},
	{
		id: 2,
		title: "Buyurtma qabul qilindi",
		description: "#4348934923 buyurtmangiz qabul qilindi",
		createdAt: "2021-09-01T12:00:00",
		read: true,
	},
	{
		id: 3,
		title: "Buyurtma yuborildi",
		description: "#4348934923 buyurtmangiz yuborildi",
		createdAt: "2021-09-01T12:00:00",
		read: true,
	},
	{
		id: 4,
		title: "Buyurtma tasdiqlandi",
		description:
			"#4348934923 buyurtmadan sizning hisobingizga 1 245 000 so‘m o‘tkazildi",
		createdAt: "2021-09-01T12:00:00",
		read: false,
	},
	{
		id: 5,
		title: "Buyurtma qabul qilindi",
		description: "#4348934923 buyurtmangiz qabul qilindi",
		createdAt: "2021-09-01T12:00:00",
		read: true,
	},
	{
		id: 6,
		title: "Buyurtma yuborildi",
		description: "#4348934923 buyurtmangiz yuborildi",
		createdAt: "2021-09-01T12:00:00",
		read: true,
	},
	{
		id: 7,
		title: "Buyurtma tasdiqlandi",
		description:
			"#4348934923 buyurtmadan sizning hisobingizga 1 245 000 so‘m o‘tkazildi",
		createdAt: "2021-09-01T12:00:00",
		read: false,
	},
	{
		id: 8,
		title: "Buyurtma qabul qilindi",
		description: "#4348934923 buyurtmangiz qabul qilindi",
		createdAt: "2021-09-01T12:00:00",
		read: true,
	},
];

const Index = () => {
	const {t} = useTranslation();
	const router = useRouter();
	const minHeight = useWindowDimensions().height;
	return (
		<View
			className="flex-1 bg-[#F5F6F7] relative pt-[60px] "
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
					<Text className={"ml-[16px] font-ALSSiriusMedium text-[18px]"}>
						{t("Xabarnomalar")}
					</Text>
				</View>
			</View>
			<FlatList
				keyExtractor={item => item.id.toString()}
				data={data}
				renderItem={({item}) => (
					<TouchableOpacity className="p-4 pl-0 border-b border-[#919DA63D] flex-row">
						<View className="w-2 justify-center items-center px-3">
							<View
								className={`w-2 h-2 rounded-full ${
									item.read && "bg-[#215CA0]"
								}`}
							/>
						</View>
						<View className="flex-1">
							<View className="flex-row items-center">
								<Text className="font-ALSSiriusMedium text-[15px]">{item.title}</Text>
								<Text className="ml-auto mr-1 text-[13px] text-[#919DA6]">
									{new Date(item.createdAt).toLocaleString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Text>
								<Ionicons name="chevron-forward" size={14} color="#215ca0" />
							</View>
							<Text className="text-[13px] text-[#919DA6]">
								{item.description}
							</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
};

export default Index;
