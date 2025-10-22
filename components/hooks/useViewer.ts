import { useWSQuery } from '../websocket/hooks/useWSQuery';
import useWSAuth from '../websocket/hooks/useWSAuth';
import { useEffect } from 'react';

const useViewer = () => {
    // const { isAuthorized } = useWSAuth();
    // const { data: user } = useWSQuery<{ id: string; role: string }>(
    //     WebsocketsQueries.findCurrentUser,
    // );
    // return {
    //     isLoading: isAuthorized && !user,
    //     isAuthenticated: isAuthorized && user,
    //     user,
    //     userId: user?.id ?? '',
    //     isAdmin: user?.role === 'ADMIN',
    //     isModerator: user?.role === 'MODERATOR',
    // };
};

export default useViewer;
