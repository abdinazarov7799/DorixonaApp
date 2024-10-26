import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "native-base";
import { useTranslation } from "react-i18next";
import { Image, Text, View, StyleSheet } from "react-native";
import usePostQuery from "@/hooks/api/usePostQuery";
import { useEffect } from "react";
import { ENDPOINTS } from "@/constants";
import Loader from "@/components/shared/Loader";

const Info = () => {
	const router = useRouter();
	const { cardNumber, cardId, amount } = useLocalSearchParams();
	const { t } = useTranslation();
	const { mutate, isPending } = usePostQuery({});

	useEffect(() => {
		mutate({ endpoint: ENDPOINTS.withdraw, attributes: { cardId, amount } });
	}, [amount]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<Ionicons
						name="close"
						size={24}
						color="#215ca0"
						onPress={() => router.replace("/payments")}
					/>
				</View>
			</View>
			{isPending ? (
				<Loader />
			) : (
				<View style={styles.content}>
					<Image
						source={require("@/assets/images/exclamation.png")}
						style={styles.image}
					/>
					<Text style={styles.title}>
						{t("So'rov yuborildi, pul o'tkazish kutilmoqda")}
					</Text>
					<View style={styles.details}>
						<View style={styles.detailRow}>
							<Text style={styles.labelText}>{t("Qabul qiluvchi karta")}</Text>
							<Text style={styles.valueText}>{cardNumber}</Text>
						</View>
						<View style={styles.detailRow}>
							<Text style={styles.labelText}>{t("O'tkazma summasi")}</Text>
							<Text style={styles.valueText}>
								{Number(amount)?.toLocaleString("en-US")} {t("so'm")}
							</Text>
						</View>
					</View>
					<Button
						style={styles.button}
						onPress={() => router.replace("/payments")}
					>
						<Text style={styles.buttonText}>{t("Bosh oynaga qaytish")}</Text>
					</Button>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F6F7",
		paddingTop: 90,
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
	content: {
		flex: 1,
		alignItems: "center",
		paddingTop: 20,
		paddingBottom: 6,
		paddingHorizontal: 24,
	},
	image: {
		width: 80,
		height: 80,
		marginBottom: 16,
	},
	title: {
		fontSize: 20,
		textAlign: "center",
		width: "75%",
		fontFamily: "ALSSiriusBold",
		color: "#292C30",
	},
	details: {
		paddingTop: 40,
		gap: 12,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	labelText: {
		fontSize: 15,
		color: "#919DA6",
		fontFamily: "ALSSiriusRegular",
	},
	valueText: {
		fontSize: 15,
		fontFamily: "ALSSiriusRegular",
		color: "#292C30",
	},
	button: {
		marginTop: "auto",
		width: "100%",
		borderRadius: 8,
		backgroundColor: "#B4C0CC29",
		justifyContent: "center",
		alignItems: "center",
		height: 48,
	},
	buttonText: {
		fontSize: 15,
		color: "#292C30",
		fontFamily: "ALSSiriusMedium",
	},
});

export default Info;
