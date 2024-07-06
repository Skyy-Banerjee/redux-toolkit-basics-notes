import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartItems from '../../cartItems'

const url = 'https://www.course-api.com/react-useReducer-cart-project';


//initial state
const initialState = {
    cartItems: cartItems,
    amount: 4,
    total: 0,
    isLoading: true,
}

//asyncThunk
export const getCartItems = createAsyncThunk('cart/getCartItems', () => {
    return fetch(url).then(resp => resp.json()).catch(err => console.log(err));
})

//reducer f(x)
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter(item => item.id !== itemId)
        },
        increase: (state, { payload }) => {
            const cartItem = state.cartItems.find(item => item.id === payload.id);
            cartItem.amount = cartItem.amount + 1;
        },
        decrease: (state, { payload }) => {
            const cartItem = state.cartItems.find(item => item.id === payload.id);
            cartItem.amount = cartItem.amount - 1;
        },
        calculateTotals: (state) => {
            let amt = 0;
            let tot = 0;
            state.cartItems.forEach(item => {
                amt += item.amount;
                tot += item.amount * item.price;
            }),
                state.amount = amt;
            state.total = tot;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                // console.log(action);
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(getCartItems.rejected, (state, action) => {
                console.log(action);
                state.isLoading = false;
            });
    },
});

//console.log(cartSlice);

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;