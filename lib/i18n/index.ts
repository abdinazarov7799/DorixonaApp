import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import I18NextHttpBackend from "i18next-http-backend";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BASE_URL} from "@/constants";

i18n
    .use({
        type: 'languageDetector',
        async: true,
        detect: async (cb: (lng: string) => void) => {
            const lng = await AsyncStorage.getItem('lang') || 'ru';
            cb(lng);
        },
    })
    .use(initReactI18next)
    .use(I18NextHttpBackend)
    .init({
        fallbackLng: 'ru',
        saveMissing: true,
        defaultNS: 'main',
        compatibilityJSON: 'v3',
        react: {
            useSuspense: false,
        },
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: `${BASE_URL}api/v1/site/translations/{{lng}}/react`,
            addPath: `${BASE_URL}api/v1/site/translations`,
        },
    });

export default i18n;
