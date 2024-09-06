import { View} from 'react-native';
import {useGlobalContext} from "@/context";
import {Box, Flex, Heading, Icon, IconButton, Text} from "native-base";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {KEYS, ENDPOINTS} from "@/constants";
import Loader from "@/components/shared/Loader";
import {get} from "lodash";
import ScreenRefreshControl from "../../components/refresh-control";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import React from "react";
import {useTranslation} from "react-i18next";
import {numberWithSpaces} from "@/helpers";
import {Redirect} from "expo-router";

export default function HomeScreen() {
    const {t} = useTranslation()
    const {user,isLoading:isLoadingAuth} = useGlobalContext();
    const {data: cardData, isLoading, refetch: refetchCardData} = useFetchRequest({
        queryKey: KEYS.departmentDaily,
        endpoint: ENDPOINTS.departmentDaily,
        params: {
            curator_id: get(user, 'id')
        },
        enabled: !!(get(user, 'id'))
    })
    if (user) return <Redirect href={"/incoming"}/>;
    return (
        <ScreenRefreshControl cb={(_setRefresh) => {
            refetchCardData();
            _setRefresh();
        }}>
            <View className={'px-4 py-5 bg-[#F2F2F2] flex-1 flex'}>
                {(isLoading || isLoadingAuth) && <Loader/>}
                <Box shadow={2}  className={'bg-white mb-4 py-2.5 px-3 rounded-lg'}>
                    <Flex direction={'row'} align={'center'}><IconButton marginRight={15}  size={10} bg={'#7FC836'} rounded={50}
                        icon={<Icon size={6} as={MaterialCommunityIcons} name={'hours-24'} color={'#fff'} />}/><View>
                        <Text >{t("Total number of documents under control")}</Text>
                        <Heading color={'#7FC836'} size={'lg'}>{numberWithSpaces(get(cardData, 'all', 0))}</Heading>
                    </View>
                    </Flex>
                </Box>
                <Box shadow={2}  className={'bg-white mb-4 py-2.5 px-3 rounded-lg'}>
                    <Flex direction={'row'} align={'center'}><IconButton marginRight={15}  size={10} bg={'#E4B33B'} rounded={50}
                                                                         icon={<Icon size={6} as={MaterialCommunityIcons} name={'hours-24'} color={'#fff'} />}/><View>
                        <Text>{t("Late completed documents")}</Text>
                        <Heading color={'#E4B33B'} size={'lg'}>{numberWithSpaces(get(cardData, 'after_take_out_able', 0))}</Heading>
                    </View>
                    </Flex>
                </Box>
                <Box shadow={2}  className={'bg-white mb-4 py-2.5 px-3 rounded-lg'}>
                    <Flex direction={'row'} align={'center'}><IconButton marginRight={15}  size={10} bg={'#73C0C0'} rounded={50}
                                                                         icon={<Icon size={6} as={MaterialCommunityIcons} name={'hours-24'} color={'#fff'} />}/><View>
                        <Text>{t("Incompleted documents")}</Text>
                        <Heading color={'#73C0C0'} size={'lg'}>{numberWithSpaces(get(cardData, 'after_take_out_able', 0))}</Heading>
                    </View>
                    </Flex>
                </Box>
                <Box shadow={2}  className={'bg-white mb-4 py-2.5 px-3 rounded-lg'}>
                    <Flex direction={'row'} align={'center'}><IconButton marginRight={15}  size={10} bg={'#DC5557'} rounded={50} icon={<Icon size={6} as={MaterialCommunityIcons} name={'hours-24'} color={'#fff'} />}/><View>
                        <Text>{t("Expired documents")}</Text>
                        <Heading color={'#DC5557'} size={'lg'}>{numberWithSpaces(get(cardData, 'after_take_out_able', 0))}</Heading>
                    </View>
                    </Flex>
                </Box>
            </View>
        </ScreenRefreshControl>
    );
}


