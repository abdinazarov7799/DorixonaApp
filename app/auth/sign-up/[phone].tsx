import React from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/context";
import { useTranslation } from "react-i18next";
import usePostQuery from "@/hooks/api/usePostQuery";
import { ENDPOINTS } from "@/constants";
import { Text, View } from "react-native";
import { Button, Input } from "native-base";
import { Formik } from "formik";
import clsx from "clsx";

const SignUp = () => {
    const { t } = useTranslation();
    const { setToken } = useGlobalContext();
    const { phone } = useLocalSearchParams();
    const router = useRouter();
    const { mutate, isPending } = usePostQuery({});

    const onSubmit = ({ firstName, lastName }: any) => {
        mutate({ endpoint: ENDPOINTS.signUp, attributes: { phone, firstName, lastName } }, {
            onSuccess: ({ data: response }) => {
                console.log(response);
            },
            onError: (e) => {
                console.log(e);
            }
        });
    };

    return (
        <>
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
                    <View className={'flex-1 bg-gray-100 justify-between w-full p-6 max-w-[576px]'}>
                        <View className={"mt-24 mb-10 w-full"}>
                            <Text className={'text-[28px] font-bold mb-4 mt-6 text-center'}>
                                {t("Shaxsiy ma’lumotlar")}
                            </Text>
                            <Text className={'text-[15px] text-gray-500 mb-8 text-center'}>
                                {t("Ismingiz va familyangizni kiriting")}
                            </Text>

                            {/* First Name Input */}
                            <View className={"mb-4"}>
                                <Input
                                    value={values.firstName}
                                    placeholder={t("Ismingiz")}
                                    onChangeText={handleChange("firstName")}
                                    onBlur={handleBlur("firstName")}
                                    className={clsx('p-4 rounded-lg bg-white', {
                                        'border border-red-500': errors.firstName && touched.firstName,
                                    })}
                                />
                                {errors.firstName && touched.firstName && (
                                    <Text className={'text-red-500 font-normal text-xs mt-1'}>
                                        {t(errors.firstName)}
                                    </Text>
                                )}
                            </View>

                            {/* Last Name Input */}
                            <Input
                                value={values.lastName}
                                placeholder={t("Familyangiz")}
                                onChangeText={handleChange("lastName")}
                                onBlur={handleBlur("lastName")}
                                className={clsx('p-4 rounded-lg bg-white', {
                                    'border border-red-500': errors.lastName && touched.lastName,
                                })}
                            />
                            {errors.lastName && touched.lastName && (
                                <Text className={'text-red-500 font-normal text-xs mt-1'}>
                                    {t(errors.lastName)}
                                </Text>
                            )}
                        </View>

                        {/* Continue Button */}
                        <Button
                            isDisabled={!values.firstName || !values.lastName}
                            className={clsx('mt-4 p-4 rounded-lg text-white', {
                                'bg-blue-500': values.firstName && values.lastName,
                                'bg-blue-300': !values.firstName || !values.lastName,
                            })}
                            onPress={handleSubmit}
                        >
                            {t("Davom etish")}
                        </Button>
                    </View>
                )}
            </Formik>
        </>
    );
};

export default SignUp;
