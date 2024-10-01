import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useTranslation} from "react-i18next";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {BaseBottomSheet} from "../shared/bottom-sheet";
import {Button, Switch} from "native-base";
import {Feather, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {styled} from "nativewind";
import useStore from "@/store";
import {Link, useRouter} from "expo-router";

const StyledView = styled(View);
const StyledImage = styled(Image);
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
	const user = useStore(state => (state as any).user);
	const {t} = useTranslation();
	const handleNavigateToProfileEdit = () => {
		router.push("/profile");
		onClose();
	};
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
						<StyledTouchable className="flex-row items-center gap-3 pb-2 py-2">
							<Feather name="globe" size={24} color="#246BB2" />
							<StyledText className="text-[15px] font-ALSSiriusMedium mr-auto">
								{t("Ilova tili")}
							</StyledText>
							<StyledView className="ml-auto flex-row items-center">
								<StyledText className="text-[13px] text-[#919DA6]">
									{t("O'zbek")}
								</StyledText>
								<Feather name="chevron-right" size={18} color="#919DA6" />
							</StyledView>
						</StyledTouchable>
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
						{t("O'zbekiston Respublikasi")}
					</StyledText>
					<StyledText className="text-[#919DA6] text-center text-[13px] mt-2">
						{t("Adliya vazirligi")}
					</StyledText>
					<StyledText className="text-[#919DA6] text-center text-[13px] mt-2">
						{t("Talqin 2.0.1")}
					</StyledText>
				</StyledView>
			</BaseBottomSheet>
		</>
	);
};
