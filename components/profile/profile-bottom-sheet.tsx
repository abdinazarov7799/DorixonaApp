import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useTranslation} from "react-i18next";
import {View, Text, TouchableOpacity, Modal, Pressable, StyleSheet} from "react-native";
import {BaseBottomSheet} from "../shared/bottom-sheet";
import {Switch} from "native-base";
import {Feather, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {styled} from "nativewind";
import useStore from "@/store";
import {useRouter} from "expo-router";
import {useState} from "react";
import i18n from "@/lib/i18n";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

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
	const [open,setOpen] = useState(false);
	const user = useStore(state => (state as any).user);
	const lang = useStore(state => (state as any).lang);
	const setLanguage = useStore(state => (state as any).setLang);
	const {t} = useTranslation();
	const handleNavigateToProfileEdit = () => {
		router.push("/profile");
		onClose();
	};

	const changeLanguage = (value: string) => {
		i18n.changeLanguage(value);
		setLanguage(value);
		setOpen(false)
	}

	return (
		<>
			<BaseBottomSheet
				bottomSheetRef={bottomSheetRef}
				snap={"56%"}
				backgroundColor="#F5F6F7"
			>
				<StyledView className="px-4">
					<StyledView className="w-full flex-row items-center justify-between">
						<Ionicons name="close" size={28} color="black" onPress={onClose} />
						<StyledText className="font-ALSSiriusMedium">{t("Profil")}</StyledText>
						<MaterialCommunityIcons
							name="pencil-outline"
							size={22}
							color="black"
							onPress={handleNavigateToProfileEdit}
						/>
					</StyledView>
					<StyledView className="py-6">
						<StyledText className="text-[#292C30] text-2xl text-center font-ALSSiriusBold">
							{user?.firstName} {user?.lastName}
						</StyledText>
						<StyledText className="text-[#919DA6] text-center text-base">
							{user?.phoneNumber}
						</StyledText>
					</StyledView>
					<StyledView className="px-4 py-2 rounded-2xl bg-white">
						<StyledTouchable className="flex-row items-center gap-3 pb-2 py-2" onPress={() => setOpen(true)}>
							<Feather name="globe" size={24} color="#246BB2" />
							<StyledText className="text-[15px] font-ALSSiriusMedium mr-auto">
								{t("Ilova tili")}
							</StyledText>
							<StyledView className="ml-auto flex-row items-center">
								<StyledText className="text-[13px] text-[#919DA6]">
									{t(lang)}
								</StyledText>
								<Feather name="chevron-right" size={18} color="#919DA6" />
							</StyledView>
						</StyledTouchable>
						<Modal
							animationType="fade"
							transparent={true}
							visible={open}
							onRequestClose={() => setOpen(false)}
						>
							<Pressable
								style={styles.overlay}
								onPress={() => setOpen(false)}
							>
								<View style={styles.modalContainer}>
									<StyledTouchable
										className="py-4 flex-row items-center justify-between"
										onPress={() => changeLanguage("uz")}
									>
										<Text className="font-ALSSiriusRegular text-[15px]" style={{color: lang == "uz" ? "#246bb2" : "#000"}}>O‘zbek tili</Text>
										{
											lang == "uz" && <Ionicons name="checkmark" size={18} color="blue" />
										}
									</StyledTouchable>

									<StyledTouchable
										className="py-[14px] flex-row items-center justify-between"
										onPress={() => changeLanguage("RU")}
									>
										<Text className="font-ALSSiriusRegular text-[15px]" style={{color: lang == "RU" ? "#246bb2" : "#000"}}>Русский язык</Text>
										{
											lang == "RU" && <Ionicons name="checkmark" size={18} color="blue" />
										}
									</StyledTouchable>

									<StyledTouchable
										className="py-[14px] flex-row items-center justify-between"
										onPress={() => changeLanguage("kr")}
									>
										<Text className="font-ALSSiriusRegular text-[15px]" style={{color: lang == "kr" ? "#246bb2" : "#000"}}>Ўзбек тили</Text>
										{
											lang == "kr" && <Ionicons name="checkmark" size={18} color="blue" />
										}
									</StyledTouchable>

								</View>
							</Pressable>
						</Modal>

						<StyledView
							className="w-5/6 border-t"
							style={{borderTopColor: "#919DA63D", marginVertical: 12}}
						/>
						<StyledView className="flex-row items-center gap-3 py-2">
							<Feather name="bell" size={24} color="#246BB2" />
							<StyledText className="text-[1  5px] font-ALSSiriusMedium mr-auto">
								{t("Xabarnoma")}
							</StyledText>
							<StyledView className="ml-auto flex-row items-center">
								<Switch />
							</StyledView>
						</StyledView>
					</StyledView>
					<StyledTouchable
						className="p-4 rounded-2xl bg-white flex-row mt-4"
						onPress={onLogout}
					>
						<Feather name="log-out" size={24} color="#E04917" />

						<StyledText
							className="text-[15px] font-ALSSiriusMedium text-[#E04917]"
							style={{marginLeft: 12, color: "#E04917"}}
						>
							{t("Dasturdan chiqish")}
						</StyledText>
					</StyledTouchable>
					<StyledText className="text-[#919DA6] text-center text-[13px] mt-4">
						{t("Jurabek LAB")}
					</StyledText>
					<StyledText className="text-[#919DA6] text-center text-[13px] mt-2">
						{t("Talqin 1.0.0")}
					</StyledText>
				</StyledView>
			</BaseBottomSheet>
		</>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	modalContainer: {
		height: 150,
		width: 200,
		justifyContent: "space-between",
		marginTop: 300,
		marginRight: 50,
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
});
