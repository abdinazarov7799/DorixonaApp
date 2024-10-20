import React, {useState} from 'react';
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import i18n from "@/lib/i18n";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {Button} from "native-base";
import useStore from "@/store";

const Index = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('uz');
    const {t} = useTranslation()
    const router = useRouter();
    const setLanguage = useStore(state => (state as any).setLang);

    const handleContinue = () => {
        i18n.changeLanguage(selectedLanguage);
        setLanguage(selectedLanguage);
        router.push('/auth/login');
    };
    return (
        <>
            <View className={"flex-1 justify-between bg-white p-10"}>
                <View>
                    <View className={"mt-20 mb-16 w-full"}>
                        <Image source={require('@/assets/images/lang-icon.png')} style={{width: 80, height: 80, margin: "auto"}}/>
                        <Text className={'text-[28px] font-ALSSiriusBold mb-4 mt-6 text-center'}>{t("Ilova tili")}</Text>
                        <Text className={'text-[15px] text-gray-500 mb-6 text-center font-ALSSiriusRegular'}>
                            {t("O'zingizga qulay bo'lgan tilni tanlang.")}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => setSelectedLanguage('uz')}>
                        <Text className={`text-lg w-full p-4 rounded-2xl ${selectedLanguage === 'uz' && 'font-ALSSiriusBold bg-gray-100'}`}>
                            {t("O‘zbek tili")}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedLanguage('kr')}>
                        <Text className={`text-lg w-full p-4 rounded-2xl ${selectedLanguage === 'kr' && 'font-ALSSiriusBold bg-gray-100'}`}>
                            {t("Ўзбек тили")}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedLanguage('ru')}>
                        <Text className={`text-lg w-full p-4 rounded-2xl ${selectedLanguage === 'ru' && 'font-ALSSiriusBold bg-gray-100'}`}>
                            {t("Русский язык")}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Button onPress={handleContinue} className={'w-full p-4 bg-[#215ca0] rounded-lg'}>
                    <Text className={"font-ALSSiriusRegular text-lg text-white"}>{t("Davom eting")}</Text>
                </Button>
            </View>
        </>
    );
};

export default Index;