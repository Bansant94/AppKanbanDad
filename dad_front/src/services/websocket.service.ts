import { io, Socket } from 'socket.io-client';
import { Columna, Tarea, CardMoveData, ColumnMoveData } from '../types';

class WebSocketService {
    private socket: Socket | null = null;
    private static instance: WebSocketService;

    private constructor() {
        this.socket = io('http://localhost:3000', {
            transports: ['websocket'],
            autoConnect: false
        });

        // Agregar listeners de conexión
        this.socket.on('connect', () => {
            console.log('WebSocket conectado');
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket desconectado');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Error de conexión WebSocket:', error);
        });
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public connect() {
        if (this.socket && !this.socket.connected) {
            console.log('Intentando conectar WebSocket...');
            this.socket.connect();
        }
    }

    public disconnect() {
        if (this.socket && this.socket.connected) {
            console.log('Desconectando WebSocket...');
            this.socket.disconnect();
        }
    }

    // Eventos de Columnas
    public onColumnMoved(callback: (data: ColumnMoveData) => void) {
        this.socket?.on('columnMoved', (data) => {
            console.log('Evento columnMoved recibido:', data);
            callback(data);
        });
    }

    public onColumnAdded(callback: (column: Columna) => void) {
        this.socket?.on('columnAdded', (column) => {
            console.log('Evento columnAdded recibido:', column);
            callback(column);
        });
    }

    public onColumnUpdated(callback: (column: Columna) => void) {
        this.socket?.on('columnUpdated', (column) => {
            console.log('Evento columnUpdated recibido:', column);
            callback(column);
        });
    }

    public onColumnDeleted(callback: (columnId: string) => void) {
        this.socket?.on('columnDeleted', (columnId) => {
            console.log('Evento columnDeleted recibido:', columnId);
            callback(columnId);
        });
    }

    // Eventos de Tarjetas
    public onCardMoved(callback: (data: CardMoveData) => void) {
        this.socket?.on('cardMoved', (data) => {
            console.log('Evento cardMoved recibido:', data);
            callback(data);
        });
    }

    public onCardAdded(callback: (card: Tarea) => void) {
        this.socket?.on('cardAdded', (card) => {
            console.log('Evento cardAdded recibido:', card);
            callback(card);
        });
    }

    public onCardUpdated(callback: (card: Tarea) => void) {
        this.socket?.on('cardUpdated', (card) => {
            console.log('Evento cardUpdated recibido:', card);
            callback(card);
        });
    }

    public onCardDeleted(callback: (data: { cardId: string, columnId: string }) => void) {
        this.socket?.on('cardDeleted', (data) => {
            console.log('Evento cardDeleted recibido:', data);
            callback(data);
        });
    }

    // Emitir eventos
    public emitMoveColumn(data: ColumnMoveData) {
        console.log('Emitiendo evento moveColumn:', data);
        this.socket?.emit('moveColumn', data);
    }

    public emitAddColumn(column: Columna) {
        console.log('Emitiendo evento addColumn:', column);
        this.socket?.emit('addColumn', column);
    }

    public emitUpdateColumn(column: Columna) {
        console.log('Emitiendo evento updateColumn:', column);
        this.socket?.emit('updateColumn', column);
    }

    public emitDeleteColumn(columnId: string) {
        console.log('Emitiendo evento deleteColumn:', columnId);
        this.socket?.emit('deleteColumn', columnId);
    }

    public emitMoveCard(data: CardMoveData) {
        console.log('Emitiendo evento moveCard:', data);
        this.socket?.emit('moveCard', data);
    }

    public emitAddCard(card: Tarea) {
        console.log('Emitiendo evento addCard:', card);
        this.socket?.emit('addCard', card);
    }

    public emitUpdateCard(card: Tarea) {
        console.log('Emitiendo evento updateCard:', card);
        this.socket?.emit('updateCard', card);
    }

    public emitDeleteCard(data: { cardId: string, columnId: string }) {
        console.log('Emitiendo evento deleteCard:', data);
        this.socket?.emit('deleteCard', data);
    }
}

export const websocketService = WebSocketService.getInstance(); 