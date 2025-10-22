import { Box, Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { HEALTH_CHECK_TIMEOUT } from "../../websocket/constants";


const ConnectingOverlay = () => {
    const timeoutRef = useRef<number | null>(null);
    const [showReloadButton, setShowReloadButton] = useState(false);

    useEffect(() => {
        timeoutRef.current = window.setTimeout(() => {
            setShowReloadButton(true);
        }, HEALTH_CHECK_TIMEOUT);

        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <Box bg="rgba(0, 0, 0, 0.5)" zIndex={9999} w="100%" h="100%" position={{
            base: "fixed",
            lg: "absolute",
        }} top={{"base": "70px", "lg": "0"}} left="0" right="0" bottom="0" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>Connecting...</p>
            {showReloadButton && <Button onClick={() => {
                window?.location?.reload();
            }}>Reload</Button>}
        </Box>
    );
};

export default ConnectingOverlay;