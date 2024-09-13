import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTranslation } from "react-i18next";
import useStore from "@/store";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
    const { t } = useTranslation();
    const user = useStore(state => state.user);

    if (user === null) return <Redirect href={"/auth"} />;

    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: '#fff'},
                tabBarActiveTintColor: '#215ca0',
                tabBarStyle: { paddingBottom: 3, backgroundColor: '#fff' },
                headerTintColor: "#000",
                tabBarLabelStyle: {fontSize: 11},
            }}
        >
            <Tabs.Screen
                name="index"
                key="home"
                options={{
                    title: t('Bosh oyna'),
                    headerTitleAlign: 'left',
                    headerLeft: () => <TabBarIcon name={"bars"} style={{marginLeft: 15}} color={"#215ca0"} size={28} />,
                    headerRight: () => <TabBarIcon name={"bells"} style={{marginRight: 15}} color={"#215ca0"} size={28} />,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name={"home"} color={color} size={24} />
                    ),
                    tabBarLabel: t('Bosh oyna'),
                }}
            />
            <Tabs.Screen
                name="orders"
                key="orders"
                options={{
                    title: t('Buyurtmalar'),
                    headerTitleAlign: 'left',
                    headerLeft: () => <TabBarIcon name={"bars"} style={{marginLeft: 15}} color={"#215ca0"} size={28} />,
                    headerRight: () => <TabBarIcon name={"bells"} style={{marginRight: 15}} color={"#215ca0"} size={28} />,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name={'clockcircleo'} color={color} size={24} />
                    ),
                    tabBarLabel: t('Buyurtmalar'),
                }}
            />
            <Tabs.Screen
                name="payments"
                key="payments"
                options={{
                    title: t("To'lovlar"),
                    headerTitleAlign: 'left',
                    headerLeft: () => <TabBarIcon name={"bars"} style={{marginLeft: 15}} color={"#215ca0"} size={28} />,
                    headerRight: () => <TabBarIcon name={"bells"} style={{marginRight: 15}} color={"#215ca0"} size={28} />,
                    tabBarIcon: ({ color }) => (
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
                    headerTitleAlign: 'left',
                    headerLeft: () => <TabBarIcon name={"bars"} style={{marginLeft: 15}} color={"#215ca0"} size={28} />,
                    headerRight: () => <TabBarIcon name={"bells"} style={{marginRight: 15}} color={"#215ca0"} size={28} />,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name={"swap"} color={color} size={24} />
                    ),
                    tabBarLabel: t("Hisobot"),
                }}
            />
        </Tabs>
    );
}
