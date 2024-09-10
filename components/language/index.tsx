import React, {useEffect, useState} from 'react';
import {Pressable} from "react-native";
import {Icon, Menu} from "native-base";
import {MaterialIcons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import {LANGUAGES} from "@/constants";
import {get, isEqual} from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Index = ({color='#fff',right=0}) => {
    const {t, i18n} = useTranslation()
    const [lang, setLang] = useState('ru');

    const changeLanguage = async (_lang: string) => {
        setLang(_lang);
        i18n.changeLanguage(_lang);
        try {
            await AsyncStorage.setItem('lang', _lang);
        } catch (e) {
            console.log('error')
        }
    }
    const loadLanguage = async () => {
        try {
            const storedLanguage = await AsyncStorage.getItem('lang');
            if (storedLanguage) {
                setLang(storedLanguage)
            }
        } catch (e) {
            console.log(e)
        }

    }
    useEffect(() => {
        loadLanguage();
    }, []);
    return (
        <>
            <Menu  w="70" trigger={triggerProps => {
                return <Pressable accessibilityLabel="Lang" {...triggerProps}>
                    <Icon right={right} color={color} size={7} as={MaterialIcons} name="language"/>
                </Pressable>;
            }}>
                {LANGUAGES.map(item => <Menu.Item  bg={isEqual(lang, get(item, 'lang')) ? '#60A689' : ''}
                                                  onPress={() => changeLanguage(get(item, 'lang'))}>{t(get(item, 'title'))}</Menu.Item>)}
            </Menu>
        </>
    );
};

export default Index;