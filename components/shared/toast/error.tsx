import React from 'react';
import {Box, Flex, Icon, Text} from "native-base";
import {useTranslation} from "react-i18next";
import {MaterialIcons} from "@expo/vector-icons";

const Error = ({message = 'Error'}) => {
    const {t} = useTranslation()
    return (
        <Box bgColor="red.500" px="2" py="1" rounded="sm" mr={3}>
            <Flex direction="row" alignItems={'center'}><Icon color={'#fff'} mr={1} name={'error-outline'}
                                                              as={MaterialIcons}/><Text
                color={'#fff'}>{t(message)}</Text></Flex>
        </Box>
    );
};

export default Error;