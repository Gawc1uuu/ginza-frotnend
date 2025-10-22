// import io, { Socket } from 'socket.io-client';
// import {
//     createContext,
//     useEffect,
//     useState,
//     useRef,
//     useCallback,
//     RefObject,
// } from 'react';
// import { useAuth } from '@clerk/nextjs';
// // import { WebsocketsQueries } from '../../../../packages/shared/websockets.events';
// // import { getHashForArgs } from './functions/getHashForArgs';
// import { HEALTH_CHECK_INTERVAL, HEALTH_CHECK_TIMEOUT } from './constants';

// // Queue system with 5 seats
// interface QueuedQuery {
//     query: WebsocketsQueries;
//     args: Record<string, any>;
//     resolve: (response: any) => void;
//     reject: (error: any) => void;
//     timestamp: number;
// }

// class WebSocketQueue {
//     private seats: Map<string, QueuedQuery> = new Map();
//     private queue: QueuedQuery[] = [];
//     private maxSeats = 5;
//     private socket: Socket | null = null;

//     setSocket(socket: Socket) {
//         this.socket = socket;
//         this.processQueue();
//     }

//     private getQueryKey(
//         query: WebsocketsQueries,
//         args: Record<string, any>,
//     ): string {
//         return `${query}:${getHashForArgs(args)}`;
//     }

//     private getQueryKeyFromArgsHash(
//         query: WebsocketsQueries,
//         argsHash: string,
//     ): string {
//         return `${query}:${argsHash}`;
//     }

//     private isSeatAvailable(): boolean {
//         return this.seats.size < this.maxSeats;
//     }

//     private processQueue() {
//         if (
//             !this.socket ||
//             this.queue.length === 0 ||
//             !this.isSeatAvailable()
//         ) {
//             return;
//         }

//         const query = this.queue.shift();
//         if (query) {
//             this.sendQuery(query);
//         }
//     }

//     private sendQuery(query: QueuedQuery) {
//         const key = this.getQueryKey(query.query, query.args);

//         // Add to active seats
//         this.seats.set(key, query);

//         // Send the query
//         this.socket!.emit(query.query, query.args);
//     }

//     private freeSeat(key: string) {
//         this.seats.delete(key);
//         this.processQueue();
//     }

//     enqueue(query: WebsocketsQueries, args: Record<string, any>): Promise<any> {
//         return new Promise((resolve, reject) => {
//             const queuedQuery: QueuedQuery = {
//                 query,
//                 args,
//                 resolve,
//                 reject,
//                 timestamp: Date.now(),
//             };

//             const key = this.getQueryKey(query, args);

//             // Check if already in seats (duplicate request)
//             if (this.seats.has(key)) {
//                 // Just return early for duplicate requests
//                 return;
//             }

//             // Check if already in queue (duplicate request)
//             const existingInQueue = this.queue.find(
//                 (q) => this.getQueryKey(q.query, q.args) === key,
//             );
//             if (existingInQueue) {
//                 // Just return early for duplicate requests in queue
//                 return;
//             }

//             if (this.isSeatAvailable() && this.socket) {
//                 // Send immediately if seat available
//                 this.sendQuery(queuedQuery);
//             } else {
//                 // Add to queue
//                 this.queue.push(queuedQuery);
//             }
//         });
//     }

//     handleResponse(
//         query: WebsocketsQueries,
//         argsHash: string,
//         response: any,
//     ) {
//         const key = this.getQueryKeyFromArgsHash(query, argsHash);
//         const queuedQuery = this.seats.get(key);

//         if (queuedQuery) {
//             queuedQuery.resolve(response);
//             this.freeSeat(key);
//         }
//     }

//     handleError(
//         query: WebsocketsQueries,
//         argsHash: string,
//         error: any,
//     ) {
//         const key = this.getQueryKeyFromArgsHash(query, argsHash);
//         const queuedQuery = this.seats.get(key);

//         if (queuedQuery) {
//             this.freeSeat(key);
//             queuedQuery.reject(error);
//         }
//     }

//     getStatus() {
//         return {
//             activeSeats: this.seats.size,
//             maxSeats: this.maxSeats,
//             queueLength: this.queue.length,
//         };
//     }

//     clearSeats() {
//         this.seats.clear();
//     }
// }

// // Socket wrapper that handles queueing automatically
// class QueuedSocket {
//     private queue: WebSocketQueue;
//     private pendingQueries: Map<string, Record<string, any>> = new Map();
//     socket: Socket | null = null;
//     isConnected = false;

//     constructor(queue: WebSocketQueue, socket: Socket) {
//         this.socket = socket;
//         this.queue = queue;
//         this.queue.setSocket(socket);
//     }

