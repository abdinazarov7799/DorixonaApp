import React from 'react';
import {
	View,
	Text,
	TextInput,
	useWindowDimensions,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { Button } from "native-base";
import { useTranslation } from "react-i18next";
import MaskInput, { Masks } from "react-native-mask-input";
import usePostQuery from "@/hooks/api/usePostQuery";
import { ENDPOINTS } from "@/constants";
import { addCardSchema } from "@/lib/validation";

export const AddCard = () => {
	const minHeight = useWindowDimensions().height;
	const router = useRouter();
	const { t } = useTranslation();
	const { mutate, isPending } = usePostQuery({});

	const onSubmit = (values) => {
		mutate(
			{
				endpoint: ENDPOINTS.card_add,
				attributes: {
					cardNumber: values?.cardNumber,
					name: values?.cardName,
				},
			},
			{
				onSuccess: () => {
					router.back();
				},
			}
		);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1, minHeight }}
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
							<Text style={styles.headerText}>
								{t("Karta qo'shish")}
							</Text>
						</View>
					</View>

					<Formik
						initialValues={{ cardNumber: "", cardName: "" }}
						onSubmit={onSubmit}
						validateOnChange={false}
						validationSchema={addCardSchema}
					>
						{({
							  handleChange,
							  handleBlur,
							  handleSubmit,
							  values,
							  errors,
							  isValid,
						  }) => (
							<>
								<View>
									<View style={styles.inputContainer}>
										<MaskInput
											placeholder="Karta raqami"
											placeholderTextColor="#919DA6"
											keyboardType="numeric"
											onBlur={handleBlur("cardNumber")}
											value={values.cardNumber}
											maxLength={19}
											onChangeText={(_, unmasked) =>
												handleChange("cardNumber")(unmasked)
											}
											mask={Masks.CREDIT_CARD}
											style={styles.maskInput}
										/>
									</View>
									{errors.cardNumber && (
										<Text style={styles.errorText}>
											{t(errors.cardNumber)}
										</Text>
									)}
									<Text style={styles.hintText}>
										{t(
											"Boshlangʻich 4 ta raqami 9860, 8600, 5614, 6440 boʻlgan kartalarni qoʻshishingiz mumkin"
										)}
									</Text>
									<View style={styles.inputContainer}>
										<TextInput
											onChangeText={handleChange("cardName")}
											onBlur={handleBlur("cardName")}
											value={values.cardName}
											placeholder="Karta nomi (shart emas)"
											placeholderTextColor="#919DA6"
											style={styles.textInput}
										/>
									</View>
									<Text style={styles.subHintText}>
										{t("Masalan: Asosiy")}
									</Text>
								</View>

								<Button
									onPress={() => handleSubmit()}
									isLoading={isPending}
									isDisabled={!isValid && isPending}
									style={[
										styles.addButton,
										{ opacity: isValid ? 1 : 0.5 },
									]}
								>
									<Text style={styles.addButtonText}>
										{t("Kartani qo'shish")}
									</Text>
								</Button>
							</>
						)}
					</Formik>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
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
		backgroundColor: "#B4C0CC29",
		padding: 16,
		borderRadius: 8,
		marginBottom: 8,
	},
	maskInput: {
		fontSize: 15,
		color: "#292C30",
	},
	errorText: {
		color: "red",
		fontFamily: "ALSSiriusRegular",
		fontSize: 12,
		marginTop: 4,
	},
	hintText: {
		fontSize: 13,
		color: "#919DA6",
		fontFamily: "ALSSiriusRegular",
		marginBottom: 16,
	},
	textInput: {
		fontSize: 15,
		color: "#292C30",
	},
	subHintText: {
		fontSize: 13,
		color: "#919DA6",
		fontFamily: "ALSSiriusRegular",
		marginTop: 8,
	},
	addButton: {
		backgroundColor: "#215ca0",
		width: "100%",
		height: 44,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginTop: "auto",
	},
	addButtonText: {
		color: "white",
		fontFamily: "ALSSiriusMedium",
		fontSize: 15,
	},
});

export default AddCard;
