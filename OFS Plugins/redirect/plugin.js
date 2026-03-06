/**
 * 
 * Author: Vijay Krishna (vijaykrishnavs1@gmail.com)
 * Created: Feb 2026
 * 
 * Description:
 *   - Not affiliated with Oracle; use at your own discretion.
 *   - Handles message passing between OFS parent window and plugin.
 *   - Expects “backScreen” parameter for redirection.
 *   - Does NOT implement service worker functionality.
 *   - Standard “backScreen” values: see https://docs.oracle.com/en/cloud/saas/field-service/fapcf/c-redirectionwithclosemethod.html
 * 
 */

function pluginInit() {
    console.log("DEBUG: Plugin initialized. Adding event listener...");
    window.addEventListener('message', getPluginMessage);

    // Small delay to ensure the DOM and listener are ready
    setTimeout(() => {
        sendReadyMessage();
    }, 100);
}

function getPluginMessage(event) {
    console.log("DEBUG: Message received from origin:", event.origin);

    let data;
    if (typeof event.data === 'string') {
        console.log("DEBUG: Data received as STRING. Parsing...");
        data = safeParseJSON(event.data);
    } else {
        console.log("DEBUG: Data received as OBJECT.");
        data = event.data;
    }

    if (!data || typeof data !== 'object') {
        console.warn("DEBUG: Received invalid data format:", data);
        return;
    }

    console.log("DEBUG: Method received ->", data.method);

    switch (data.method) {
        case 'init':
            const initEndMessage = {
                apiVersion: 1,
                method: 'initEnd'
            };
            sendPluginMessage(initEndMessage);
            break;
        case 'open':
            console.log("DEBUG: Handling 'open' method...");
            if (data?.openParams?.backScreen) {

                const redirectMessage = {
                    apiVersion: 1,
                    method: 'close',
                    backScreen: data.openParams.backScreen,
                    backActivityId: data.activity.aid
                };
                sendPluginMessage(redirectMessage);

            }
            else {
                alert("backScreen parameter is missing.");
            }
            break;
        case 'update':
            handleOpen(data);
            break;
        case 'error':
            console.error('OFS error:', data.error);
            break;
        default:
            console.log("DEBUG: Method not handled ->", data.method);
            break;
    }
}



function sendReadyMessage() {
    console.log("DEBUG: Sending 'ready' message to OFS...");
    const readyMessage = {
        apiVersion: 1,
        method: 'ready',
        sendInitData: true,
        showHeader: true,
        enableBackButton: true
    };
    sendPluginMessage(readyMessage);
}

function closePlugin() {
    sendPluginMessage({
        apiVersion: 1,
        method: 'close'
    });
}

function sendPluginMessage(data) {
    //console.log("DEBUG: Posting message to parent:", data);
    window.parent.postMessage(data, '*');
}


function safeParseJSON(payload) {
    try {
        return JSON.parse(payload);
    } catch (e) {
        console.error("DEBUG: JSON Parse Error:", e);
        return null;
    }
}