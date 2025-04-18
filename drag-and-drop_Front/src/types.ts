export type Id = string;

export interface Columna {
    _id: string;
    titulo: string;
    orden: number;
}

export interface Tarea {
    _id: string;
    contenido: string;
    columnaId: string;
    orden: number;
}