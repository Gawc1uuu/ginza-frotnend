import { Button } from '@chakra-ui/react';
import { SignInButton, SignOutButton } from '@clerk/nextjs';
import React from 'react';

const buttonStyle = {
    variant: 'landingPageButton',
    py: '1rem',
    px: '2rem',
};

export const GinzaSignInButton: React.FC<{ label?: string }> = ({
    label = 'Log In',
}) => {
    return (
        <SignInButton mode="modal">
            <Button {...buttonStyle}>{label}</Button>
        </SignInButton>
    );
};

export const GinzaSignOutButton = () => {
    return (
        <SignOutButton>
            <Button {...buttonStyle}>Sign Out</Button>
        </SignOutButton>
    );
};
