import { usePathname } from 'next/navigation';

export const useGameId = () => {
    const pathname = usePathname();
    const gameId = pathname?.split('/').pop() as string;
    return gameId;
};

export default useGameId;
