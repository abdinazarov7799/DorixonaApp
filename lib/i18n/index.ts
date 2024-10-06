import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import I18NextHttpBackend from "i18next-http-backend";
import {BASE_URL} from "@/constants";
import useStore from "@/store";

i18n
    .use({
        type: 'languageDetector',
        async: true,
        detect: async (cb: (lng: string) => void) => {
            const lng = await useStore.getState().lang || 'ru';
            cb(lng);
        },
    })
    .use(initReactI18next)
    .use(I18NextHttpBackend)
    .init({
        fallbackLng: 'ru',
        saveMissing: false,
        defaultNS: 'main',
        compatibilityJSON: 'v3',
        react: {
            useSuspense: false,
        },
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: `${BASE_URL}api/admin/language/by-lang/{{lng}}`,
            addPath: `${BASE_URL}api/admin/language/create-key`,
        },
    });

export default i18n;
