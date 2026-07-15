let logoutHandler = null;


export function setLogoutHandler(handler) {
    logoutHandler = handler;
}

export async function triggerLogout() {
    console.log(logoutHandler);

    await logoutHandler?.();
}


let isOnline = true

let offlineModeHandler = [];
export function addOnOfflineReaction(handler) {
    offlineModeHandler.push(handler)


    return () => {
        offlineModeHandler = offlineModeHandler.filter(h => h !== handler);
    };
}

export function trigerOfflineMode() {
    isOnline = false
    offlineModeHandler.forEach(reaction => {
        reaction?.()
    })
}

let onlineModeHandler = [];
export function addOnOnlineReaction(handler) {
    onlineModeHandler.push(handler)

    return () => {
        onlineModeHandler = onlineModeHandler.filter(h => h !== handler);
    };
}

export function trigerOnlineMode() {
    isOnline = true

    onlineModeHandler.forEach(reaction => {
        reaction?.()
    })
}
export function SetIsOnline(f) {
    isOnline = f
}
export function GetOnlineStatus() {
    return isOnline
}