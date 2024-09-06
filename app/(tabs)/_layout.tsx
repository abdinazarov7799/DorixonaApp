import {Redirect, Tabs} from 'expo-router';
import React from 'react';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {ENDPOINTS, KEYS} from "@/constants";
import {useGlobalContext} from "@/context";
import {isEmpty, isNil} from "lodash";
import Loader from "@/components/shared/Loader";
import {get} from "lodash";
import Logo from "@/components/navigation/Logo"
import {useTranslation} from "react-i18next";
import Language from "@/components/language";
import Back from "@/components/back";

export default function TabLayout() {
    const {t} = useTranslation()
    const {user, isLoading} = useGlobalContext();
    const {data: count} = useFetchRequest({queryKey:KEYS.count,endpoint:ENDPOINTS.count,params: {'docStatus[]': 'on_sign'},enabled:!(isEmpty(user) && isNil(user))})
    if (user === null) return <Redirect href={"/auth"}/>;
    return (
        <>
            {isLoading && <Loader />}
            <Tabs
                screenOptions={{
                    headerStyle:{backgroundColor:'#fff'},
                    tabBarActiveTintColor: '#61A689',
                    tabBarStyle: {paddingBottom: 3,backgroundColor:'#fff'},
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: '',
                        headerTitleAlign: 'center',
                        headerLeft: () => <Logo />,
                        headerRight: () => <Language color={'#9F9FA0'} right={15} />,
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>
                        ),
                        tabBarLabel: t('Главная'),
                        tabBarButton:()=>null,
                    }}
                />
                <Tabs.Screen
                    name="orders"
                    options={{
                        title: t('Orders'),
                        headerTitleAlign: 'center',
                        headerLeft: () => <Logo />,
                        headerRight: () => <Language color={'#9F9FA0'} right={15} />,
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={focused ? 'mail' : 'mail-outline'} color={color}/>
                        ),
                        tabBarLabel: t('Orders')
                    }}

                />,
                <Tabs.Screen
                    name="payments"
                    options={{
                        title: t('Payments'),
                        headerTitleAlign: 'center',
                        headerLeft: () => <Logo />,
                        headerRight: () => <Language color={'#9F9FA0'} right={15} />,
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={focused ? 'paper-plane' : 'paper-plane-outline'} color={color}/>
                        ),
                        tabBarLabel: t('Payments')
                    }}
                />
                <Tabs.Screen
                    name="modal"
                    options={{
                        headerTitleAlign: 'center',
                        headerRight: () => <Language color={'#9F9FA0'} right={15} />,
                        tabBarButton:()=>null,
                    }}
                />
            </Tabs>
        </>
    );
}
