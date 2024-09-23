import axios from 'axios';

export interface Menu {
    id: number;
    name: string;
    price: number;
    image?: File | null;
    imageUrl?: string;
    companyId?: number;
}

const API_URL = '/menus';

export const getAllMenus = () => axios.get<Menu[]>(`${API_URL}/list`);

export const addMenu = (formData: FormData) =>
    axios.post(`${API_URL}/add`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const updateMenu = (menuId: number, formData: FormData) =>
    axios.put(`${API_URL}/update/${menuId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const deleteMenu = (menuId: number) =>
    axios.delete(`${API_URL}/delete/${menuId}`);
