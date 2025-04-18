import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    handleConnection(client: any) {
        console.log('Cliente conectado:', client.id);
    }

    handleDisconnect(client: any) {
        console.log('Cliente desconectado:', client.id);
    }
} 