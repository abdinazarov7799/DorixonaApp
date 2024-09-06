import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';
import {useColorScheme} from '@/hooks/useColorScheme';
import {Provider} from "@/context";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {NativeBaseProvider} from "native-base";
import "../lib/i18n"
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }


    return (
        <RootLayoutNav/>
    );
}

function RootLayoutNav() {
    const queryClient = new QueryClient();
    const colorScheme = useColorScheme();
    const {i18n} = useTranslation();
    const loadLanguage = async () => {
        try {
            const storedLanguage = await AsyncStorage.getItem('lang');
            if (storedLanguage) {
                i18n.changeLanguage(storedLanguage);
            }
        } catch (e) {
            console.log(e)
        }

    }
    useEffect(() => {
        loadLanguage()
    }, []);
    return (<>
            <QueryClientProvider client={queryClient}>
                <Provider>
                    <NativeBaseProvider>
                            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                            <Stack>
                                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                                <Stack.Screen name="+not-found"/>
                                <Stack.Screen name="auth" options={{headerShown: false}}/>
                            </Stack>
                        </ThemeProvider>
                    </NativeBaseProvider>
                </Provider>
            </QueryClientProvider>
        </>
    )
}