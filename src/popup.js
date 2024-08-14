let lastUrl = '';

const checkUrlChange = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    if (activeTab && activeTab.url.includes('watch?v=') && activeTab.url !== lastUrl) {
        lastUrl = activeTab.url;
        prepareDownload()
    }
}

setInterval(checkUrlChange, 1000); // Check URL change every second

const handleDownload = async () => {
    const statusText = document.getElementById('status');

    statusText.textContent = 'Preparing...';
    const response = await chrome.runtime.sendMessage({ action: 'download', url: lastUrl });
    if (response && response.downloadLink) {
        const link = document.createElement('a');
        link.href = response.downloadLink;
        link.download = response.filename;
        link.click();
        statusText.textContent = 'Done';
    } else {
        statusText.textContent = 'Error: ' + (response.error || 'Unknown error');
    }
}

const prepareDownload = async () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const statusText = document.getElementById('status');
    const title = document.getElementById('title');
    const thumbnailElement = document.getElementById("thumbnail");

    if (lastUrl && lastUrl.includes('watch?v=')) {
        const info = await chrome.runtime.sendMessage({ action: 'getInfo', url: lastUrl });
        title.innerText = info?.title || 'N/A';
        if (info.thumb) {
            thumbnailElement.src = info.thumb;
        }

        downloadBtn.disabled = false;

        // Reassign listener.
        downloadBtn.removeEventListener('click', handleDownload);
        downloadBtn.addEventListener('click', handleDownload);
    } else {
        statusText.textContent = 'No YouTube video detected';
        title.innerText = 'N/A';
        thumbnailElement.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        downloadBtn.disabled = true;
    }
}
