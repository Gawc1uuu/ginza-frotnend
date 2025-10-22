import { useEffect, useState } from "react";

const useOrigin = () => {
    const [origin, setOrigin] = useState<string>('https://www.ginzagaming.com');

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    return origin;
};

export default useOrigin;