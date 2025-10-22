import { GameDetails } from '../../hooks/useGameHistory';
import { GameMode } from '../../../client';
import { useRouter } from 'next/navigation';
import { GameDataResponse } from '../../../../../packages/shared/shared.types';

export function useGameCard(game: any, gameData?: any) {
    const router = useRouter();

    const handleRejoinGame = () => {
        router.push(`/poker/${game.game_id}`);
    };

    const smallBlind: number = gameData?.gameData?.game_settings?.small_blind_value ?? 0;
    const bigBlind: number = gameData?.gameData?.game_settings?.big_blind_value ?? 0;
    const gameMode = gameData?.gameData?.game_settings?.game_mode ?? GameMode.NLH;
    const nonce = gameData?.gameData?.nonce ?? 1;

    return {
        handleRejoinGame,
        smallBlind,
        bigBlind,
        gameMode,
        nonce,
    };
}
