import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button } from "native-base";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import { ENDPOINTS, KEYS } from "@/constants";

const Index = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const { data } = useFetchRequest({
		queryKey: KEYS.card_list,
		endpoint: ENDPOINTS.card_list,
	});

	const handleNavigateToCard = (id: number) => () => {
		router.push(`/cards/${id}`);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<Ionicons
						name="arrow-back"
						size={24}
						color="#215ca0"
						onPress={() => router.back()}
					/>
					<Text style={styles.headerText}>{t("Kartalarim")}</Text>
				</View>
			</View>
			<ScrollView style={styles.scrollView}>
				{data?.map((card) => (
					<Card
						key={card.id}
						cardNumber={card?.number}
						cardName={card?.name}
						onPress={handleNavigateToCard(card.id)}
					/>
				))}
			</ScrollView>
			<View style={styles.footer}>
				<Button
					onPress={() => router.push("/cards/add")}
					disabled={data?.length >= 2}
					style={styles.addButton}
				>
					<Text style={styles.addButtonText}>{t("Yangi karta qo'shish")}</Text>
				</Button>
				<Text style={styles.footerText}>
					{t("Umumiy 2 tadan ortiq karta qo'shish mumkin emas")}
				</Text>
			</View>
		</View>
	);
};

type CardProps = {
	cardType?: string;
	cardName: string;
	cardNumber: string;
	id?: number;
	onPress?: () => void;
	balance?: number;
};

const Card = ({ cardName, cardNumber, onPress }: CardProps) => {
	return (
		<Pressable style={styles.card} onPress={onPress}>
			<View>
				<Text style={styles.cardText}>
					{cardName}
					{cardName && " ···· "}
					{String(cardNumber).slice(-4)}
				</Text>
			</View>
			<View style={styles.cardImageContainer}>
				<Image
					resizeMode="contain"
					style={styles.cardImage}
					source={
						String(cardNumber).substring(0, 4) != "9860"
							? require("@/assets/images/uzcard.png")
							: require("@/assets/images/humo.png")
					}
				/>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		paddingTop: 80,
		paddingBottom: 110,
	},
	header: {
		position: "absolute",
		top: 0,
		width: "100%",
		paddingVertical: 17,
		paddingHorizontal: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "#919DA63D",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerText: {
		marginLeft: 16,
		fontFamily: "ALSSiriusMedium",
		fontSize: 18,
	},
	scrollView: {
		flex: 1,
		paddingHorizontal: 16,
	},
	footer: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		height: 114,
		padding: 12,
		backgroundColor: "white",
		borderTopWidth: 1,
		borderTopColor: "#919DA63D",
	},
	addButton: {
		backgroundColor: "#215ca0",
		width: "100%",
		height: 44,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	addButtonText: {
		color: "white",
		fontFamily: "ALSSiriusMedium",
		fontSize: 16,
	},
	footerText: {
		fontSize: 13,
		color: "#919DA6",
		textAlign: "center",
		marginTop: 8,
		width: "75%",
		alignSelf: "center",
	},
	card: {
		borderWidth: 1,
		borderColor: "#919DA63D",
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	cardText: {
		fontSize: 13,
		color: "#656E78",
		fontFamily: "ALSSiriusRegular",
	},
	cardImageContainer: {
		marginLeft: "auto",
		height: 32,
		width: 48,
	},
	cardImage: {
		height: "100%",
		width: "100%",
	},
});

export default Index;
