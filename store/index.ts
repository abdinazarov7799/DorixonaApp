import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

const calculateFullPrice = (orders) => {
    return orders.reduce((total, order) => total + (order.count * order.price), 0);
};

const useStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            orders: [],
            fullPrice: 0,

            setUser: (user) => set((state) => ({ ...state, user })),

            setAccessToken: (accessToken) => set((state) => ({ ...state, accessToken })),

            setRefreshToken: (refreshToken) => set((state) => ({ ...state, refreshToken })),

            clearAuthData: () => set(() => ({
                user: null,
                accessToken: null,
                refreshToken: null,
            })),

            setOrders: (orders) => set((state) => {
                const fullPrice = calculateFullPrice(orders);
                return { ...state, orders, fullPrice };
            }),

            addToOrder: (newOrder) => set((state) => {
                let updatedOrders;
                if (newOrder.count === 0 || newOrder.count === null) {
                    updatedOrders = state.orders.filter((order) => order?.id !== newOrder?.id);
                } else {
                    const existingOrderIndex = state.orders.findIndex((order) => order?.id === newOrder?.id);
                    if (existingOrderIndex !== -1) {
                        updatedOrders = [...state.orders];
                        updatedOrders[existingOrderIndex] = newOrder;
                    } else {
                        updatedOrders = [...state.orders, newOrder];
                    }
                }
                const fullPrice = calculateFullPrice(updatedOrders);
                return { ...state, orders: updatedOrders, fullPrice };
            }),

            increment: (item) => set((state) => {
                const existingOrderIndex = state.orders.findIndex((order) => order?.id === item?.id);
                let updatedOrders;
                if (existingOrderIndex !== -1) {
                    updatedOrders = [...state.orders];
                    updatedOrders[existingOrderIndex].count++;
                } else {
                    updatedOrders = [...state.orders, { ...item, count: 1 }];
                }
                const fullPrice = calculateFullPrice(updatedOrders);
                return { ...state, orders: updatedOrders, fullPrice };
            }),

            decrement: (id) => set((state) => {
                const existingOrderIndex = state.orders.findIndex((order) => order?.id === id);
                let updatedOrders;
                if (existingOrderIndex !== -1 && state.orders[existingOrderIndex].count > 1) {
                    updatedOrders = [...state.orders];
                    updatedOrders[existingOrderIndex].count--;
                } else {
                    updatedOrders = state.orders.filter((order) => order?.id !== id);
                }
                const fullPrice = calculateFullPrice(updatedOrders);
                return { ...state, orders: updatedOrders, fullPrice };
            }),
        }),
        {
            name: 'store-storage',
            storage: AsyncStorage,
            serialize: (state) => JSON.stringify(state),
            deserialize: (str) => JSON.parse(str),
        }
    )
);

export default useStore;