//     setIsConnected(connected: boolean) {
//         this.isConnected = connected;
//     }

//     emit(event: string, args: Record<string, any>) {
//         if (!this.isConnected) {
//             return;
//         }

//         if (!this.socket) {
//             console.warn('[WS Queue] Socket not available, cannot emit');
//             return;
//         }

//         // Check if this is a query that should be queued
//         if (event.startsWith('query:')) {
//             const query = event as WebsocketsQueries;
//             const queryArgs = args[0] || {};

//             // Store the args for this query so we can handle the response
//             const queryKey = `${query}:${getHashForArgs(args)}`;
//             this.pendingQueries.set(queryKey, queryArgs);

//             // Enqueue the query
//             this.queue.enqueue(query, args).catch((error) => {
//                 console.error('Error enqueuing query', error);
//             });
//         } else {
//             // For non-query events (like mutations), emit directly
//             this.socket?.emit(event, args);
//         }
//     }

//     on(
//         event: string,
//         callback: (data: any) => void,
//     ) {
//         if (!this.socket) {
//             console.warn(
//                 '[WS Queue] Socket not available, cannot add listener',
//             );

//             return;
//         }

//         // Wrap the callback to handle responses for queued queries
//         if (event.startsWith('query:') && event.endsWith(':response')) {
//             const originalCallback = callback;
//             const wrappedCallback = (data: any) => {
//                 // Extract query from the event

//                 const eventParts = event.split(':');
//                 const queryEvent = eventParts[0] + ':' + eventParts[1] as WebsocketsQueries;

//                 const argsHash = eventParts[2];

//                 // Handle response in queue with the specific args
//                 this.queue.handleResponse(queryEvent, argsHash, data);

//                 // Call original callback with the full response
//                 originalCallback(data);
//             };

//             this.socket?.on(event, wrappedCallback);
//         } 
//         else if (event.startsWith('query:') && event.endsWith(':error')) {
//             const originalCallback = callback;
//             const wrappedCallback = (error: any) => {
//                 const eventParts = event.split(':');
//                 const queryEvent = eventParts[0] + ':' + eventParts[1] as WebsocketsQueries;
//                 const argsHash = eventParts[2];

//                 // Handle error in queue with the specific args
//                 this.queue.handleError(queryEvent, argsHash, error);

//                 // Call original callback with the full response
//                 originalCallback(error);
//             };
//             this.socket?.on(event, wrappedCallback);
//         }
//         else {
//             this.socket?.on(event, callback);
//         }
//     }

//     off(event: string, callback?: (...args: any[]) => void) {
//         this.socket?.off(event, callback);
//     }

//     disconnect() {
//         this.socket?.disconnect();
//     }
// }

// export const WebSocketContext = createContext<{
//     socket: RefObject<QueuedSocket | null>;
//     isConnected: boolean;
//     isAuthorized: boolean;
// }>({
//     socket: { current: null },
//     isConnected: false,
//     isAuthorized: false,
// });

// const reconnectionOptions = {
//     reconnection: true, // Enable reconnection
//     reconnectionAttempts: Infinity, // Number of reconnection attempts before giving up
//     reconnectionDelay: 250, // Initial delay before attempting a new reconnection
//     reconnectionDelayMax: 10000, // Maximum delay between reconnection attempts
//     randomizationFactor: 0.5, // Randomization factor to vary the delay slightly
//     autoConnect: true,
// };

// export const WebSocketProvider = ({
//     children,
// }: {
//     children: React.ReactNode;
// }) => {
//     const queue = useRef(new WebSocketQueue());
//     const socket = useRef<QueuedSocket | null>(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const [isAuthorized, setIsAuthorized] = useState(false);
//     const healthCheckInterval = useRef<number | null>(null);
//     const lastHealthCheckTimestamp = useRef<number | undefined>(undefined);
//     const isPendingConnectionTimestamp = useRef<number | null>(null);

//     const { getToken, isSignedIn: isAuthenticated } = useAuth();
//     const disconnectSocket = useCallback(() => {
//         if (isPendingConnectionTimestamp.current && Date.now() - isPendingConnectionTimestamp.current < HEALTH_CHECK_TIMEOUT) {
//             return;
//         }

//         socket.current && socket.current.socket?.disconnect();
//         socket.current && socket.current.socket?.removeAllListeners()
//         socket.current = null;
//         setIsConnected(false);
//         setIsAuthorized(false);
//         queue.current.clearSeats();
//     }, []);
//     const createSocket = useCallback(async () => {
//         const token = await getToken({ skipCache: true });

