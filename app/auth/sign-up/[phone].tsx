import React from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import usePostQuery from "@/hooks/api/usePostQuery";
import { ENDPOINTS } from "@/constants";
import { Text, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, Input } from "native-base";
import { Formik } from "formik";
import clsx from "clsx";
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

    const onSubmit = ({ firstName, lastName }: any) => {
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
            style={{ flex: 1 }}
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
                        <View className={'flex-1 bg-white justify-between w-full p-6 max-w-[576px]'}>
                            <View className={"mt-24 mb-10 w-full"}>
                                <Text className={'text-[28px] font-ALSSiriusBold mb-4 mt-6 text-center'}>
                                    {t("Shaxsiy ma’lumotlar")}
                                </Text>
                                <Text className={'text-[15px] text-gray-500 mb-8 text-center'}>
                                    {t("Ismingiz va familyangizni kiriting")}
                                </Text>

                                <View className={"mb-4"}>
                                    <Input
                                        value={values.firstName}
                                        placeholder={t("Ismingiz")}
                                        onChangeText={handleChange("firstName")}
                                        onBlur={handleBlur("firstName")}
                                        variant={"unstyled"}
                                        className={clsx('p-4 bg-white bg-gray-100 rounded-lg border border-gray-300', {
                                            'border-red-500': errors.firstName && touched.firstName,
                                        })}
                                    />
                                    {errors.firstName && touched.firstName && (
                                        <Text className={'text-red-500 font-normal text-xs mt-1'}>
                                            {t(errors.firstName)}
                                        </Text>
                                    )}
                                </View>

                                <Input
                                    value={values.lastName}
                                    placeholder={t("Familyangiz")}
                                    onChangeText={handleChange("lastName")}
                                    onBlur={handleBlur("lastName")}
                                    variant={"unstyled"}
                                    className={clsx('p-4 bg-white bg-gray-100 rounded-lg border border-gray-300', {
                                        'border-red-500': errors.lastName && touched.lastName,
                                    })}
                                />
                                {errors.lastName && touched.lastName && (
                                    <Text className={'text-red-500 font-normal text-xs mt-1'}>
                                        {t(errors.lastName)}
                                    </Text>
                                )}
                            </View>

                            <Button
                                isDisabled={!values.firstName || !values.lastName}
                                className={clsx('mt-4 p-4 rounded-lg text-white', {
                                    'bg-[#215ca0]': values.firstName && values.lastName,
                                    'bg-blue-300': !values.firstName || !values.lastName,
                                })}
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

export default SignUp;
