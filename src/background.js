const downloadHost = import.meta.env.VITE_DOWNLOAD_HOST;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'download' && message.url) {
    fetch(`${downloadHost}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: message.url }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.downloadLink) {
          sendResponse({ downloadLink: data.downloadLink });
        } else {
          sendResponse({ error: 'Failed to get download link' });
        }
      })
      .catch(error => {
        sendResponse({ error: error.message });
      });

    // Return true to indicate that the response is sent asynchronously
    return true;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getInfo' && message.url) {
    fetch(`${downloadHost}/getInfo?url=${encodeURIComponent(message.url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

      .then(response => response.json())
      .then(data => {
        if (data.title) {
          sendResponse({ title: data.title, thumb: data?.thumb });
        } else {
          sendResponse({ error: 'Failed to get info' });
        }
      })
      .catch(error => {
        sendResponse({ error: error.message });
      });

    return true;
  }
});
