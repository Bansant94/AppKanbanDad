import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Card, Column } from './interfaces/board.interface';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Cliente conectado: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Cliente desconectado: ${client.id}`);
    }

    // Eventos de Columnas
    @SubscribeMessage('moveColumn')
    handleMoveColumn(@ConnectedSocket() client: Socket, @MessageBody() data: { columnId: string, newOrder: number }) {
        console.log('Mover columna:', data);
        client.broadcast.emit('columnMoved', data);
    }

    @SubscribeMessage('addColumn')
    handleAddColumn(@ConnectedSocket() client: Socket, @MessageBody() column: Column) {
        console.log('Nueva columna:', column);
        client.broadcast.emit('columnAdded', column);
    }

    @SubscribeMessage('updateColumn')
    handleUpdateColumn(@ConnectedSocket() client: Socket, @MessageBody() column: Column) {
        console.log('Actualizar columna:', column);
        client.broadcast.emit('columnUpdated', column);
    }

    @SubscribeMessage('deleteColumn')
    handleDeleteColumn(@ConnectedSocket() client: Socket, @MessageBody() columnId: string) {
        console.log('Eliminar columna:', columnId);
        client.broadcast.emit('columnDeleted', columnId);
    }

    // Eventos de Tarjetas
    @SubscribeMessage('moveCard')
    handleMoveCard(@ConnectedSocket() client: Socket, @MessageBody() data: {
        cardId: string,
        sourceColumnId: string,
        targetColumnId: string,
        newOrder: number
    }) {
        console.log('Mover tarjeta:', data);
        client.broadcast.emit('cardMoved', data);
    }

    @SubscribeMessage('addCard')
    handleAddCard(@ConnectedSocket() client: Socket, @MessageBody() card: Card) {
        console.log('Nueva tarjeta:', card);
        client.broadcast.emit('cardAdded', card);
    }

    @SubscribeMessage('updateCard')
    handleUpdateCard(@ConnectedSocket() client: Socket, @MessageBody() card: Card) {
        console.log('Actualizar tarjeta:', card);
        client.broadcast.emit('cardUpdated', card);
    }

    @SubscribeMessage('deleteCard')
    handleDeleteCard(@ConnectedSocket() client: Socket, @MessageBody() data: { cardId: string, columnId: string }) {
        console.log('Eliminar tarjeta:', data);
        client.broadcast.emit('cardDeleted', data);
    }
}