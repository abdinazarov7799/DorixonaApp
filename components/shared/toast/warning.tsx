import React from 'react';
import {Box} from "native-base";
import {useTranslation} from "react-i18next";

const Warning = ({message='Warning'}) => {
    const {t} = useTranslation()
    return (
        <Box bg="emerald.500" px="2" py="1" rounded="sm">
            {t(message)}
        </Box>
    );
};

export default Warning;