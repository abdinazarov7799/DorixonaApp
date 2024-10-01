import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useTranslation} from "react-i18next";
import {View, Text, Image} from "react-native";
import {BaseBottomSheet} from "../shared/bottom-sheet";
import {Ionicons} from "@expo/vector-icons";
import {styled} from "nativewind";
import {ActionItemProps} from "@/app/(tabs)/report";

const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledText = styled(Text);

type HistoryBottomSheetProps = {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	transaction: ActionItemProps | null;
	onClose: () => void;
};
export const HistoryBottomSheet = ({
	bottomSheetRef,
	transaction,
	onClose,
}: HistoryBottomSheetProps) => {
	const {t} = useTranslation();
	const isSuccessful = transaction?.status === "DONE";
	return (
		<BaseBottomSheet
			bottomSheetRef={bottomSheetRef}
			snap={isSuccessful ? "65%" : "55%"}
		>
			<StyledView className="px-4 relative">
				<StyledView className="w-full items-end">
					<Ionicons name="close" size={24} color="black" onPress={onClose} />
				</StyledView>
				<StyledView className="items-center">
					<StyledView className="w-20 h-20 ">
						<StyledImage
							className="h-full w-full"
							source={
								isSuccessful
									? require("@/assets/images/success.png")
									: require("@/assets/images/exclamation.png")
							}
						/>
					</StyledView>
					<StyledText className="text-lg font-semibold">
						{t(
							isSuccessful
								? "Kartaga pul oʻtkazildi"
								: "Pul o'tkazish kutilmoqda"
						)}
					</StyledText>
					<StyledText className="text-[28px] font-ALSSiriusBold">
						{Math.abs(Number(transaction?.amount)).toLocaleString("en-US")} {t("so'm")}
					</StyledText>
					<StyledText className="text-[16px] text-[#656E78]">
						{transaction?.cardType} ····
						{String(transaction?.cardNumber).slice(-4)}
					</StyledText>
				</StyledView>
				<StyledView className="pt-10 gap-3">
					{isSuccessful && (
						<StyledView className="flex-row justify-between flex-1">
							<StyledText className="text-[15px] text-[#919DA6]">
								{t("Yuboruvchi")}
							</StyledText>
							<StyledText className="text-[15px]">
								{t("Jurabek LAB")}
							</StyledText>
						</StyledView>
					)}
					<StyledView className="flex-row justify-between flex-1">
						<StyledText className="text-[15px] text-[#919DA6]">
							{t("Qabul qiluvchi")}
						</StyledText>
						<StyledText className="text-[15px]">
							{t(transaction?.cardNumber!)}
						</StyledText>
					</StyledView>
					<StyledView className="flex-row justify-between flex-1">
						<StyledText className="text-[15px] text-[#919DA6]">
							{t("So'rov yuborilgan vaqti")}
						</StyledText>
						<StyledText className="text-[15px]">
							{t("18-avgust, 09:28")}
						</StyledText>
					</StyledView>
					{isSuccessful && (
						<StyledView className="flex-row justify-between flex-1">
							<StyledText className="text-[15px] text-[#919DA6]">
								{t("Tasdiqlangan vaqti")}
							</StyledText>
							<StyledText className="text-[15px]">
								{t("18-avgust, 09:28")}
							</StyledText>
						</StyledView>
					)}
					<StyledView className="flex-row justify-between flex-1">
						<StyledText className="text-[15px] text-[#919DA6]">
							{t("Tranzaksiya raqami")}
						</StyledText>
						<StyledText className="text-[15px]">{t("38941831")}</StyledText>
					</StyledView>
					<StyledView className="flex-row justify-between flex-1">
						<StyledText className="text-[15px] text-[#919DA6]">
							{t("O'tkazma summasi")}
						</StyledText>
						<StyledText className="text-[15px]">
							{t(Math.abs(Number(transaction?.amount)).toLocaleString("en-US"))}{" "}
							{t("so'm")}
						</StyledText>
					</StyledView>
				</StyledView>
			</StyledView>
		</BaseBottomSheet>
	);
};
