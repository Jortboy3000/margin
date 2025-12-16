// Background script for Web Truth Stack
try {
    importScripts('utils/storage.js', 'utils/network_utils.js');
} catch (e) {
    console.error(e);
}

// Context Menu IDs
const CONTEXT_MENU_ID = "add_truth_note";

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: "Add Truth Note",
        contexts: ["page", "selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        if (tab && tab.id) {
            // Send a message to the content script to open the note panel
            chrome.tabs.sendMessage(tab.id, {
                action: "OPEN_NOTE_PANEL",
                selectionText: info.selectionText || ""
            }).catch((err) => {
                console.warn("Could not send message to content script:", err);
                // If the content script isn't ready, we might need to inject it (though manifest handles this usually)
            });
        }
    }
});
