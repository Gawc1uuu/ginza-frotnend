'use client';

import { useAuth } from '@clerk/nextjs';
import { client } from '../client/sdk.gen';

export const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return process.env.NEXT_PUBLIC_API_BASE_URL;
    }

    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
        return 'https://api.ginzagaming.com';
    }
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
        const branchNumber = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID;
        return `https://ginza-ginza-pr-${branchNumber}.up.railway.app`;
    }
    return 'http://localhost:8000';
};

export function FetchAuthWrapper({ children }: { children: React.ReactNode }) {
    const { getToken, isLoaded, isSignedIn, userId, sessionId } = useAuth();

    if (isLoaded && isSignedIn && userId && sessionId) {
        const getAuth = async () => {
            const token = await getToken();
            return token;
        };
        client.setConfig({
            auth: getAuth,
            security: [
                {
                    in: 'header',
                    name: 'Authorization',
                    scheme: 'bearer',
                    type: 'http',
                },
            ],
            baseUrl: getBaseUrl(),
        });
    } else {
        client.setConfig({
            baseUrl: getBaseUrl(),
        });
    }
    return <>{children}</>;
}
