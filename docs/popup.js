document.addEventListener("DOMContentLoaded", () => {
    const enableButton = document.getElementById("enable");
    if (enableButton) {
        enableButton.addEventListener("click", () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].url.startsWith("chrome://")) {
                    alert("This extension does not work on internal Chrome pages.");
                    return;
                }
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ["content.js"]
                }).catch((error) => console.error(error));
            });
        });
    }
});
