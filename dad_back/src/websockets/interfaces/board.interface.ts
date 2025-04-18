export interface Card {
    id: string;
    title: string;
    description?: string;
    columnId: string;
    order: number;
}

export interface Column {
    id: string;
    title: string;
    order: number;
    cards: Card[];
}

export interface Board {
    id: string;
    title: string;
    columns: Column[];
} 