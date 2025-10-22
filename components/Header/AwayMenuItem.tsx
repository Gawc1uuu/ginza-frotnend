import { CustomMenuItem } from './DynamicMenuList';
import { useGameData } from '../hooks/useGameData';
import { Action, playerAction, PokerGameState } from '../../client';
import useGameId from '../hooks/useGameID';
import useViewer from '../hooks/useViewer';
import { useToast } from '@chakra-ui/react';

const AwayMenuItem = () => {
    const gameId = useGameId();
    const { userId } = useViewer();
    const toast = useToast();

    const { players, playersToAway, gameState } = useGameData();
    const currentPlayer = players.find(
        (player: any) => player.player_id === userId,
    );

    const handleAwayClick = () => {
        if (gameState !== PokerGameState.CREATE) {
            // If already set to away next hand, error toast
            if (playersToAway.includes(userId)) {
                toast({ title: 'You are already set to away', status: 'error', duration: 2000 });
                return;
            }
            // Active game: request Away Next Hand
            playerAction({
                path: { game_id: gameId },
                body: { action: Action.AWAY_NEXT_HAND },
            })
                .then(() => {
                    toast({ title: 'You will be set away for the next hand', status: 'success' });
                })
                .catch(() => {
                    toast({ title: 'Unable to set away for next hand', status: 'error', duration: 2000 });
                });
            return;
        }
        // CREATE state: Away Now
        playerAction({
            path: { game_id: gameId },
            body: { action: Action.AWAY },
        })
            .then(() => {
                toast({ title: 'You are now away', status: 'success' });
            })
            .catch(() => {
                toast({ title: 'Unable to go away', status: 'error', duration: 2000 });
            });
    };

    return (
        <>
            <CustomMenuItem onClick={handleAwayClick} label="Away" />
        </>
    );
};

export default AwayMenuItem;
