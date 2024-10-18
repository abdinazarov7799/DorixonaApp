import * as yup from "yup";
export const identifySchema = yup.object().shape({
	phone: yup.string().required("Пожалуйста, введите свой телефон!"),
});

export const loginSchema = yup.object().shape({
	password: yup.string().required("Пожалуйста, введите свой пароль!"),
});

export const addCardSchema = yup.object().shape({
	//  card number must start one of these valuse 8600, 9860 or 6440.
	// card number must be 16 digits
	cardNumber: yup
		.string()
		.matches(
			/^(8600|9860|6440|5614)/,
			"Kechirasiz bunday raqamlar bilan boshlanadigan kartani qoʻshib boʻlmaydi. Qaytadan urinib koʻring"
		)
		.required("Iltimos, karta raqamini kiriting")
		.length(16, "Karta raqami 16 ta raqamdan iborat boʻlishi kerak"),
	cardName: yup.string(),
});
