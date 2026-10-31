import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthSession } from '../../types'

interface AuthState {
  session: AuthSession | null
}

const initialState: AuthState = { session: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<AuthSession>) {
      state.session = action.payload
    },
    signOut(state) {
      state.session = null
    },
  },
})

export const { signIn, signOut } = authSlice.actions
export default authSlice.reducer
