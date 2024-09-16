import React, {useState} from 'react';
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import i18n from "@/lib/i18n";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {Button} from "native-base";

const Index = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('uzLatin');
    const {t} = useTranslation()
    const router = useRouter();

    const handleContinue = () => {
        i18n.changeLanguage(selectedLanguage);
        router.push('auth/login');
    };
    return (
        <>
            <View className={"flex-1 justify-between bg-white p-10"}>
                <View>
                    <View className={"mt-20 mb-16 w-full"}>
                        <Image source={require('@/assets/images/lang-icon.png')} style={{width: 80, height: 80, margin: "auto"}}/>
                        <Text className={'text-[28px] font-bold mb-4 mt-6 text-center'}>{t("Ilova tili")}</Text>
                        <Text className={'text-[15px] text-gray-500 mb-6 text-center'}>
                            {t("O'zingizga qulay bo'lgan tilni tanlang.")}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => setSelectedLanguage('uzLatin')}>
                        <Text className={`text-lg w-full p-4 rounded-2xl ${selectedLanguage === 'uzLatin' && 'font-bold bg-gray-100'}`}>
                            O‘zbek tili
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedLanguage('uzCyrillic')}>
                        <Text className={`text-lg w-full p-4 rounded-2xl ${selectedLanguage === 'uzCyrillic' && 'font-bold bg-gray-100'}`}>
                            Ўзбек тили
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedLanguage('ru')}>
                        <Text className={`text-lg w-full p-4 rounded-2xl ${selectedLanguage === 'ru' && 'font-bold bg-gray-100'}`}>
                            Русский язык
                        </Text>
                    </TouchableOpacity>
                </View>
                <Button onPress={handleContinue} className={'w-full p-4 text-lg bg-[#215ca0] rounded-lg'}>
                    {t("Davom eting")}
                </Button>
            </View>
        </>
    );
};

export default Index;