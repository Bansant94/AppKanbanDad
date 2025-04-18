import axios from 'axios';
import { Columna, Tarea } from '../types';

const API_URL = 'http://localhost:3000';

export const apiService = {
    // Columnas
    async getColumnas(): Promise<Columna[]> {
        const response = await axios.get(`${API_URL}/columnas`);
        return response.data;
    },

    async createColumna(titulo: string): Promise<Columna> {
        const response = await axios.post(`${API_URL}/columnas`, { titulo });
        return response.data;
    },

    async updateColumna(id: string, titulo: string): Promise<Columna> {
        const response = await axios.put(`${API_URL}/columnas/${id}`, { titulo });
        return response.data;
    },

    async deleteColumna(id: string): Promise<void> {
        await axios.delete(`${API_URL}/columnas/${id}`);
    },

    async updateColumnaOrden(id: string, orden: number): Promise<Columna> {
        const response = await axios.put(`${API_URL}/columnas/${id}/orden`, { orden });
        return response.data;
    },

    // Tareas
    async getTareas(columnaId?: string): Promise<Tarea[]> {
        const url = columnaId
            ? `${API_URL}/tareas?columnaId=${columnaId}`
            : `${API_URL}/tareas`;
        const response = await axios.get(url);
        return response.data;
    },

    async createTarea(contenido: string, columnaId: string, orden: number): Promise<Tarea> {
        const response = await axios.post(`${API_URL}/tareas`, {
            contenido,
            columnaId,
            orden
        });
        return response.data;
    },

    async updateTarea(id: string, contenido: string): Promise<Tarea> {
        const response = await axios.put(`${API_URL}/tareas/${id}`, { contenido });
        return response.data;
    },

    async deleteTarea(id: string): Promise<void> {
        await axios.delete(`${API_URL}/tareas/${id}`);
    },

    async updateTareaOrden(id: string, orden: number, columnaId?: string): Promise<Tarea> {
        const response = await axios.put(`${API_URL}/tareas/${id}/orden`, {
            orden,
            columnaId
        });
        return response.data;
    }
}; 