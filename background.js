chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'saveNote') {
        chrome.storage.local.get(['notes'], (result) => {
            const notes = result.notes || [];
            notes.push({ title: message.title, content: message.content, time: message.time });
            chrome.storage.local.set({ notes }, () => {
                sendResponse({ success: true });
            });
        });
        return true; // Keep the message channel open for async response
    }
    
  
    if (message.type === 'getNotes') {
      chrome.storage.local.get(['notes'], (result) => {
        sendResponse(result.notes || []);
      });
    }
  
    if (message.type === 'deleteNote') {
      chrome.storage.local.get(['notes'], (result) => {
          const notes = result.notes || [];
          const updatedNotes = notes.filter(note => note.time !== message.time); // Keep notes except the one to delete
          chrome.storage.local.set({ notes: updatedNotes }, () => {
              sendResponse({ success: true });
          });
      });
      return true; // Keep the message channel open for async response
  }  
  
    return true;
  });