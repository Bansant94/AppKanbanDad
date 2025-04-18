export type Id = string;

export interface Tarea {
    _id: Id;
    contenido: string;
    columnaId: Id;
    orden: number;
}

export interface Columna {
    _id: Id;
    titulo: string;
    orden: number;
}

// Tipos para eventos WebSocket
export interface CardMoveData {
    cardId: string;
    sourceColumnId: string;
    targetColumnId: string;
    newOrder: number;
}

export interface ColumnMoveData {
    columnId: string;
    newOrder: number;
}

export interface CardDeleteData {
    cardId: Id;
    columnId: Id;
} 