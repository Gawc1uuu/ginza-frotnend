import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';
import HttpClient from '../HttpClient';

export const useHttpClient = () => {
    const { getToken } = useAuth();
    const client = useMemo(() => new HttpClient(getToken), [getToken]);
    return client;
};
