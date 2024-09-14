import {create} from 'zustand';

const useStore = create((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    orders: [],
    setUser: (user: any) => set((state: any) => ({...state, user})),
    setAccessToken: (accessToken: any) => set((state: any) => ({...state, accessToken})),
    setRefreshToken: (refreshToken: any) => set((state: any) => ({...state, refreshToken})),
    clearAuthData: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
    }),
    setOrders: (orders) => set(state => {
        return {...state, orders}
    }),
    addToOrder: (newOrder) => set((state) => {
        if (newOrder.count === 0 || newOrder.count === null) {
            const updatedOrders = state.orders.filter(order => order?.id !== newOrder?.id);
            return { ...state, orders: updatedOrders };
        } else {
            const existingOrderIndex = state.orders.findIndex(order => order?.id === newOrder?.id);
            if (existingOrderIndex !== -1) {
                const updatedOrders = [...state.orders];
                updatedOrders[existingOrderIndex] = newOrder;
                return { ...state, orders: updatedOrders };
            } else {
                return { ...state, orders: [...state.orders, newOrder] };
            }
        }
    }),
    increment: (item) =>
        set((state) => {
            const existingOrderIndex = state.orders.findIndex((order) => order?.id === item?.id);
            if (existingOrderIndex !== -1) {
                const updatedOrders = [...state.orders];
                updatedOrders[existingOrderIndex].count++;
                return { ...state, orders: updatedOrders };
            } else {
                const newItem = { ...item, count: 1};
                return { ...state, orders: [...state.orders, newItem] };
            }
        }),
    decrement: (id) =>
        set((state) => {
            const existingOrderIndex = state.orders.findIndex((order) => order?.id === id);
            if (existingOrderIndex !== -1 && state.orders[existingOrderIndex].count > 1) {
                const updatedOrders = [...state.orders];
                updatedOrders[existingOrderIndex].count--;
                return { ...state, orders: updatedOrders };
            }else {
                const updatedOrders = state.orders.filter(order => order?.id !== id);
                return { ...state, orders: updatedOrders };
            }
        }),
}));

export default useStore;