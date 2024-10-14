import {Redirect, Tabs} from "expo-router";
import React, {useRef} from "react";
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {useTranslation} from "react-i18next";
import useStore from "@/store";
import {Bell} from "@/components/navigation/bell";
import {Bars} from "@/components/navigation/bars";
import {ProfileBottomSheet} from "@/components/profile";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {LogoutBottomSheet} from "@/components/profile/logout-bottom-sheet";

export default function TabLayout() {
	const profileSheetRef = useRef<BottomSheetModal>(null);
	const logoutSheetRef = useRef<BottomSheetModal>(null);
	const {t} = useTranslation();
	const user = useStore(state => (state as any).user);

	if (user === null) return <Redirect href={"/auth"} />;

	const openProfile = () => {
		profileSheetRef.current?.present();
	};
	const openLogout = () => {
		logoutSheetRef.current?.present();
	};

	const onClose = () => {
		profileSheetRef.current?.dismiss();
	};
	const onLogoutClose = () => {
		logoutSheetRef.current?.dismiss();
	};
	return (
		<>
			<ProfileBottomSheet
				bottomSheetRef={profileSheetRef}
				onClose={onClose}
				onLogout={openLogout}
			/>
			<LogoutBottomSheet
				bottomSheetRef={logoutSheetRef}
				onClose={onLogoutClose}
			/>
			<Tabs
				screenOptions={{
					headerStyle: {backgroundColor: "#fff"},
					tabBarActiveTintColor: "#215ca0",
					tabBarStyle: {paddingTop: 2, backgroundColor: "#fff"},
					headerTintColor: "#000",
					headerTitleStyle: {fontFamily: 'ALSSiriusMedium' },
					tabBarLabelStyle: {fontSize: 12, fontFamily: 'ALSSiriusMedium' ,},
				}}
			>
				<Tabs.Screen
					name="index"
					key="home"
					options={{
						title: t("Bosh oyna"),
						headerTitleAlign: "left",
						headerLeft: () => <Bars onPress={openProfile} />,
						headerRight: Bell,
						tabBarIcon: ({color}) => (
							<TabBarIcon name={"home"} color={color} size={24} />
						),
						tabBarLabel: t("Bosh oyna"),
					}}
				/>
				<Tabs.Screen
					name="orders"
					key="orders"
					options={{
						title: t("Buyurtmalar"),
						headerTitleAlign: "left",
						headerLeft: () => <Bars onPress={openProfile} />,
						headerRight: Bell,
						tabBarIcon: ({color}) => (
							<TabBarIcon name={"clockcircleo"} color={color} size={24} />
						),
						tabBarLabel: t("Buyurtmalar"),
					}}
				/>
				<Tabs.Screen
					name="payments"
					key="payments"
					options={{
						title: t("To'lovlar"),
						headerTitleAlign: "left",
						headerLeft: () => <Bars onPress={openProfile} />,
						headerRight: Bell,
						tabBarIcon: ({color}) => (
							<TabBarIcon name={"creditcard"} color={color} size={24} />
						),
						tabBarLabel: t("To'lovlar"),
					}}
				/>
				<Tabs.Screen
					name="report"
					key="report"
					options={{
						title: t("Hisobot"),
						headerTitleAlign: "left",
						headerLeft: () => <Bars onPress={openProfile} />,
						headerRight: Bell,
						tabBarIcon: ({color}) => (
							<TabBarIcon name={"swap"} color={color} size={24} />
						),
						tabBarLabel: t("Hisobot"),
					}}
				/>
			</Tabs>
		</>
	);
}
