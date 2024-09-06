import {ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View} from "react-native";
import CustomTabView from "@/components/shared/tab";
import { Box, Center, Flex, Heading, Icon} from "native-base";
import {ENDPOINTS, KEYS} from "@/constants";
import {get, isEqual} from "lodash";
import Loader from "@/components/shared/Loader";
import clsx from "clsx";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import dayjs from "dayjs";
import {useRouter} from "expo-router";
import DocflowStatus from "@/components/doc-status";
import {useTranslation} from "react-i18next";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";

const IncomingOnSignTab = () => {
    const {t} = useTranslation()
    const router = useRouter();
    const {data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage,isLoading} = useInfiniteScroll({
        key: `${KEYS.incoming}`, url: ENDPOINTS.incoming, limit: 15, filters: {
            include: 'titleShort,cardType,correspondentTitle',
            "docStatus[]": 'on_sign',
            "filter[is_deleted][neq]": 1,
            "sort": '-id',
        }
    })

    if(isLoading){
        return <Loader />
    }

    return <FlatList data={data}
                     initialNumToRender={10}
                     onEndReached={onEndReached}
                     removeClippedSubviews={true}
                     refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
                     renderItem={(item) => {
                         return <TouchableOpacity onPress={()=>router.push(`/incoming/${get(item,'item.id')}`)}>
                             <Box
                                 className={clsx('rounded mx-1 bg-white', {'!bg-[#fffbe6]': isEqual(get(item, 'item.cardType'), "3"), '!bg-[#fff2f0]': isEqual(get(item, 'item.cardType'), "2"), '!bg-[#e6f7ff]': isEqual(get(item, 'item.cardType'), "1")})}
                                 p={3} mt={3} shadow={2}
                             >
                                 <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <DocflowStatus item={get(item, 'item', {})}  />
                                     <Text className={'text-xs'}>№{get(item, 'item.reg_no')} <Icon size={3} as={MaterialCommunityIcons} name="calendar"/> {dayjs(get(item, 'item.reg_datetime')).format("DD.MM.YYYY HH:MM")}</Text>
                                 </Flex>
                                 <Heading size={'xs'} className={'my-2'}>{get(item, 'item.titleShort', '-')}</Heading>
                                 <Flex direction={'row'}>
                                     <Icon size={4} as={MaterialCommunityIcons} name="bank"/> <Text
                                     className={'text-xs'}>{get(item, 'item.correspondentTitle', '-')}</Text>
                                 </Flex>
                             </Box>
                         </TouchableOpacity>
                     }}
                     ListEmptyComponent={
                         <Center className={'p-10 text-xl'}>{t("No data")}</Center>
                     }
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
                     keyExtractor={(item) => item.id}/>
}

const IncomingTab = () => {
    const {t} = useTranslation()
    const router = useRouter();
    const {data, isRefreshing, onRefresh, onEndReached, isFetchingNextPage,isLoading} = useInfiniteScroll({
        key: `${KEYS.incoming}-all`, url: ENDPOINTS.incoming, limit: 15, filters: {
            include: 'titleShort,cardType,correspondentTitle',
            "filter[is_deleted][neq]": 1,
            "sort": '-id',
        }
    })
    if(isLoading){
        return <Loader />
    }

    return <FlatList data={data}
                     initialNumToRender={10}
                     onEndReached={onEndReached}
                     removeClippedSubviews={true}
                     refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
                     renderItem={(item) => {
                         return <TouchableOpacity onPress={()=>router.push(`/incoming/${get(item,'item.id')}`)}><Box
                             className={clsx('rounded mx-1 bg-white', {'!bg-[#fffbe6]': isEqual(get(item, 'item.cardType'), "3"), '!bg-[#fff2f0]': isEqual(get(item, 'item.cardType'), "2"), '!bg-[#e6f7ff]': isEqual(get(item, 'item.cardType'), "1")})}
                             p={3} mt={3} shadow={2}
                         >
                             <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                 <DocflowStatus item={get(item, 'item', {})}  />
                                 <Text className={'text-xs'}>№{get(item, 'item.reg_no')} <Icon size={3} as={MaterialCommunityIcons} name="calendar"/> {dayjs(get(item, 'item.reg_datetime')).format("DD.MM.YYYY HH:MM")}</Text>
                             </Flex>
                             <Heading size={'xs'} className={'my-2'}>{get(item, 'item.titleShort', '-')}</Heading>
                             <Flex direction={'row'}>
                                 <Icon size={4} as={MaterialCommunityIcons} name="bank"/> <Text
                                 className={'text-xs'}>{get(item, 'item.correspondentTitle', '-')}</Text>
                             </Flex>
                         </Box></TouchableOpacity>
                     }}
                     ListEmptyComponent={
                         <Center className={'p-10 text-xl'}>{t("No data")}</Center>
                     }
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
                     keyExtractor={(item) => item.id}/>
}
export default function TabIncomingScreen() {
    const {t} = useTranslation()

    return (<>
            <Center flex={1} px="3" className={'bg-[#F2F2F2] flex-1 flex'}>
                <CustomTabView routes={[{key: 'first', title: t('Not signed')}, {key: 'two', title: t('All signed')}]}
                               scenes={[{key: 'first', render: () => <IncomingOnSignTab/>}, {
                                   key: 'two', render: () => <IncomingTab />
                               }]}/>
            </Center>
        </>
    );
}
