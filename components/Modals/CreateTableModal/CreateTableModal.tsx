import { Button, useToast } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { GameOptions } from './GameOptions';
import { GameMode } from '../../../client/types.gen';
import { useRouter } from 'next/navigation';
import { GinzaSurface } from '../GinzaModal';
import {
    CreateTableFormValues,
    defaultValues,
    createTableSchema,
} from './schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';

interface CreateTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameMode: GameMode;
}

export const CreateTableModal = ({
    isOpen,
    onClose,
    gameMode,
}: CreateTableModalProps) => {
    const methods = useForm<CreateTableFormValues>({
        resolver: yupResolver(createTableSchema) as any,
        defaultValues: {
            ...defaultValues,
        },
    });

    const [isCreatingGame, setIsCreatingGame] = useState(false);
    const router = useRouter();

    const toast = useToast();
    if (!isOpen) return null;   

  

    return (
        <FormProvider {...methods}>
            <GinzaSurface
                isOpen={isOpen}
                onClose={onClose}
                title={`Create ${GameMode[gameMode]} Table`}
                content={<GameOptions isSubmitting={isCreatingGame} />}
                primaryButton={
                    <Button
                        variant="walletButton"
                        onClick={() => {
                            console.log('create table');
                        }}
                        isLoading={isCreatingGame}
                        isDisabled={isCreatingGame}
                    >
                        {isCreatingGame ? 'Creating Table...' : 'Create Table'}
                    </Button>
                }
                secondaryButton={
                    <Button variant="secondaryTest" onClick={onClose}>
                        Cancel
                    </Button>
                }
            />
        </FormProvider>
    );
};

export default CreateTableModal;
