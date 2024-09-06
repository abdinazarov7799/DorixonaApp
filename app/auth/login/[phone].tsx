import React from 'react';
import {Text, TextInput, View} from "react-native";
import {useRouter, useLocalSearchParams} from "expo-router";
import {Formik} from "formik";
import {loginSchema} from "@/lib/validation";
import {Button, Heading} from 'native-base';
import {useGlobalContext} from "@/context";
import clsx from "clsx";
import usePostQuery from "@/hooks/api/usePostQuery";
import {ENDPOINTS} from "@/constants";
import {get, head} from "lodash";
import {useTranslation} from "react-i18next";

const Login = () => {
    const {t} = useTranslation()
    const {setToken} = useGlobalContext()
    const {phone} = useLocalSearchParams();
    const router = useRouter();
    const {mutate:loginRequest,isPending} = usePostQuery({})
    const onSubmit = (atrrs:any,{setErrors}:any) => {
        loginRequest({endpoint:ENDPOINTS.login,attributes:atrrs},{
            onSuccess:({data:response})=>{
                setToken(get(response,'token'))
            },
            onError:(error)=>{
                setErrors({password:get(head(get(error, 'response.data', [])),'message','Error')})
            }
        })
    }
    return (
        <>
            <Formik
                onSubmit={onSubmit}
                initialValues={{phone: phone?.slice(3), password: ""}}
                validationSchema={loginSchema}
            >
                {
                    ({
                         handleChange,
                         handleBlur,
                         handleSubmit,
                         values,
                         errors,
                         touched,
                     }) => {
                        return (<View className={'w-full px-10 max-w-[576px]'}>
                            <Heading className={'mb-4 font-semibold'}>{t("Введите ваш пароль")}</Heading>
                            <TextInput
                                onBlur={handleBlur("password")}
                                className={clsx('font-light py-1 px-4  border rounded text-sm border-[#61A689]',{'border-red-500':errors.password && touched.password})}
                                value={values.password}
                                onChangeText={handleChange("password")}
                                placeholder={t("Пароль")}
                                secureTextEntry
                                mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                            />
                            {errors.password && touched.password && (
                                <Text className={'text-red-500 font-normal text-xs mt-1'}>
                                    {t(errors.password)}
                                </Text>
                            )}
                            <Button isLoading={isPending}   className={"mt-4 rounded  text-base bg-[#61A689]"} mode="contained"
                                    onPress={handleSubmit}>
                                {t("Войти")}
                            </Button>
                            <Button icon={'arrow-left'}   className={'mt-4 rounded  bg-[#73C0C0]'} mode="contained"
                                    onPress={()=>router.push('/auth')}>
                                {t("Назад")}
                            </Button>

                        </View>)
                    }
                }
            </Formik>
        </>
    );
};

export default Login;