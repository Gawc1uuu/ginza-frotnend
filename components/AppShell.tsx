'use client';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { theme } from '../styles/theme';
import { ClerkProvider } from '@clerk/nextjs';
import { AuthModalProvider } from './Shared/AuthModalContext';


export const AppShell = ({ children }: { children: React.ReactNode }) => {
    return (
            <ChakraProvider theme={theme}>
                <ClerkProvider
                    publishableKey={
                        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!
                    }
                >
                        <AuthModalProvider>
                            {children}
                        </AuthModalProvider>
                </ClerkProvider>
            </ChakraProvider>
    );
};

export default AppShell;
