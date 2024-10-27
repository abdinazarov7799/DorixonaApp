import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Button } from "native-base";
import useStore from "@/store";

const Index = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('uz');
    const { t } = useTranslation();
    const router = useRouter();
    const setLanguage = useStore(state => (state as any).setLang);

    const handleContinue = () => {
        i18n.changeLanguage(selectedLanguage);
        setLanguage(selectedLanguage);
        router.push('/auth/login');
    };

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.headerContainer}>
                    <Image source={require('@/assets/images/lang-icon.png')} style={styles.icon} />
                    <Text style={styles.title}>{t("Ilova tili")}</Text>
                    <Text style={styles.subtitle}>
                        {t("O'zingizga qulay bo'lgan tilni tanlang.")}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedLanguage('uz')}>
                    <Text style={[styles.languageOption, selectedLanguage === 'uz' && styles.selectedLanguage]}>
                        {t("O‘zbek tili")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedLanguage('kr')}>
                    <Text style={[styles.languageOption, selectedLanguage === 'kr' && styles.selectedLanguage]}>
                        {t("Ўзбек тили")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedLanguage('ru')}>
                    <Text style={[styles.languageOption, selectedLanguage === 'ru' && styles.selectedLanguage]}>
                        {t("Русский язык")}
                    </Text>
                </TouchableOpacity>
            </View>
            <Button onPress={handleContinue} style={styles.continueButton}>
                <Text style={styles.continueButtonText}>{t("Davom eting")}</Text>
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 20,
    },
    headerContainer: {
        marginTop: 60,
        marginBottom: 40,
        width: "100%",
        alignItems: "center",
    },
    icon: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 28,
        fontFamily: "ALSSiriusBold",
        marginVertical: 16,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: "gray",
        textAlign: "center",
        fontFamily: "ALSSiriusRegular",
    },
    languageOption: {
        fontSize: 18,
        width: "100%",
        padding: 16,
        borderRadius: 12,
        textAlign: "center",
        fontFamily: "ALSSiriusRegular",
        backgroundColor: "white",
        marginBottom: 8,
    },
    selectedLanguage: {
        fontFamily: "ALSSiriusBold",
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
    },
    continueButton: {
        width: "100%",
        paddingVertical: 16,
        backgroundColor: "#215ca0",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    continueButtonText: {
        fontFamily: "ALSSiriusRegular",
        fontSize: 18,
        color: "white",
    },
});

export default Index;
