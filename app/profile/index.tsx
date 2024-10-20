import {BaseBottomSheet} from "@/components/shared/bottom-sheet";
import useStore from "@/store";
import {Ionicons} from "@expo/vector-icons";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useRouter} from "expo-router";
import {Formik} from "formik";
import {Button} from "native-base";
import {useRef} from "react";
import {useTranslation} from "react-i18next";
import {Text, TouchableOpacity, View, useWindowDimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard} from "react-native";
import {TextInput} from "react-native-gesture-handler";
import MaskInput from "react-native-mask-input";
import {request} from "@/lib/api";
import {ENDPOINTS} from "@/constants";
import {get} from "lodash";

const Index = () => {
	const sheetRef = useRef<BottomSheetModal>(null);
	const {t} = useTranslation();
	const router = useRouter();
	const minHeight = useWindowDimensions().height;
	const user = useStore(state => (state as any).user);
	const setUser = useStore(state => (state as any).setUser);

	const handleOpenDeleteBottomSheet = () => {
		sheetRef.current?.present();
	};

	const handleCloseDeleteBottomSheet = () => {
		sheetRef.current?.dismiss();
	};

	const deleteAccount = () => {
		request.delete(`${ENDPOINTS.profile_delete}/${get(user,'id')}`).then(handleCloseDeleteBottomSheet);
	};

	const handleEditProfile = (values) => {
		request.put(`${ENDPOINTS.profile_edit}/${get(user,'id')}`,{
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
								<Text className={"ml-[16px] font-ALSSiriusMedium text-[18px]"}>
									{t("Profil sozlamalari")}
								</Text>
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
							{({handleBlur, values, handleChange, handleSubmit}) => (
								<>
									<View className="pt-4">
										<View className="bg-[#B4C0CC29] p-4 rounded-lg">
											<Text className="text-[13px] text-[#919DA6]">
												Telefon raqamingiz
											</Text>
											<MaskInput
												className="text-[15px]"
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
									<View className="pt-4">
										<View className="bg-[#B4C0CC29] p-4 rounded-lg">
											<Text className="text-[13px] text-[#919DA6]">Ismingiz</Text>
											<TextInput
												className="text-[15px] text-[#292C30]"
												placeholder="Ism"
												placeholderTextColor="#919DA6"
												onChangeText={handleChange("firstName")}
												onBlur={handleBlur("firstName")}
												value={values.firstName}
											/>
										</View>
									</View>
									<View className="pt-4">
										<View className="bg-[#B4C0CC29] p-4 rounded-lg">
											<Text className="text-[13px] text-[#919DA6]">
												Familiyangiz
											</Text>
											<TextInput
												className="text-[15px] text-[#292C30]"
												placeholder="Familiya"
												placeholderTextColor="#919DA6"
												onChangeText={handleChange("lastName")}
												onBlur={handleBlur("lastName")}
												value={values.lastName}
											/>
										</View>
									</View>
									<TouchableOpacity
										className="flex-row mt-8"
										onPress={handleOpenDeleteBottomSheet}
									>
										<Ionicons name="trash" size={24} color="#E04917" />
										<Text
											className="text-[15px] text-[#E04917] font-ALSSiriusMedium ml-2"
											style={{color: "#E04917"}}
										>
											{t("Akkauntni o'chirish")}
										</Text>
									</TouchableOpacity>
									<Button
										className="mt-auto mb-[17%] w-full rounded-lg bg-[#246BB2] py-3"
										onPress={() => handleSubmit()}
									>
										<Text className="text-[15px] text-white font-ALSSiriusMedium">
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
	const {t} = useTranslation();
	return (
		<BaseBottomSheet bottomSheetRef={bottomSheetRef} snap={"40%"}>
			<View className="p-4 ">
				<Text className="text-2xl font-ALSSiriusBold mb-2">
					{t("Akkountingizni o'chirmoqchimisiz?")}
				</Text>
				<Text className="text-[15px] text-[#919DA6]">
					{t(
						"Chindan ham akkountingizni oʻchirmoqchimisiz? Shuni yodda tutingki ilovadagi sizga tegishli bo‘lgan barcha ma’lumotlar o‘chib ketishiga to‘g‘ri keladi"
					)}
				</Text>
				<View className="flex flex-row gap-3 mt-6">
					<Button className="flex-1 px-4 py-3 rounded-lg bg-[#E04917]" onPress={deleteAccount}>
						<Text className="text-[15px] font-ALSSiriusMedium text-white">
							{t("O'chirish")}
						</Text>
					</Button>
					<Button
						className="flex-1 px-4 py-3 rounded-lg bg-[#B4C0CC29]"
						onPress={onClose}
					>
						<Text className="text-[15px] font-ALSSiriusMedium text-[#292C30]">
							{t("Bekor qilish")}
						</Text>
					</Button>
				</View>
			</View>
		</BaseBottomSheet>
	);
};

export default Index;
