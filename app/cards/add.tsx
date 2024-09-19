import {addCardSchema} from "@/lib/validation";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Formik} from "formik";
import {Button} from "native-base";
import {useTranslation} from "react-i18next";
import {Text, TextInput, View, useWindowDimensions} from "react-native";
import MaskInput, {Masks} from "react-native-mask-input";

export const AddCard = () => {
	const minHeight = useWindowDimensions().height;
	const router = useRouter();
	const {t} = useTranslation();
	return (
		<View
			className="flex-1 bg-[#F5F6F7] relative pt-[90px] px-4 pb-6"
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
					<Text className={"ml-[16px] font-medium text-[18px]"}>
						{t("Karta qo'shish")}
					</Text>
				</View>
			</View>
			<Formik
				initialValues={{cardNumber: "", cardName: ""}}
				onSubmit={values => console.log(values)}
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
					touched,
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
								<Text className="text-red-500 font-normal text-xs mt-1">
									{t(errors.cardNumber)}
								</Text>
							)}
							<Text className="mt-2 text-[13px] text-[#919DA6] mb-4">
								{t(
									"Boshlangʻich 4 ta raqami 9860, 8600, 6440 boʻlgan kartalarni qoʻshishingiz mumkin"
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
							<Text className="mt-2 text-[13px] text-[#919DA6]">
								{t("Masalan: Asosiy")}
							</Text>
						</View>

						<Button
							onPress={() => handleSubmit()}
							disabled={!isValid}
							className="mt-auto rounded-lg bg-[#246BB2]"
							style={{opacity: isValid ? 1 : 0.5}}
						>
							<Text className="text-[15px] text-white font-medium">
								{t("Kartani qo'shish")}
							</Text>
						</Button>
					</>
				)}
			</Formik>
		</View>
	);
};

export default AddCard;