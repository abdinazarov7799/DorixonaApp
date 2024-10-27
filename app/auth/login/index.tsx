import React from 'react';
import { View, Text, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { identifySchema } from "@/lib/validation";
import { Button } from 'native-base';
import MaskInput from 'react-native-mask-input';
import { useTranslation } from "react-i18next";
import usePostQuery from "@/hooks/api/usePostQuery";
import { ENDPOINTS } from "@/constants";
import { isEqual } from "lodash";

const Index = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { mutate, isPending } = usePostQuery({});

    const onSubmit = ({ phone }) => {
        mutate({ endpoint: ENDPOINTS.signIn, attributes: { phoneNumber: phone } }, {
            onSuccess: ({ data: response }) => {
                if (isEqual(response, "OTP is sent")) {
                    router.push(`/auth/login/${phone}`);
                }
            },
            onError: (e) => {
                console.log(e);
            }
        });
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Formik
                    onSubmit={onSubmit}
                    initialValues={{ phone: "" }}
                    validationSchema={identifySchema}
                >
                    {({
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          values,
                          errors,
                          touched,
                      }) => {
                        const handlePhoneChange = (value) => {
                            handleChange("phone")(value);
                            if (value.length === 17) {
                                handleSubmit();
                            }
                        };
                        return (
                            <View style={styles.container}>
                                <View style={styles.headerContainer}>
                                    <Image
                                        source={require('@/assets/images/phone-icon.png')}
                                        style={styles.icon}
                                    />
                                    <Text style={styles.title}>
                                        {t("Telefon raqamingiz")}
                                    </Text>
                                    <Text style={styles.subtitle}>
                                        {t("Ro‘yxatdan o‘tish uchun telefon raqamingizni kiriting")}
                                    </Text>
                                    <MaskInput
                                        style={[
                                            styles.input,
                                            !errors.phone && !touched.phone && styles.inputDefault,
                                            errors.phone && touched.phone && styles.inputError,
                                            touched.phone && !errors.phone && styles.inputFocused
                                        ]}
                                        placeholder="+998"
                                        placeholderTextColor="#888"
                                        keyboardType="phone-pad"
                                        maxLength={17}
                                        height={45}
                                        onBlur={handleBlur("phone")}
                                        value={values.phone}
                                        onChangeText={handlePhoneChange}
                                        mask={['+', '9', '9', '8', ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                                    />
                                    {errors.phone && touched.phone && (
                                        <Text style={styles.errorText}>
                                            {t(errors.phone)}
                                        </Text>
                                    )}
                                </View>
                                <Button onPress={handleSubmit} style={styles.submitButton} isLoading={isPending}>
                                    <Text style={styles.submitButtonText}>{t("Davom eting")}</Text>
                                </Button>
                            </View>
                        );
                    }}
                </Formik>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
        width: "100%",
        padding: 20,
        maxWidth: 576,
    },
    headerContainer: {
        marginTop: 112,
        marginBottom: 20,
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
        marginBottom: 16,
        marginTop: 24,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: "gray",
        marginBottom: 24,
        textAlign: "center",
        fontFamily: "ALSSiriusRegular",
    },
    input: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
        fontSize: 16,
        fontFamily: "ALSSiriusRegular",
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        width: "100%",
    },
    inputDefault: {
        borderColor: "#ccc",
    },
    inputError: {
        borderColor: "red",
    },
    inputFocused: {
        borderColor: "blue",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
    submitButton: {
        width: "100%",
        paddingVertical: 16,
        backgroundColor: "#215ca0",
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonText: {
        fontFamily: "ALSSiriusRegular",
        fontSize: 18,
        color: "white",
    },
});

export default Index;
