import React from 'react';
import {View, Text, TextInput, useWindowDimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Formik} from "formik";
import {Button} from "native-base";
import {useTranslation} from "react-i18next";
import MaskInput, {Masks} from "react-native-mask-input";
import usePostQuery from "@/hooks/api/usePostQuery";
import {ENDPOINTS} from "@/constants";
import {addCardSchema} from "@/lib/validation";

export const AddCard = () => {
	const minHeight = useWindowDimensions().height;
	const router = useRouter();
	const {t} = useTranslation();
	const { mutate,isPending } = usePostQuery({})

	const onSubmit = (values) => {
		mutate({
			endpoint: ENDPOINTS.card_add,
			attributes: {
				cardNumber: values?.cardNumber,
				name: values?.cardName,
			}
		},{
			onSuccess: () => {router.back()}
		})
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1, minHeight }}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View className="flex-1 bg-[#F5F6F7] relative pt-[90px] px-4 pb-6">
					<View className="absolute top-0 w-[100vw] py-[17px] px-[20px] flex-row justify-between border-b border-[#919DA63D]">
						<View className="flex-row items-center gap-4">
							<Ionicons
								name="arrow-back"
								size={24}
								color="#215ca0"
								onPress={() => router.back()}
							/>
							<Text className={"ml-[16px] ALSSiriusMedium text-[18px]"}>
								{t("Karta qo'shish")}
							</Text>
						</View>
					</View>

					<Formik
						initialValues={{cardNumber: "", cardName: ""}}
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
								<View className="">
									<View className="bg-[#B4C0CC29] p-4 rounded-lg">
										<MaskInput
											placeholder="Karta raqami"
											placeholderTextColor={"#919DA6"}
											keyboardType="numeric"
											onBlur={handleBlur("cardNumber")}
											value={values.cardNumber}
											maxLength={19}
											onChangeText={(_, unmasked) =>
												handleChange("cardNumber")(unmasked)
											}
											mask={Masks.CREDIT_CARD}
										/>
									</View>
									{errors.cardNumber && (
										<Text className="text-red-500 font-ALSSiriusRegular text-xs mt-1">
											{t(errors.cardNumber)}
										</Text>
									)}
									<Text className="mt-2 text-[13px] text-[#919DA6] font-ALSSiriusRegular mb-4">
										{t(
											"Boshlangʻich 4 ta raqami 9860, 8600, 5614, 6440 boʻlgan kartalarni qoʻshishingiz mumkin"
										)}
									</Text>
									<View className="bg-[#B4C0CC29] p-4 rounded-lg">
										<TextInput
											onChangeText={handleChange("cardName")}
											onBlur={handleBlur("cardName")}
											value={values.cardName}
											className="text-[15px] text-[#292C30]"
											placeholder="Karta nomi (shart emas)"
											placeholderTextColor={"#919DA6"}
										/>
									</View>
									<Text className="mt-2 text-[13px] text-[#919DA6] font-ALSSiriusRegular">
										{t("Masalan: Asosiy")}
									</Text>
								</View>

								<Button
									onPress={() => handleSubmit()}
									isLoading={isPending}
									isDisabled={!isValid && isPending}
									className="mt-auto bg-[#215ca0] w-full h-[44px] rounded-lg"
									style={{opacity: isValid ? 1 : 0.5}}
								>
									<Text className="text-[15px] text-white ALSSiriusMedium">
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

export default AddCard;
