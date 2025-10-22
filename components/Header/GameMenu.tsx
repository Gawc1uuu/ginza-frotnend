import { Menu, MenuButton, IconButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import DynamicMenuList from './DynamicMenuList';

export const GameMenu = () => {
    return (
        <Menu closeOnSelect variant="gameMenu">
            <DynamicMenuList />
            <MenuButton
                style={{ width: '40px', height: '40px' }}
                as={IconButton}
                aria-label="Menu-Button"
                variant="hamburgerMenuButton"
                icon={
                    <HamburgerIcon color="brand.accentWhite" boxSize="20px" />
                }
                borderRadius="0.75rem"
                background="linear-gradient(180deg, rgba(140, 152, 160, 0.12) 0%, rgba(14, 14, 16, 0.35) 100%), rgba(15, 16, 18, 0.9)"
                border="1px solid"
                borderColor="rgba(192, 195, 203, 0.5)"
                padding="0"
                _hover={{
                    background:
                        'linear-gradient(180deg, rgba(151, 158, 164, 0.12) 0%, rgba(24, 26, 32, 0.35) 100%), rgba(15, 16, 18, 0.9)',
                    borderColor: 'rgba(192, 195, 203, 0.8)',
                    boxShadow: '-1px 1.25px 3.5px rgba(0, 0, 0, 0.2)',
                    '& > svg': { color: 'brand.white90' },
                }}
            />
        </Menu>
    );
};
