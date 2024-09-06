import i18next from 'i18next';

const useLanguage = () => {
    const language = i18next.language as 'uz' | 'en' | 'ru';

    return {
        language,
    };
};

export default useLanguage;
