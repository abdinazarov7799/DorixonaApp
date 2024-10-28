import React from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { View, Text, Image, StyleSheet } from "react-native";
import { BaseBottomSheet } from "../shared/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { ActionItemProps } from "@/app/(tabs)/report";

type HistoryBottomSheetProps = {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	transaction: ActionItemProps | null;
	onClose: () => void;
};

export const HistoryBottomSheet = ({
									   bottomSheetRef,
									   transaction,
									   onClose,
								   }: HistoryBottomSheetProps) => {
	const { t } = useTranslation();
	const isSuccessful = transaction?.status === "DONE";

	return (
		<BaseBottomSheet
			bottomSheetRef={bottomSheetRef}
			snap={isSuccessful ? "65%" : "55%"}
		>
			<View style={styles.container}>
				<View style={styles.iconContainer}>
					<Ionicons name="close" size={24} color="black" onPress={onClose} />
				</View>
				<View style={styles.contentCenter}>
					<View style={styles.imageContainer}>
						<Image
							style={styles.image}
							source={
								isSuccessful
									? require("@/assets/images/success.png")
									: require("@/assets/images/exclamation.png")
							}
						/>
					</View>
					<Text style={styles.statusText}>
						{transaction?.status === "DONE"
							? t("Kartaga pul o'tkazildi")
							: transaction?.status === "REJECTED"
								? t("Amaliyot bekor qilindi")
								: t("Pul o'tkazish kutilmoqda")}
					</Text>
					<Text style={styles.amountText}>
						{Number(transaction?.amount)?.toLocaleString("en-US")} {t("so'm")}
					</Text>
				</View>
				<View style={styles.detailsContainer}>
					{isSuccessful && (
						<View style={styles.row}>
							<Text style={styles.labelText}>{t("Yuboruvchi")}</Text>
							<Text style={styles.valueText}>{t("Jurabek LAB")}</Text>
						</View>
					)}
					<View style={styles.row}>
						<Text style={styles.labelText}>{t("So'rov yuborilgan vaqti")}</Text>
						<Text style={styles.valueText}>{t("18-avgust, 09:28")}</Text>
					</View>
					{isSuccessful && (
						<View style={styles.row}>
							<Text style={styles.labelText}>{t("Tasdiqlangan vaqti")}</Text>
							<Text style={styles.valueText}>{t("18-avgust, 09:28")}</Text>
						</View>
					)}
					<View style={styles.row}>
						<Text style={styles.labelText}>{t("Tranzaksiya raqami")}</Text>
						<Text style={styles.valueText}>{transaction?.number}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.labelText}>{t("O'tkazma summasi")}</Text>
						<Text style={styles.valueText}>
							{Number(transaction?.amount)?.toLocaleString("en-US")} {t("so'm")}
						</Text>
					</View>
				</View>
			</View>
		</BaseBottomSheet>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		position: "relative",
	},
	iconContainer: {
		width: "100%",
		alignItems: "flex-end",
	},
	contentCenter: {
		alignItems: "center",
	},
	imageContainer: {
		width: 80,
		height: 80,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	statusText: {
		fontSize: 18,
		fontFamily: "ALSSiriusBold",
	},
	amountText: {
		fontSize: 28,
		fontFamily: "ALSSiriusBold",
	},
	detailsContainer: {
		paddingTop: 40,
		gap: 12,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	labelText: {
		fontSize: 15,
		color: "#919DA6",
		fontFamily: "ALSSiriusRegular",
	},
	valueText: {
		fontSize: 15,
		fontFamily: "ALSSiriusRegular",
	},
});
