import { useWSQuery } from '../websocket/hooks/useWSQuery';

const useUser = (userId: string | undefined) => {
    // const { data: user } = useWSQuery(WebsocketsQueries.getUserById, {
    //     userId,
    // }, Boolean(userId));

    // return {
    //     user: user,
    //     userId,
    //     isLoading: user === undefined,
    // };
};

export default useUser;
