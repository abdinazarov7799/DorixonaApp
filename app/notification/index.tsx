import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import {
	FlatList,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions, RefreshControl, ActivityIndicator,
} from "react-native";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {ENDPOINTS, KEYS} from "@/constants";
import {get} from "lodash";
import React from "react";

const Index = () => {
	const {t} = useTranslation();
	const router = useRouter();
	const minHeight = useWindowDimensions().height;
	const { data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage,isLoading } = useInfiniteScroll({
		key: KEYS.notification_get_mine,
		url: ENDPOINTS.notification_get_mine,
		limit: 20,
	});
	console.log(data)
	return (
		<View
			className="flex-1  bg-[#F5F6F7] relative pt-[60px] "
			style={{minHeight}}
		>
			<View className="absolute top-0 w-[100vw] py-[17px] px-[20px] flex-row justify-between border-b border-[#919DA63D]">
				<View className="flex-row items-center gap-4">
					<Ionicons
						name="arrow-back"
						size={24}
						color="#215ca0"
						onPress={() => router.back()}
					/>
					<Text className={"ml-[16px] font-ALSSiriusMedium text-[18px]"}>
						{t("Xabarnomalar")}
					</Text>
				</View>
			</View>
			<FlatList
				onEndReached={onEndReached}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
				keyExtractor={item => get(item,'id')}
				data={data}
				ListFooterComponent={
					<View style={{
						flexDirection: 'row',
						height: 100,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						{isFetchingNextPage && <ActivityIndicator/>}
					</View>
				}
				renderItem={({item}) => (
					<TouchableOpacity className="p-4 pl-0 border-b border-[#919DA63D] flex-row">
						<View className="w-2 justify-center items-center px-3">
							<View
								className={`w-2 h-2 rounded-full ${
									get(item,'viewed') && "bg-[#215CA0]"
								}`}
							/>
						</View>
						<View className="flex-1">
							<View className="flex-row items-center">
								<Text className="font-ALSSiriusMedium text-[15px]">{t(get(item,'type'))}</Text>
								<Text className="ml-auto mr-1 text-[13px] text-[#919DA6]">
									{new Date(get(item,'createdTime')).toLocaleString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Text>
								<Ionicons name="chevron-forward" size={14} color="#215ca0" />
							</View>
							<Text className="text-[13px] text-[#919DA6]">
								{get(item,'description')}
							</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
};

export default Index;