//         if (socket.current) {
//             return;
//         }

//         if (isPendingConnectionTimestamp.current && Date.now() - isPendingConnectionTimestamp.current < HEALTH_CHECK_TIMEOUT) {
//             console.log('[WS] already pending connection');
//             return;
//         }

//         isPendingConnectionTimestamp.current = Date.now();

//         const newSocket = io(
//             `${process.env.NEXT_PUBLIC_BUSINESS_WS!}/entrypoint`,
//             {
//                 transports: ['websocket'],
//                 ...reconnectionOptions,
//                 auth: {
//                     token,
//                 },
//             },
//         );

//         socket.current = new QueuedSocket(queue.current, newSocket);

//         socket.current.socket?.on('connect', () => {
//             console.log('[WS] Connected');
//             lastHealthCheckTimestamp.current = Date.now();
//             socket.current && socket.current.setIsConnected(true);
//             setIsConnected(true);
//             isPendingConnectionTimestamp.current = null;
//             lastHealthCheckTimestamp.current = Date.now();
//         });

//         socket.current.socket?.on(LifecycleEvents.SOCKET_AUTHORIZED, () => {
//             console.log('[WS] Authorized');
//             lastHealthCheckTimestamp.current = Date.now();
//             setIsAuthorized(true);
//         });

//         socket.current.socket?.on('disconnect', async () => {
//             console.log('[WS] Disconnected');
//             socket.current!.socket!.auth = {
//                 token: await getToken({ skipCache: true }),
//             };
//             socket.current && socket.current.setIsConnected(false);
//             isPendingConnectionTimestamp.current = null;
//             setIsConnected(false);
//             setIsAuthorized(false);
//             queue.current.clearSeats();
//         });

//         socket.current.socket?.on('reconnect_attempt', async () => {
//             console.log('[WS] Reconnect attempt');

//             socket.current!.socket!.auth = {
//                 token: await getToken({ skipCache: true }),
//             };
//         });

//         socket.current.socket?.on('reconnect_error', async (error) => {
//             socket.current!.socket!.auth = {
//                 token: await getToken({ skipCache: true }),
//             };
//             isPendingConnectionTimestamp.current = null;
//             console.log('[WS] Reconnect error', error);
//         });

//         socket.current.socket?.on('reconnect_failed', async () => {
//             socket.current!.socket!.auth = {
//                 token: await getToken({ skipCache: true }),
//             };
//             isPendingConnectionTimestamp.current = null;
//             console.log('[WS] Reconnect failed');
//         });

//         socket.current.socket?.on('connect_error', async (error) => {
//             socket.current!.socket!.auth = {
//                 token: await getToken({ skipCache: true }),
//             };
//             isPendingConnectionTimestamp.current = null;
//             console.log('[WS] Connect error', error);
//         });

//         socket.current.socket?.on('connect_timeout', async (error) => {
//             socket.current!.socket!.auth = {
//                 token: await getToken({ skipCache: true }),
//             };
//             isPendingConnectionTimestamp.current = null;
//             console.log('[WS] Connect timeout', error);
//         });

//         socket.current.socket?.on(LifecycleEvents.HEALTH_CHECK, () => {
//             if (socket.current && !socket.current.isConnected) {
//                 socket.current.setIsConnected(true);
//                 setIsConnected(true);
//             }

//             lastHealthCheckTimestamp.current = Date.now();
//         });
//         socket.current.socket?.on(LifecycleEvents.SOCKET_REFRESH_TOKEN, async (error) => {
//             console.log('[WS] Refresh token');
//             disconnectSocket();
//             await createSocket();
//         });
//     }, [getToken]);

//     useEffect(() => {
//         createSocket();

//         return () => {
//             disconnectSocket();
//         };
//     }, [createSocket, isAuthenticated, disconnectSocket]);

//     useEffect(() => {
//         healthCheckInterval.current = window.setInterval(() => {
//             if (Date.now() - (lastHealthCheckTimestamp.current || 0) > HEALTH_CHECK_TIMEOUT) {
//                 console.log('[WS] connection dead');
//                 disconnectSocket();
//                 setTimeout(createSocket, Math.random() * 1000);
//             }
//         }, HEALTH_CHECK_INTERVAL);

//         return () => {
//             if (healthCheckInterval.current) {
//                 window.clearInterval(healthCheckInterval.current);
//             }
//         };
//     }, [createSocket]);

//     return (
//         <WebSocketContext.Provider
//             value={{ socket, isConnected, isAuthorized }}
//         >
//             {children}
//         </WebSocketContext.Provider>
//     );
// };
