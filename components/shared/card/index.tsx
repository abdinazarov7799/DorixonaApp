import React from 'react';
import {get, isEqual} from "lodash";
import {Badge, Box, Flex, Heading, Icon} from "native-base";
import {Text} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import dayjs from "dayjs";
import clsx from "clsx";

const Card = ({item}: any) => {
    return (
        <Box
            className={clsx('rounded mx-1 !bg-white', {'!bg-[#fffbe6]': isEqual(get(item, 'item.cardType'), "3"), '!bg-[#fff2f0]': isEqual(get(item, 'item.cardType'), "2"), '!bg-[#e6f7ff]': isEqual(get(item, 'item.cardType'), "1")})}
            p={3} mt={3} shadow={2}
        >
            <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Badge colorScheme={'success'}>{get(item, 'item.docStatus', '-')}</Badge>
                <Text className={'text-xs'}>№{get(item, 'item.reg_no')} <Icon size={3} as={MaterialCommunityIcons}
                                                                              name="calendar"/> {dayjs(get(item, 'item.reg_datetime')).format("DD.MM.YYYY HH:MM")}
                </Text>
            </Flex>
            <Heading size={'xs'} className={'my-2'}>{get(item, 'item.titleShort', '-')}</Heading>
            <Flex direction={'row'}>
                <Icon size={4} as={MaterialCommunityIcons} name="bank"/> <Text
                className={'text-xs'}>{get(item, 'item.correspondentTitle', '-')}</Text>
            </Flex>
        </Box>
    );
};

export default Card;