import React from 'react';
import { useStyles2 } from '@grafana/ui';
import { getServerStyles } from '../server';
export const ServerDatabase = (data) => {
    const styles = useStyles2(getServerStyles(data));
    return (React.createElement("g", { className: styles.outline },
        React.createElement("g", { className: styles.server },
            React.createElement("path", { d: "m2.6953 37.5v20.883c0 7.6725 15.592 13.922 34.805 13.922s34.805-6.2493 34.805-13.922v-20.883" }),
            React.createElement("path", { d: "m2.6953 16.617v20.883c0 7.7035 15.592 13.922 34.805 13.922s34.805-6.2184 34.805-13.922v-20.883" }),
            React.createElement("path", { d: "m37.5 30.539c19.212 0 34.805-6.2185 34.805-13.922 0-7.7034-15.592-13.922-34.805-13.922s-34.805 6.2184-34.805 13.922c0 7.7035 15.592 13.922 34.805 13.922z" })),
        React.createElement("g", { className: styles.circleBack },
            React.createElement("path", { transform: "matrix(2.7868 0 0 2.7868 -132.86 -110.58)", d: "m62.198 60.586c.6388 0 1.1558.5171 1.1558 1.1559 0 .6387-.517 1.1558-1.1558 1.1558-.6387 0-1.1558-.5171-1.1558-1.1558 0-.6388.5171-1.1559 1.1558-1.1559z" }),
            React.createElement("path", { transform: "matrix(2.7868 0 0 2.7868 -122.04 -111.7)", d: "m62.198 60.586c.6388 0 1.1558.5171 1.1558 1.1559 0 .6387-.517 1.1558-1.1558 1.1558-.6387 0-1.1558-.5171-1.1558-1.1558 0-.6388.5171-1.1559 1.1558-1.1559z" }),
            React.createElement("path", { transform: "matrix(2.7868 0 0 2.7868 -111.21 -114.77)", d: "m62.198 60.586c.6388 0 1.1558.5171 1.1558 1.1559 0 .6387-.517 1.1558-1.1558 1.1558-.6387 0-1.1558-.5171-1.1558-1.1558 0-.6388.5171-1.1559 1.1558-1.1559z" })),
        React.createElement("g", { className: styles.circle },
            React.createElement("path", { transform: "matrix(1.4922 0 0 1.4922 -52.337 -30.65)", d: "m62.198 60.586c.6388 0 1.1558.5171 1.1558 1.1559 0 .6387-.517 1.1558-1.1558 1.1558-.6387 0-1.1558-.5171-1.1558-1.1558 0-.6388.5171-1.1559 1.1558-1.1559z" }),
            React.createElement("path", { transform: "matrix(1.4922 0 0 1.4922 -41.518 -31.769)", d: "m62.198 60.586c.6388 0 1.1558.5171 1.1558 1.1559 0 .6387-.517 1.1558-1.1558 1.1558-.6387 0-1.1558-.5171-1.1558-1.1558 0-.6388.5171-1.1559 1.1558-1.1559z" }),
            React.createElement("path", { transform: "matrix(1.4922 0 0 1.4922 -30.688 -34.842)", d: "m62.198 60.586c.6388 0 1.1558.5171 1.1558 1.1559 0 .6387-.517 1.1558-1.1558 1.1558-.6387 0-1.1558-.5171-1.1558-1.1558 0-.6388.5171-1.1559 1.1558-1.1559z" }))));
};
//# sourceMappingURL=database.js.map