import React from 'react';
import {Box, Flex, Icon, Text} from "native-base";
import {useTranslation} from "react-i18next";
import {AntDesign} from "@expo/vector-icons";

const Success = ({message = 'Error'}) => {
    const {t} = useTranslation()
    return (
        <Box bgColor="success.500" px="2" py="1" rounded="sm" mr={3}>
            <Flex direction="row" alignItems={'center'}><Icon color={'#fff'} mr={1} name={'checkcircleo'}
                                                              as={AntDesign}/><Text
                color={'#fff'}>{t(message)}</Text></Flex>
        </Box>
    );
};

export default Success;