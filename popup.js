document.addEventListener("DOMContentLoaded", () => {
    const notesTable = document.querySelector("#notes-table tbody");
    const noteTitleInput = document.querySelector("#note-title");
    const noteContentInput = document.querySelector("#note-content");
    const saveButton = document.querySelector("#save-note");
    const cancelButton = document.querySelector("#cancel-note");
    const formSection = document.querySelector(".add-note-section");
    const sortFilter = document.querySelector("#sort-filter");

    let allNotes = [];
    let isEditing = false;
    let editingIndex = -1;

    // Load notes from storage
    function loadNotes() {
        chrome.runtime.sendMessage({ type: "getNotes" }, (notes) => {
            allNotes = (notes || []).map(note => ({
                ...note,
                time: new Date(note.time).toISOString()
            }));
            sortAndDisplayNotes();
        });
    }

    // Sort and display notes
    function sortAndDisplayNotes() {
        const sortValue = sortFilter.value;
        notesTable.innerHTML = ""; // Clear existing notes
        let sortedNotes = [...allNotes];

        // Sort notes by time
        sortedNotes.sort((a, b) => {
            const timeA = new Date(a.time);
            const timeB = new Date(b.time);
            return sortValue === "newest" ? timeB - timeA : timeA - timeB;
        });

        // Display the sorted notes
        sortedNotes.forEach((note, index) => {
            addNoteToTable(note, index);
        });
    }

    // Add a note to the table
    function addNoteToTable(note, index) {
        const row = document.createElement("tr");

        // Title cell
        const titleCell = document.createElement("td");
        titleCell.textContent = note.title || "Untitled";
        row.appendChild(titleCell);

        // Time cell
        const timeCell = document.createElement("td");
        timeCell.className = "time-cell";
        const date = new Date(note.time);
        timeCell.textContent = date.toLocaleString(); // Format time for display
        row.appendChild(timeCell);

        // Actions cell
        const actionsCell = document.createElement("td");
        actionsCell.className = "actions-cell";

        // Action buttons container
        const actionsContainer = document.createElement("div");
        actionsContainer.style.display = "flex";
        actionsContainer.style.justifyContent = "center";
        actionsContainer.style.gap = "2px";

        // View button
        const viewButton = document.createElement("button");
        viewButton.className = "action-button";
        viewButton.innerHTML = '<i class="fas fa-eye"></i>';
        viewButton.title = "View";
        viewButton.addEventListener("click", () => showNoteModal(note));
        actionsContainer.appendChild(viewButton);

        // Edit button
        const editButton = document.createElement("button");
        editButton.className = "action-button";
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.title = "Edit";
        editButton.addEventListener("click", () => {
            noteTitleInput.value = note.title;
            noteContentInput.value = note.content;
            isEditing = true;
            editingIndex = index;
            formSection.scrollIntoView({ behavior: "smooth" });
        });
        actionsContainer.appendChild(editButton);

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "action-button";
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.title = "Delete";
        deleteButton.addEventListener("click", () => {
            chrome.runtime.sendMessage({ type: "deleteNote", time: note.time }, loadNotes);
        });
        actionsContainer.appendChild(deleteButton);        

        actionsCell.appendChild(actionsContainer);
        row.appendChild(actionsCell);
        notesTable.appendChild(row);
    }

    // Show note content in a modal
    function showNoteModal(note) {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
        `;

        // Add close functionality
        modal.querySelector(".modal-close").addEventListener("click", () => modal.remove());
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.remove();
        });

        document.body.appendChild(modal);
    }

    // Save a new or edited note
    saveButton.addEventListener("click", () => {
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();
        const time = new Date().toISOString();

        if (!title || !content) {
            alert("Please provide both a title and content for the note.");
            return;
        }

        if (isEditing) {
            chrome.runtime.sendMessage({ type: "getNotes" }, (notes) => {
                notes[editingIndex] = { title, content, time };
                chrome.storage.local.set({ notes }, () => {
                    isEditing = false;
                    editingIndex = -1;
                    noteTitleInput.value = "";
                    noteContentInput.value = "";
                    loadNotes();
                });
            });
        } else {
            chrome.runtime.sendMessage({ type: "saveNote", title, content, time }, () => {
                noteTitleInput.value = "";
                noteContentInput.value = "";
                loadNotes();
            });
        }
    });

    // Cancel editing
    cancelButton.addEventListener("click", () => {
        noteTitleInput.value = "";
        noteContentInput.value = "";
        isEditing = false;
        editingIndex = -1;
    });

    // Load notes on startup
    loadNotes();

    // Re-sort notes when filter changes
    sortFilter.addEventListener("change", sortAndDisplayNotes);
});