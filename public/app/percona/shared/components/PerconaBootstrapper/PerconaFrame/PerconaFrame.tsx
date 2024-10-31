import { FC, useEffect } from "react";

import { locationService } from "@grafana/runtime";

export const PerconaFrame: FC = () => {
    const messageListener = (e: MessageEvent) => {
        console.log('percona-frame', e);

        if (e.data && e.data?.type === 'NAVIGATE-TO') {
            locationService.push(e.data?.to);
        }

    }

    useEffect(() => {
        window.addEventListener('message', messageListener);

        return () => {
            window.removeEventListener('message', messageListener);
        }
    }, []);

    return null;
};
