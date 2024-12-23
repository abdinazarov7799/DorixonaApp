import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { Text, View, StyleSheet } from "react-native";
import { BaseBottomSheet } from "../shared/bottom-sheet";
import { Button } from "native-base";
import {useAuthStore} from "@/store";
import { router } from "expo-router";

type LogoutBottomSheetProps = {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	onClose: () => void;
};

export const LogoutBottomSheet = ({
									  bottomSheetRef,
									  onClose,
								  }: LogoutBottomSheetProps) => {
	const { t } = useTranslation();
	const clearAuthData = useAuthStore(state => (state as any).clearAuthData);

	const logOut = () => {
		clearAuthData();
		router.push("/auth");
	};

	return (
		<BaseBottomSheet bottomSheetRef={bottomSheetRef} snap={"35%"}>
			<View style={styles.container}>
				<Text style={styles.headerText}>
					{t("Dasturdan chiqmoqchimisiz?")}
				</Text>
				<Text style={styles.subText}>
					{t(
						"Chindan ham dasturdan chiqmoqchimisiz? Ehtimol behosdan bosilib ketgan boʻlishi mumkin"
					)}
				</Text>
				<View style={styles.buttonContainer}>
					<Button style={styles.logoutButton} onPress={logOut}>
						<Text style={styles.logoutText}>
							{t("Chiqish")}
						</Text>
					</Button>
					<Button style={styles.cancelButton} onPress={onClose}>
						<Text style={styles.cancelText}>
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
		padding: 16,
	},
	headerText: {
		fontSize: 24,
		fontFamily: "ALSSiriusBold",
		marginBottom: 8,
	},
	subText: {
		fontSize: 15,
		color: "#919DA6",
	},
	buttonContainer: {
		flexDirection: "row",
		gap: 12,
		marginTop: 24,
	},
	logoutButton: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: "#E04917",
	},
	cancelButton: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: "#B4C0CC29",
	},
	logoutText: {
		fontSize: 15,
		fontFamily: "ALSSiriusMedium",
		color: "white",
		textAlign: "center",
	},
	cancelText: {
		fontSize: 15,
		fontFamily: "ALSSiriusMedium",
		color: "#292C30",
		textAlign: "center",
	},
});
