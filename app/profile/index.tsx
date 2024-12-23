import { BaseBottomSheet } from "@/components/shared/bottom-sheet";
import {useAuthStore} from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { Button } from "native-base";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import MaskInput from "react-native-mask-input";
import { request } from "@/lib/api";
import { ENDPOINTS } from "@/constants";
import { get } from "lodash";

const Index = () => {
	const sheetRef = useRef<BottomSheetModal>(null);
	const { t } = useTranslation();
	const router = useRouter();
	const minHeight = useWindowDimensions().height;
	const user = useAuthStore(state => (state as any).user);
	const setUser = useAuthStore(state => (state as any).setUser);

	const handleOpenDeleteBottomSheet = () => {
		sheetRef.current?.present();
	};

	const handleCloseDeleteBottomSheet = () => {
		sheetRef.current?.dismiss();
	};

	const deleteAccount = () => {
		request.delete(`${ENDPOINTS.profile_delete}/${get(user, 'id')}`).then(handleCloseDeleteBottomSheet);
	};

	const handleEditProfile = (values) => {
		request.put(`${ENDPOINTS.profile_edit}/${get(user, 'id')}`, {
			firstName: values.firstName,
			lastName: values.lastName,
		}).then(() => {
			request.get(ENDPOINTS.getMe).then(res => setUser(res?.data));
			router.back();
		});
	};

	return (
		<>
			<DeleteBottomSheet
				bottomSheetRef={sheetRef}
				onClose={handleCloseDeleteBottomSheet}
				deleteAccount={deleteAccount}
			/>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={[styles.flex1, { minHeight }]}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.container}>
						<View style={styles.header}>
							<View style={styles.headerContent}>
								<Ionicons
									name="arrow-back"
									size={24}
									color="#215ca0"
									onPress={() => router.back()}
								/>
								<Text style={styles.headerText}>{t("Profil sozlamalari")}</Text>
							</View>
						</View>
						<Formik
							onSubmit={values => handleEditProfile(values)}
							validateOnChange={false}
							initialValues={{
								phone: user?.phoneNumber,
								firstName: user?.firstName,
								lastName: user?.lastName,
							}}
						>
							{({ handleBlur, values, handleChange, handleSubmit }) => (
								<>
									<View style={styles.inputContainer}>
										<View style={styles.inputBox}>
											<Text style={styles.inputLabel}>
												Telefon raqamingiz
											</Text>
											<MaskInput
												style={styles.textInput}
												placeholder="+998"
												placeholderTextColor="#919DA6"
												keyboardType="phone-pad"
												maxLength={17}
												defaultValue={user?.phoneNumber}
												onBlur={handleBlur("phoneNumber")}
												value={values.phone}
												onChangeText={handleChange("phone")}
												mask={[
													"+",
													"9",
													"9",
													"8",
													" ",
													/\d/,
													/\d/,
													" ",
													/\d/,
													/\d/,
													/\d/,
													"-",
													/\d/,
													/\d/,
													"-",
													/\d/,
													/\d/,
												]}
											/>
										</View>
									</View>
									<View style={styles.inputContainer}>
										<View style={styles.inputBox}>
											<Text style={styles.inputLabel}>Ismingiz</Text>
											<TextInput
												style={[styles.textInput, styles.textInputColor]}
												placeholder="Ism"
												placeholderTextColor="#919DA6"
												onChangeText={handleChange("firstName")}
												onBlur={handleBlur("firstName")}
												value={values.firstName}
											/>
										</View>
									</View>
									<View style={styles.inputContainer}>
										<View style={styles.inputBox}>
											<Text style={styles.inputLabel}>Familiyangiz</Text>
											<TextInput
												style={[styles.textInput, styles.textInputColor]}
												placeholder="Familiya"
												placeholderTextColor="#919DA6"
												onChangeText={handleChange("lastName")}
												onBlur={handleBlur("lastName")}
												value={values.lastName}
											/>
										</View>
									</View>
									<TouchableOpacity
										style={styles.deleteAccountButton}
										onPress={handleOpenDeleteBottomSheet}
									>
										<Ionicons name="trash" size={24} color="#E04917" />
										<Text style={styles.deleteAccountText}>
											{t("Akkauntni o'chirish")}
										</Text>
									</TouchableOpacity>
									<Button
										style={styles.saveButton}
										onPress={() => handleSubmit()}
									>
										<Text style={styles.saveButtonText}>
											{t("O'zgarishlarni saqlash")}
										</Text>
									</Button>
								</>
							)}
						</Formik>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</>
	);
};

type DeleteBottomSheetProps = {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	onClose: () => void;
	deleteAccount: () => void;
};
const DeleteBottomSheet = ({
							   bottomSheetRef,
							   onClose,
							   deleteAccount
						   }: DeleteBottomSheetProps) => {
	const { t } = useTranslation();
	return (
		<BaseBottomSheet bottomSheetRef={bottomSheetRef} snap={"40%"}>
			<View style={styles.bottomSheetContainer}>
				<Text style={styles.bottomSheetTitle}>
					{t("Akkountingizni o'chirmoqchimisiz?")}
				</Text>
				<Text style={styles.bottomSheetMessage}>
					{t(
						"Chindan ham akkountingizni oʻchirmoqchimisiz? Shuni yodda tutingki ilovadagi sizga tegishli bo‘lgan barcha ma’lumotlar o‘chib ketishiga to‘g‘ri keladi"
					)}
				</Text>
				<View style={styles.bottomSheetActions}>
					<Button style={styles.deleteButton} onPress={deleteAccount}>
						<Text style={styles.deleteButtonText}>
							{t("O'chirish")}
						</Text>
					</Button>
					<Button style={styles.cancelButton} onPress={onClose}>
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
	flex1: { flex: 1 },
	container: {
		flex: 1,
		backgroundColor: "#F5F6F7",
		paddingTop: 90,
		paddingHorizontal: 16,
		paddingBottom: 24,
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
	inputContainer: {
		paddingTop: 16,
	},
	inputBox: {
		backgroundColor: "#B4C0CC29",
		padding: 16,
		borderRadius: 8,
	},
	inputLabel: {
		fontSize: 13,
		color: "#919DA6",
	},
	textInput: {
		fontSize: 15,
	},
	textInputColor: {
		color: "#292C30",
	},
	deleteAccountButton: {
		flexDirection: "row",
		marginTop: 32,
		alignItems: "center",
	},
	deleteAccountText: {
		fontSize: 15,
		fontFamily: "ALSSiriusMedium",
		color: "#E04917",
		marginLeft: 8,
	},
	saveButton: {
		marginTop: "auto",
		marginBottom: "17%",
		width: "100%",
		borderRadius: 8,
		backgroundColor: "#246BB2",
		paddingVertical: 12,
	},
	saveButtonText: {
		fontSize: 15,
		color: "white",
		fontFamily: "ALSSiriusMedium",
	},
	bottomSheetContainer: {
		padding: 16,
	},
	bottomSheetTitle: {
		fontSize: 24,
		fontFamily: "ALSSiriusBold",
		marginBottom: 8,
	},
	bottomSheetMessage: {
		fontSize: 15,
		color: "#919DA6",
	},
	bottomSheetActions: {
		flexDirection: "row",
		gap: 12,
		marginTop: 24,
	},
	deleteButton: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: "#E04917",
	},
	deleteButtonText: {
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

export default Index;
