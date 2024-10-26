import React from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import usePostQuery from "@/hooks/api/usePostQuery";
import { ENDPOINTS } from "@/constants";
import { Text, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet } from "react-native";
import { Button, Input } from "native-base";
import { Formik } from "formik";
import { get } from "lodash";
import useStore from "@/store";

const SignUp = () => {
    const { t } = useTranslation();
    const { phone } = useLocalSearchParams();
    const router = useRouter();
    const setAccessToken = useStore(state => state.setAccessToken);
    const setRefreshToken = useStore(state => state.setRefreshToken);
    const setUser = useStore(state => state.setUser);
    const { mutate, isPending } = usePostQuery({});

    const onSubmit = ({ firstName, lastName }) => {
        mutate({ endpoint: ENDPOINTS.signUp, attributes: { phoneNumber: phone, firstName, lastName } }, {
            onSuccess: ({ data: response }) => {
                const user = {
                    id: response.id,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    phoneNumber: response.phoneNumber,
                };
                setUser(user);
                setRefreshToken(get(response, 'refreshToken'));
                setAccessToken(get(response, 'accessToken'));
                router.push(`/`);
            },
            onError: (e) => {
                console.log(e);
            }
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.flex}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Formik
                    onSubmit={onSubmit}
                    initialValues={{ firstName: "", lastName: "" }}
                >
                    {({
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          values,
                          errors,
                          touched,
                      }) => (
                        <View style={styles.container}>
                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>
                                    {t("Shaxsiy ma’lumotlar")}
                                </Text>
                                <Text style={styles.subHeaderText}>
                                    {t("Ismingiz va familyangizni kiriting")}
                                </Text>

                                <View style={styles.inputContainer}>
                                    <Input
                                        value={values.firstName}
                                        placeholder={t("Ismingiz")}
                                        onChangeText={handleChange("firstName")}
                                        onBlur={handleBlur("firstName")}
                                        variant={"unstyled"}
                                        style={[
                                            styles.input,
                                            (touched.firstName && errors.firstName) && styles.errorBorder,
                                        ]}
                                    />
                                    {errors.firstName && touched.firstName && (
                                        <Text style={styles.errorText}>
                                            {t(errors.firstName)}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.inputContainer}>
                                    <Input
                                        value={values.lastName}
                                        placeholder={t("Familyangiz")}
                                        onChangeText={handleChange("lastName")}
                                        onBlur={handleBlur("lastName")}
                                        variant={"unstyled"}
                                        style={[
                                            styles.input,
                                            (touched.lastName && errors.lastName) && styles.errorBorder,
                                        ]}
                                    />
                                    {errors.lastName && touched.lastName && (
                                        <Text style={styles.errorText}>
                                            {t(errors.lastName)}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <Button
                                isDisabled={!values.firstName || !values.lastName}
                                style={[
                                    styles.submitButton,
                                    (values.firstName && values.lastName) ? styles.activeButton : styles.inactiveButton,
                                ]}
                                onPress={handleSubmit}
                                isLoading={isPending}
                            >
                                {t("Davom etish")}
                            </Button>
                        </View>
                    )}
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
        padding: 24,
        maxWidth: 576,
    },
    headerContainer: {
        marginTop: 96,
        marginBottom: 40,
        width: "100%",
    },
    headerText: {
        fontSize: 28,
        fontFamily: "ALSSiriusBold",
        marginBottom: 16,
        marginTop: 24,
        textAlign: "center",
    },
    subHeaderText: {
        fontSize: 15,
        color: "gray",
        marginBottom: 32,
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        padding: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    errorBorder: {
        borderColor: "red",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
    submitButton: {
        paddingVertical: 16,
        borderRadius: 8,
    },
    activeButton: {
        backgroundColor: "#215ca0",
    },
    inactiveButton: {
        backgroundColor: "#b3c6e2",
    },
});

export default SignUp;
