import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OwnerRegisterFormData } from '../schema/user.schema';

interface OwnerState {
    registrationData: OwnerRegisterFormData;
}

const initialState: OwnerState = {
    registrationData: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        stadium_name: '',
        address: '',
    }
};

const ownerSlice = createSlice({
    name: 'owner',
    initialState,
    reducers: {
        setRegistrationData: (state, action: PayloadAction<OwnerRegisterFormData>) => {
            state.registrationData = action.payload;
        },
        clearRegistrationData: (state) => {
            state.registrationData = initialState.registrationData;
        }
    }
});

export const { setRegistrationData, clearRegistrationData } = ownerSlice.actions;
export default ownerSlice.reducer;
