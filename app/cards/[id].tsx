import { BaseBottomSheet } from "@/components/shared/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "native-base";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TextInput, View, StyleSheet } from "react-native";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import { ENDPOINTS, KEYS } from "@/constants";
import { request } from "@/lib/api";

const CardScreen = () => {
	const router = useRouter();
	const { id } = useLocalSearchParams();
	const { t } = useTranslation();
	const deleteBottomSheetRef = useRef<BottomSheetModal>(null);
	const { data } = useFetchRequest({
		queryKey: KEYS.card_list,
		endpoint: ENDPOINTS.card_list,
	});
	const card = data?.find(card => card.id == id);
	const [name, setName] = useState(card?.cardName);

	const handleOpenDeleteBottomSheet = () => {
		deleteBottomSheetRef.current?.present();
	};

	const handleCloseDeleteBottomSheet = () => {
		deleteBottomSheetRef.current?.dismiss();
	};

	const handleEditCard = () => {
		request.patch(`${ENDPOINTS.card_edit}/${id}`, { name }).finally(() => router.back());
	};

	return (
		<>
			<DeleteBottomSheet
				bottomSheetRef={deleteBottomSheetRef}
				onClose={handleCloseDeleteBottomSheet}
				id={id}
			/>
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.headerContent}>
						<Ionicons
							name="arrow-back"
							size={24}
							color="#215ca0"
							onPress={() => router.back()}
						/>
						<Text style={styles.headerText}>
							{t("Karta sozlamalari")}
						</Text>
					</View>
				</View>

				<View style={styles.cardContainer}>
					<Card key={card?.id} {...card} />
					<View style={styles.inputContainer}>
						<Text style={styles.inputLabel}>
							{t("Karta nomi (shart emas)")}
						</Text>
						<TextInput
							value={name}
							onChangeText={text => setName(text)}
							style={styles.textInput}
						/>
					</View>
				</View>

				<View style={styles.buttonContainer}>
					<Button
						style={styles.deleteButton}
						onPress={handleOpenDeleteBottomSheet}
					>
						<Text style={styles.deleteButtonText}>
							{t("Kartani o'chirish")}
						</Text>
					</Button>
					<Button style={styles.saveButton} onPress={handleEditCard}>
						<Text style={styles.saveButtonText}>
							{t("O'zgarishni saqlash")}
						</Text>
					</Button>
				</View>
			</View>
		</>
	);
};

type CardProps = {
	name: string;
	number: string;
	id: number;
};

const Card = ({ name, number }: CardProps) => {
	return (
		<View style={styles.card}>
			<Text style={styles.cardText}>
				{name}{name && " ····"}{String(number).slice(-4)}
			</Text>
			<View style={styles.cardImageContainer}>
				<Image
					resizeMode="contain"
					style={styles.cardImage}
					source={
						number?.substring(0, 4) == "8600"
							? require("@/assets/images/uzcard.png")
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
	id: any;
};
const DeleteBottomSheet = ({
							   bottomSheetRef,
							   onClose,
							   id
						   }: DeleteBottomSheetProps) => {
	const { t } = useTranslation();
	const handleDelete = () => {
		request.delete(`${ENDPOINTS.card_delete}/${id}`).finally(() => router.back());
	};
	return (
		<BaseBottomSheet bottomSheetRef={bottomSheetRef} snap={"35%"}>
			<View style={styles.bottomSheetContainer}>
				<Text style={styles.bottomSheetTitle}>
					{t("Kartangizni o'chirmoqchimisiz?")}
				</Text>
				<Text style={styles.bottomSheetText}>
					{t(
						"Chindan ham kartangizni oʻchirmoqchimisiz? Ehtimol behosdan bosilib ketgan boʻlishi mumkin."
					)}
				</Text>
				<View style={styles.bottomSheetButtonContainer}>
					<Button style={styles.confirmDeleteButton} onPress={handleDelete}>
						<Text style={styles.confirmDeleteButtonText}>
							{t("O'chirish")}
						</Text>
					</Button>
					<Button
						style={styles.cancelButton}
						onPress={onClose}
					>
						<Text style={styles.cancelButtonText}>
							{t("Bekor qilish")}
						</Text>
					</Button>
				</View>
			</View>
		</BaseBottomSheet>
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
	cardContainer: {
		paddingHorizontal: 16,
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
		fontFamily: "ALSSiriusRegular",
		color: "#656E78",
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
	inputContainer: {
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: "#B4C0CC29",
	},
	inputLabel: {
		fontSize: 13,
		fontFamily: "ALSSiriusRegular",
		color: "#656E78",
	},
	textInput: {
		fontSize: 15,
	},
	buttonContainer: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		height: 134,
		padding: 12,
		backgroundColor: "white",
		borderTopWidth: 1,
		borderTopColor: "#919DA63D",
	},
	deleteButton: {
		backgroundColor: "#B4C0CC29",
		width: "100%",
		height: 44,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	deleteButtonText: {
		color: "#292C30",
		fontFamily: "ALSSiriusMedium",
		fontSize: 16,
	},
	saveButton: {
		backgroundColor: "#215ca0",
		width: "100%",
		height: 44,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	saveButtonText: {
		color: "white",
		fontFamily: "ALSSiriusMedium",
		fontSize: 16,
	},
	bottomSheetContainer: {
		padding: 16,
	},
	bottomSheetTitle: {
		fontSize: 24,
		fontFamily: "ALSSiriusBold",
		marginBottom: 8,
	},
	bottomSheetText: {
		fontSize: 15,
		fontFamily: "ALSSiriusRegular",
		color: "#919DA6",
	},
	bottomSheetButtonContainer: {
		flexDirection: "row",
		gap: 12,
		marginTop: 24,
	},
	confirmDeleteButton: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: "#E04917",
	},
	confirmDeleteButtonText: {
		fontSize: 15,
		fontFamily: "ALSSiriusMedium",
		color: "white",
	},
	cancelButton: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: "#B4C0CC29",
	},
	cancelButtonText: {
		fontSize: 15,
		fontFamily: "ALSSiriusMedium",
		color: "#292C30",
	},
});

export default CardScreen;
