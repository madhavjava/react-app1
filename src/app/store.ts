import { configureStore } from '@reduxjs/toolkit'
import { studentsApiSlice } from '../features/students/studentsApiSlice'

export const store = configureStore({
  reducer: {
    [studentsApiSlice.reducerPath]: studentsApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(studentsApiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
