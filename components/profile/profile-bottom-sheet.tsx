import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from "react-native";
import { BaseBottomSheet } from "../shared/bottom-sheet";
import { Switch } from "native-base";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {useAuthStore} from "@/store";
import { useRouter } from "expo-router";
import { useState } from "react";
import i18n from "@/lib/i18n";
import * as Application from 'expo-application';
import React from "react";

type ProfileBottomSheetProps = {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	onClose: () => void;
	onLogout: () => void;
};

export const ProfileBottomSheet = ({
									   bottomSheetRef,
									   onLogout,
									   onClose,
								   }: ProfileBottomSheetProps) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const user = useAuthStore(state => (state as any).user);
	const lang = useAuthStore(state => (state as any).lang);
	const setLanguage = useAuthStore(state => (state as any).setLang);
	const { t } = useTranslation();

	const handleNavigateToProfileEdit = () => {
		router.push("/profile");
		onClose();
	};

	const changeLanguage = (value: string) => {
		i18n.changeLanguage(value);
		setLanguage(value);
		setOpen(false);
	};

	return (
		<>
			<BaseBottomSheet
				bottomSheetRef={bottomSheetRef}
				snap={"56%"}
				backgroundColor="#F5F6F7"
			>
				<View style={styles.container}>
					<View style={styles.header}>
						<Ionicons name="close" size={28} color="black" onPress={onClose} />
						<Text style={styles.headerText}>{t("Profil")}</Text>
						<MaterialCommunityIcons
							name="pencil-outline"
							size={22}
							color="black"
							onPress={handleNavigateToProfileEdit}
						/>
					</View>
					<View style={styles.userInfo}>
						<Text style={styles.userName}>
							{user?.firstName} {user?.lastName}
						</Text>
						<Text style={styles.userPhone}>{user?.phoneNumber}</Text>
					</View>
					<View style={styles.optionContainer}>
						<TouchableOpacity style={styles.option} onPress={() => setOpen(true)}>
							<Feather name="globe" size={24} color="#246BB2" />
							<Text style={styles.optionText}>{t("Ilova tili")}</Text>
							<View style={styles.optionIconContainer}>
								<Text style={styles.langText}>{t(lang)}</Text>
								<Feather name="chevron-right" size={18} color="#919DA6" />
							</View>
						</TouchableOpacity>
						<Modal
							animationType="fade"
							transparent={true}
							visible={open}
							onRequestClose={() => setOpen(false)}
						>
							<Pressable style={styles.overlay} onPress={() => setOpen(false)}>
								<View style={styles.modalContainer}>
									<TouchableOpacity
										style={styles.modalOption}
										onPress={() => changeLanguage("uz")}
									>
										<Text style={[styles.modalText, { color: lang === "uz" ? "#246bb2" : "#000" }]}>
											O‘zbek tili
										</Text>
										{lang === "uz" && <Ionicons name="checkmark" size={18} color="blue" />}
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.modalOption}
										onPress={() => changeLanguage("ru")}
									>
										<Text style={[styles.modalText, { color: lang === "ru" ? "#246bb2" : "#000" }]}>
											Русский язык
										</Text>
										{lang === "ru" && <Ionicons name="checkmark" size={18} color="blue" />}
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.modalOption}
										onPress={() => changeLanguage("kr")}
									>
										<Text style={[styles.modalText, { color: lang === "kr" ? "#246bb2" : "#000" }]}>
											Ўзбек тили
										</Text>
										{lang === "kr" && <Ionicons name="checkmark" size={18} color="blue" />}
									</TouchableOpacity>
								</View>
							</Pressable>
						</Modal>
						<View style={styles.divider} />
						<View style={styles.notificationOption}>
							<Feather name="bell" size={24} color="#246BB2" />
							<Text style={styles.optionText}>{t("Xabarnoma")}</Text>
							<Switch style={styles.switch} />
						</View>
					</View>
					<TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
						<Feather name="log-out" size={24} color="#E04917" />
						<Text style={styles.logoutText}>{t("Dasturdan chiqish")}</Text>
					</TouchableOpacity>
					<Text style={styles.footerText}>{t("Jurabek LAB")}</Text>
					<Text style={styles.footerText}>{t("Talqin")} {Application?.nativeApplicationVersion}</Text>
				</View>
			</BaseBottomSheet>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerText: {
		fontFamily: "ALSSiriusMedium",
	},
	userInfo: {
		paddingVertical: 24,
	},
	userName: {
		color: "#292C30",
		fontSize: 24,
		textAlign: "center",
		fontFamily: "ALSSiriusBold",
	},
	userPhone: {
		color: "#919DA6",
		textAlign: "center",
		fontSize: 16,
	},
	optionContainer: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 12,
		backgroundColor: "white",
	},
	option: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
	},
	optionText: {
		marginLeft: 12,
		fontSize: 15,
		fontFamily: "ALSSiriusMedium",
		flex: 1,
	},
	optionIconContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	langText: {
		fontSize: 13,
		color: "#919DA6",
		marginRight: 4,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "flex-end",
	},
	modalContainer: {
		height: 150,
		width: 200,
		marginTop: 300,
		marginRight: 50,
		backgroundColor: "white",
		borderRadius: 12,
		padding: 16,
		justifyContent: "space-between",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalOption: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 8,
	},
	modalText: {
		fontSize: 15,
		fontFamily: "ALSSiriusRegular",
	},
	divider: {
		width: "100%",
		borderTopWidth: 1,
		borderTopColor: "#919DA63D",
		marginVertical: 12,
	},
	notificationOption: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
	},
	switch: {
		marginLeft: "auto",
	},
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderRadius: 12,
		backgroundColor: "white",
		marginTop: 16,
		marginBottom: 16
	},
	logoutText: {
		fontSize: 15,
		fontFamily: "ALSSiriusMedium",
		color: "#E04917",
		marginLeft: 12,
	},
	footerText: {
		color: "#919DA6",
		textAlign: "center",
		fontSize: 13,
		marginTop: 8,
	},
});
