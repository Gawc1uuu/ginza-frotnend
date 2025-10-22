import { Flex, useBreakpointValue } from '@chakra-ui/react';

import { TableContents } from './Table/TableContents';
import { useHasMounted } from '../LandscapeLayout';

export const PokerTable = () => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const hasMounted = useHasMounted();

    if (!hasMounted || isPortrait === undefined) {
        // Optionally render a skeleton or nothing
        return null;
    }

    return (
        <Flex
            zIndex={1000}
            w="100%"
            h="100%"
            backgroundImage={
                isPortrait
                    ? "url('/test_bg13_portrait.png')"
                    : "url('/test_bg13.png')"
            }
            backgroundSize={
                isPortrait
                    ? '122% 85%'
                    : 'min(220vmin, 100vw) min(75vmin, 75vh)'
            }
            backgroundPosition={isPortrait ? '50% 40%' : '50% 42%'}
            backgroundRepeat="no-repeat"
        >
            <TableContents />
        </Flex>
    );
};

export default PokerTable;
