import CardCarousel from "@/components/shared/carousel/carousel";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "native-base";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Text,
	TextInput,
	View,
	useWindowDimensions,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	StyleSheet
} from "react-native";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import { ENDPOINTS, KEYS } from "@/constants";
import {useAuthStore} from "@/store";
import {get} from "lodash";

const Index = () => {
	const [focused, setFocused] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const [amount, setAmount] = useState(0);
	const minHeight = useWindowDimensions().height;
	const { balance } = useLocalSearchParams();
	const {user} = useAuthStore()
	const { data: myCards } = useFetchRequest({
		queryKey: KEYS.card_list,
		endpoint: ENDPOINTS.card_list,
	});
	const router = useRouter();
	const { t } = useTranslation();
	const hasCards = myCards?.length > 0;

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={[styles.flex1, { minHeight }]}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={[styles.container, { minHeight }]}>
					<View style={styles.header}>
						<View style={styles.headerLeft}>
							<Ionicons
								name="arrow-back"
								size={24}
								color="#215ca0"
								onPress={() => router.back()}
							/>
							<Text style={styles.headerTitle}>{t("Kartaga pul o'tkazish")}</Text>
						</View>
					</View>

					<View style={styles.section}>
						<Text style={styles.sectionTitle}>{t("Qayerdan")}</Text>
						<View style={styles.cardInfo}>
							<View>
								<Text style={styles.cardText}>{t("Mening hisobim")}</Text>
								<Text style={styles.cardAmount}>
									{Number(balance)?.toLocaleString("en-US")} {t("so'm")}
								</Text>
							</View>
							<View style={styles.walletIcon}>
								<Ionicons name="wallet-sharp" size={32} color="#215ca0" />
							</View>
						</View>
					</View>

					<View>
						<Text style={[styles.sectionTitle, styles.paddingHorizontal]}>
							{t("Qayerga")}
						</Text>
						{hasCards ? (
							<CardCarousel
								myCards={myCards}
								activeIndex={activeIndex}
								setActiveIndex={index => setActiveIndex(index)}
							/>
						) : (
							<TouchableOpacity
								style={styles.paddingHorizontal}
								onPress={() => router.push('/cards/add')}
							>
								<View style={styles.addCardButton}>
									<FontAwesome5 name={"plus-circle"} size={24} color="#292C30" />
									<Text style={styles.addCardText}>{t("Karta qo'shish")}</Text>
								</View>
								<Text style={styles.addCardDescription}>
									{t(
										"Pul o'tkazishdan oldin pul o'tkazmoqchi bo'lgan kartangizni qo'shishingiz kerak"
									)}
								</Text>
							</TouchableOpacity>
						)}
					</View>

					<View style={styles.amountSection}>
						<Text>{t("O'tkazma summasi")}</Text>
						<View style={styles.inputContainer}>
							<TextInput
								onFocus={() => setFocused(true)}
								onBlur={() => setFocused(false)}
								value={String(amount)}
								onChangeText={(newAmount) => {
									const numericAmount = parseInt(newAmount.replace(/[^0-9]/g, ""), 10);
									if (!isNaN(numericAmount) && numericAmount <= balance) {
										setAmount(numericAmount);
									}else if (isNaN(numericAmount)){
										setAmount('');
									}
								}}
								keyboardType="numeric"
								style={styles.amountInput}
								placeholder={`0 ${t("so'm")}`}
								placeholderTextColor={"#292C30"}
							/>


							{focused && (
								<Ionicons
									name="close"
									size={24}
									color="#292C30"
									style={styles.closeIcon}
								/>
							)}
						</View>
						<View
							style={[
								styles.divider,
								{ borderTopColor: focused ? "#246BB2" : "#e2e8f0" },
							]}
						/>
						<Text style={styles.maxAmountText}>
							{t("Minimal summa - ")}
							{Number(get(user, 'minTransactionSum', 0)).toLocaleString("en-US")} {t("so'm")}
						</Text>

						<Text style={styles.maxAmountText}>
							{t("Maksimal summa - ")}
							{Number(balance)?.toLocaleString("en-US")} {t("so'm")}
						</Text>

						<Button
							onPress={() =>
								router.push(
									`/transfer/info?cardNumber=${myCards[activeIndex].number}&cardId=${myCards[activeIndex]?.id}&amount=${amount}`
								)
							}
							isDisabled={amount < get(user, 'minTransactionSum', 1000)}
							style={styles.transferButton}
						>
							<Text style={styles.transferButtonText}>{t("Pulni o'tkazish")}</Text>
						</Button>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	flex1: { flex: 1 },
	container: {
		flex: 1,
		backgroundColor: '#F5F6F7',
		paddingTop: 90,
		paddingBottom: 70
	},
	header: {
		position: 'absolute',
		top: 0,
		width: '100%',
		paddingVertical: 17,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#919DA63D',
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerTitle: {
		marginLeft: 16,
		fontFamily: 'ALSSiriusMedium',
		fontSize: 18,
		color: '#215ca0',
	},
	section: {
		paddingHorizontal: 16,
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 13,
		fontFamily: 'ALSSiriusMedium',
		color: '#919DA6',
	},
	cardInfo: {
		padding: 16,
		flexDirection: 'row',
		backgroundColor: 'white',
		marginTop: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	cardText: {
		fontSize: 13,
		fontFamily: 'ALSSiriusRegular',
		color: '#656E78',
	},
	cardAmount: {
		fontSize: 16,
		fontFamily: 'ALSSiriusMedium',
		color: '#292C30',
	},
	walletIcon: {
		height: 32,
		width: 32,
		overflow: 'hidden',
		marginLeft: 'auto',
	},
	paddingHorizontal: {
		paddingHorizontal: 16,
	},
	addCardButton: {
		paddingHorizontal: 16,
		paddingVertical: 24,
		flexDirection: 'row',
		backgroundColor: 'white',
		marginTop: 12,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addCardText: {
		marginLeft: 16,
		fontSize: 15,
		fontFamily: 'ALSSiriusRegular',
		color: '#292C30',
	},
	addCardDescription: {
		fontSize: 13,
		fontFamily: 'ALSSiriusMedium',
		color: '#919DA6',
		marginTop: 12,
	},
	amountSection: {
		flex: 1,
		backgroundColor: 'white',
		paddingHorizontal: 16,
		paddingVertical: 24,
		marginTop: 24,
		borderRadius: 24,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 16,
	},
	amountInput: {
		fontSize: 24,
		fontFamily: 'ALSSiriusBold',
		color: '#292C30',
		marginRight: 'auto',
	},
	closeIcon: {
		marginLeft: 'auto',
	},
	divider: {
		width: '100%',
		borderTopWidth: 1,
		marginVertical: 16,
	},
	maxAmountText: {
		fontSize: 13,
		fontFamily: 'ALSSiriusMedium',
		color: '#919DA6',
		marginBottom: 5
	},
	transferButton: {
		backgroundColor: '#215ca0',
		width: '100%',
		height: 48,
		borderRadius: 8,
		marginTop: 'auto',
		justifyContent: 'center',
		alignItems: 'center',
	},
	transferButtonText: {
		color: 'white',
		fontFamily: 'ALSSiriusMedium',
		fontSize: 16,
	},
});

export default Index;
