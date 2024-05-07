import { createSlice } from "@reduxjs/toolkit"

interface ModalState {
    isModalOpen: boolean
}

const initialState: ModalState = {
    isModalOpen: false
}

export const ModalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state) => {
            state.isModalOpen = true
        },
        closeModal: (state) => {
            state.isModalOpen = false
        }
    }
})

export const {openModal, closeModal} = ModalSlice.actions
export default ModalSlice.reducer

