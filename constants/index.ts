export const BASE_URL = "https://jurabek-lab.medias.uz/";
export const ENDPOINTS = {
    getMe: 'api/app/auth/me',
    signIn: 'api/app/auth/sign-in',
    signUp: 'api/app/auth/sign-up',
    orderAdd: 'api/app/orders/add',
    getOrder: 'api/app/orders/get',
    order_get_mine: 'api/app/orders/get-mine',
    get_product: 'api/app/products',
    region_list: 'api/app/pharmacy/regions',
    district_list: 'api/app/pharmacy/districts',
    pharmacy_list: 'api/app/pharmacy/get',
    transaction_history_list: 'api/app/transactions/get-history',
    transaction_info: 'api/app/transactions/info',
    card_list: "api/app/transactions/cards",
    card_add: "api/app/transactions/add-card",
    card_edit: "api/app/transactions/edit-card",
    card_delete: "api/app/transactions/delete-card",
    withdraw: "api/app/transactions/withdraw",
}

export const KEYS = {
    getMe: 'getMe',
    getOrder: "getOrder",
    signIn: 'signIn',
    signUp: 'signUp',
    orderAdd: 'orderAdd',
    order_get_mine: 'order_get_mine',
    get_product: 'get_product',
    region_list: "region_list",
    district_list: "district_list",
    pharmacy_list: "pharmacy_list",
    transaction_history_list: "transaction_history_list",
    transaction_info: "transaction_info",
    card_list: "card_list"
}
export const LANGUAGES = [{lang:'uz',title:'UZ'},{lang:'kr',title:'KR'},{lang:'ru',title:'RU'}]