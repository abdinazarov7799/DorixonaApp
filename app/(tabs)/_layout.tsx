import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Logo from "@/components/navigation/Logo";
import { useTranslation } from "react-i18next";
import Language from "@/components/language";
import useStore from "@/store";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
    const { t } = useTranslation();
    const user = useStore(state => state.user);

    if (user === null) return <Redirect href={"/auth"} />;

    return (
        <SafeAreaView  className={'flex-1'}>
            <Tabs
                screenOptions={{
                    headerStyle: { backgroundColor: '#fff' },
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
                        headerTitleAlign: 'center',
                        headerLeft: () => <Logo />,
                        headerRight: () => <Language color={'#9F9FA0'} right={15} />,
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
                        headerTitleAlign: 'center',
                        headerLeft: () => <Logo />,
                        headerRight: () => <Language color={'#9F9FA0'} right={15} />,
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
                        headerTitleAlign: 'center',
                        headerLeft: () => <Logo />,
                        headerRight: () => <Language color={'#9F9FA0'} right={15} />,
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon name={"creditcard"} color={color} size={24} />
                        ),
                        tabBarLabel: t("To'lovlar"),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}
