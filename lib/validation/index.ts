import * as yup from "yup";
export const identifySchema = yup.object().shape({
    phone: yup.string().required("Пожалуйста, введите свой телефон!"),
});

export const loginSchema = yup.object().shape({
    password: yup.string().required("Пожалуйста, введите свой пароль!"),
});