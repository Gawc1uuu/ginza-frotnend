import { useCallback } from "react";
import { HttpNamespaces, HttpMutations } from "../../../../../packages/shared/http.events";
import { useHttpClient } from "./useHttpClient";
const useMutation = <T = unknown>(namespace: HttpNamespaces, mutation: HttpMutations) => {
    const httpClient = useHttpClient();
    
    return useCallback((args: Record<string, any>) => {
        return httpClient.mutation<T>(namespace, mutation, args);
    }, [httpClient, namespace, mutation]);
};

export default useMutation;