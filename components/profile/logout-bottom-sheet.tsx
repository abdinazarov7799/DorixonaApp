import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useTranslation} from "react-i18next";
import {Text, View} from "react-native";
import {BaseBottomSheet} from "../shared/bottom-sheet";
import {Button} from "native-base";
import {styled} from "nativewind";
import useStore from "@/store";
import {router} from "expo-router";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(Button);

type LogoutBottomSheetProps = {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	onClose: () => void;
};
export const LogoutBottomSheet = ({
	bottomSheetRef,
	onClose,
}: LogoutBottomSheetProps) => {
	const {t} = useTranslation();
	const clearAuthData = useStore(state => (state as any).clearAuthData);
	const logOut = () => {
		clearAuthData()
		router.push("/auth");
	}
	return (
		<BaseBottomSheet bottomSheetRef={bottomSheetRef} snap={"35%"}>
			<StyledView className="p-4 ">
				<StyledText className="text-2xl font-ALSSiriusBold mb-2">
					{t("Dasturdan chiqmoqchimisiz?")}
				</StyledText>
				<StyledText className="text-[15px] text-[#919DA6]">
					{t(
						"Chindan ham dasturdan chiqmoqchimisiz? Ehtimol behosdan bosilib ketgan boʻlishi mumkin"
					)}
				</StyledText>
				<StyledView className="flex flex-row gap-3 mt-6">
					<StyledButton className="flex-1 px-4 py-3 rounded-lg bg-[#E04917]" onPress={logOut}>
						<StyledText className="text-[15px] font-ALSSiriusMedium text-white">
							{t("Chiqish")}
						</StyledText>
					</StyledButton>
					<StyledButton
						className="flex-1 px-4 py-3 rounded-lg bg-[#B4C0CC29]"
						onPress={onClose}
					>
						<StyledText className="text-[15px] font-ALSSiriusMedium text-[#292C30]">
							{t("Bekor qilish")}
						</StyledText>
					</StyledButton>
				</StyledView>
			</StyledView>
		</BaseBottomSheet>
	);
};
