import {useFonts} from "expo-font";
import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {useEffect} from "react";
import "react-native-reanimated";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {NativeBaseProvider} from "native-base";
import "../lib/i18n";
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {StatusBar} from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded] = useFonts({
		ALSSiriusRegular: require("../assets/fonts/ALSSirius-Regular.ttf"),
		ALSSiriusBold: require("../assets/fonts/ALSSirius-Bold.otf"),
		ALSSiriusBlack: require("../assets/fonts/ALSSirius-Black.ttf"),
		ALSSiriusMedium: require("../assets/fonts/ALSSirius-Medium.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const queryClient = new QueryClient();
	const {i18n} = useTranslation();
	const loadLanguage = async () => {
		try {
			const storedLanguage = await AsyncStorage.getItem("lang");
			if (storedLanguage) {
				i18n.changeLanguage(storedLanguage);
			}
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		loadLanguage();
	}, []);
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<GestureHandlerRootView>
					<NativeBaseProvider>
						<StatusBar style={"dark"} />
						<BottomSheetModalProvider>
							<Stack>
								<Stack.Screen name="(tabs)" options={{headerShown: false}} />
								<Stack.Screen name="basket" options={{headerShown: false}} />
								<Stack.Screen name="cards" options={{headerShown: false}} />
								<Stack.Screen
									name="transfer"
									options={{headerShown: false}}
								/>
								<Stack.Screen name="order" options={{headerShown: false}} />
								<Stack.Screen
									name="notification"
									options={{headerShown: false}}
								/>
								<Stack.Screen name="profile" options={{headerShown: false}} />
								<Stack.Screen name="+not-found" />
								<Stack.Screen name="auth" options={{headerShown: false}} />
							</Stack>
						</BottomSheetModalProvider>
					</NativeBaseProvider>
				</GestureHandlerRootView>
			</QueryClientProvider>
		</>
	);
}
