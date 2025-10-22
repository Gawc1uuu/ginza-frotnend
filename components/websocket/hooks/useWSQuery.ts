import { useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useWSQuery = <T>(
    query: string,
    args: Record<string, any> = {},
    enabled = true,
    options?: {
        refetchOnMount?: boolean
    }
) => {
    // const { socket, isConnected, isAuthorized } = useContext(WebSocketContext);
    // const queryClient = useQueryClient();

    // const lastIsConnected = useRef(isConnected);
    // const lastIsAuthorized = useRef(isAuthorized);
    // const didMountRef = useRef(false);

    // useEffect(() => {
    //     const onResponse = (resp: {response: T, version?: number}) => {
    //         queryClient.setQueryData(
    //             [query, getHashForArgs(args)],
    //             {
    //                 response: JSON.parse(JSON.stringify(resp.response)),
    //                 version: resp.version,
    //             },
    //         );
    //     };

    //     const onError = (error: any) => {
    //        // ignore
    //     };

    //     const onUpdate = (update: {changes: any, version: number}) => {
    //         const data = JSON.parse(JSON.stringify(queryClient.getQueryData([query, getHashForArgs(args)]))) as {response: T, version: number};
    //         // Check if data exists before applying changes

    //         if (!data || !update.version || !data.version) {
    //             console.log('No data or version', data, update, query);
    //             socket.current?.emit(query, args);
    //             return;
    //         }
            
    //         // Only apply update if the version is newer
    //         if (data.version === update.version) {
    //             return;
    //         }

    //         if (update.version - data.version !== 1) {
    //             socket.current?.emit(query, args);
    //             return;
    //         }

    //         try {
    //             const newData = jsondiffpatch.patch(data.response, update.changes) as T;

    //             queryClient.setQueryData(
    //                 [query, getHashForArgs(args)],
    //                 null,
    //             );    

    //             queryClient.setQueryData(
    //                 [query, getHashForArgs(args)],
    //                 {
    //                     response: JSON.parse(JSON.stringify(newData)),
    //                     version: update.version,
    //                 },
    //             );
    //         } catch (error) {
    //             socket.current?.emit(query, args);
    //         }
    //     };

    //     socket.current?.on(`${query}:${getHashForArgs(args)}:response`, onResponse);
    //     socket.current?.on(`${query}:${getHashForArgs(args)}:error`, onError);
    //     socket.current?.on(`${query}:${getHashForArgs(args)}:update`, onUpdate);

    //     return () => {
    //         socket.current?.off(`${query}:${getHashForArgs(args)}:response`, onResponse);
    //         socket.current?.off(`${query}:${getHashForArgs(args)}:error`, onError);
    //         socket.current?.off(`${query}:${getHashForArgs(args)}:update`, onUpdate);
    //     };
    // }, [query, args, enabled, queryClient, isConnected]);

    // useEffect(() => {
    //     if (enabled && isConnected) {
    //         const hasCache =
    //             queryClient.getQueryData([query, getHashForArgs(args)]) !== undefined;
    //         const sameConnectionState =
    //             lastIsConnected.current === isConnected &&
    //             lastIsAuthorized.current === isAuthorized;
    //         const isFirstRun = !didMountRef.current;

    //         if (hasCache && sameConnectionState) {
    //             if (isFirstRun) {
    //                 if (options?.refetchOnMount === true) {
    //                     socket.current?.emit(query, args);
    //                 }
    //             }
    //         } else {
    //             socket.current?.emit(query, args);
    //         }
    //     }

    //     lastIsConnected.current = isConnected;
    //     lastIsAuthorized.current = isAuthorized;
    //     didMountRef.current = true;
    // }, [isConnected, query, args, enabled, isAuthorized, options]);

    // const { data } = useQuery<{response: T, version: number}>({
    //     queryKey: [query, getHashForArgs(args)],
    //     queryFn: () => new Promise(() => {}),
    //     enabled,
    // });

    // return {data: data?.response as T};
};
