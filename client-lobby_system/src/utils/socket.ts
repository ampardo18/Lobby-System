import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(token: string): Socket {

    if(!socket || socket.disconnected){
        socket = io(import.meta.env.VITE_PUBLIC_HOST, {
            auth: { token }
        })
    }

    return socket

}