import { useContext, useEffect, useRef } from 'react';

export const useWSMutation = (mutation:any) => {
    // const { socket } = useContext(WebSocketContext);

    // const mutate = <T = unknown>(
    //     args: Record<string, any>,
    // ) => {

    //     let timeoutId: number | null = null;

    //     const mutationPromise = new Promise<T>((resolve, reject) => {
    //         const requestId = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    //         const onResponse = (data: T) => {
    //             resolve(data);
    //             socket.current?.socket?.removeAllListeners(`${mutation}:${requestId}`);
    //             socket.current?.socket?.removeAllListeners(`${mutation}:${requestId}:error`);
    //             timeoutId && window.clearTimeout(timeoutId);
    //         };

    //         const onError = (error: any) => {
    //             reject(error);
    //             socket.current?.socket?.removeAllListeners(`${mutation}:${requestId}`);
    //             socket.current?.socket?.removeAllListeners(`${mutation}:${requestId}:error`);
    //             timeoutId && window.clearTimeout(timeoutId);
    //         };

    //         socket.current?.socket?.on(`${mutation}:${requestId}`, onResponse);
    //         socket.current?.socket?.on(`${mutation}:${requestId}:error`, onError);
    //         socket.current?.emit(mutation, { ...args, _requestId: requestId });
    //     });

    //     const timeoutPromise = new Promise<never>((_, reject) => {
    //         timeoutId = window.setTimeout(() => {
    //             reject(new Error('Request timed out after 20 seconds.'));
               
    //         }, 20000);
    //     });

    //     return Promise.race([
    //         mutationPromise,
    //         timeoutPromise,
    //     ]);
    // };

    // return mutate;
};
