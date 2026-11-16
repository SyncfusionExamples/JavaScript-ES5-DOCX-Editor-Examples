// Inject Document Editor Container modules
ej.documenteditor.DocumentEditorContainer.Inject(ej.documenteditor.Toolbar);

var serviceUrl = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/'; //only for demo purpose.
var editor1, editor2;
var originalFile = null, revisedFile = null;

// Syncfusion EJ2 Button Initialization (ES5 style):
var compareButtonEJ = new ej.buttons.Button({ isPrimary: true, disabled: true }, '#compareButton');
var downloadButtonEJ = new ej.buttons.Button({ iconCss: 'e-icons e-download', cssClass: 'e-outline e-primary', disabled: true }, '#downloadButton');
var showRevisionsButtonEJ = new ej.buttons.Button({ iconCss: 'e-icons e-eye' }, '#showRevisionsButton');

var originalFileInput = document.getElementById('originalFileInput');
var revisedFileInput = document.getElementById('revisedFileInput');
var showTrackedChanges = document.getElementById('showResultCheckbox');
var compareButton = document.getElementById('compareButton');
var downloadButton = document.getElementById('downloadButton');
var editor2Label = document.getElementById('rightEditorTitle');
var removeOriginalFileSpan = document.getElementById('removeOriginalFile');
var removeRevisedFileSpan = document.getElementById('removeRevisedFile');
var showRevisionsButton = document.getElementById('showRevisionsButton');

editor1 = new ej.documenteditor.DocumentEditorContainer({
    serviceUrl: serviceUrl,
    enableToolbar: false,
    showPropertiesPane: false,
    height: '100%'
});
editor1.appendTo('#editorContainer1');
editor2 = new ej.documenteditor.DocumentEditorContainer({
    serviceUrl: serviceUrl,
    enableToolbar: false,
    showPropertiesPane: false,
    height: '100%'
});
editor2.appendTo('#editorContainer2');

// Open the default documents in the editors on page load.
editor1.documentEditor.open(JSON.stringify(window.originalDocument));
editor2.documentEditor.showRevisions = false;
editor2.documentEditor.open(JSON.stringify(window.revisedDocument));

wireDocumentEditorScrollSync();

function updateButtonStates() {
    compareButtonEJ.disabled = !(originalFile != null && revisedFile != null);
    downloadButtonEJ.disabled = compareButtonEJ.disabled;
}

function setOriginalFileName() {
    var originalFileNameElement = document.getElementById('originalFileName');
    if (originalFileNameElement) {
        if (originalFile) {
            var size = Math.round(originalFile.size / 1024);
            originalFileNameElement.textContent = originalFile.name + ' (' + size + ' KB)';
        }
        else {
            originalFileNameElement.textContent = 'Supported formats: SFDT, DOCX';
        }
    }
}

function setRevisedFileName() {
    var revisedFileNameElement = document.getElementById('revisedFileName');
    if (revisedFileNameElement) {
        if (revisedFile) {
            var size = Math.round(revisedFile.size / 1024);
            revisedFileNameElement.textContent = revisedFile.name + ' (' + size + ' KB)';
        }
        else {
            revisedFileNameElement.textContent = 'Supported formats: SFDT, DOCX';
        }
    }
}

function showHideWaitingIndicator(show) {
    var waitingPopUp = document.getElementById('waiting-popup');
    var inActiveDiv = document.getElementById('popup-overlay');
    if (waitingPopUp && inActiveDiv) {
        inActiveDiv.style.display = show ? 'block' : 'none';
        waitingPopUp.style.display = show ? 'block' : 'none';
    }
}

function wireDocumentEditorScrollSync() {
    if (editor1 && editor1.documentEditor && editor2 && editor2.documentEditor) {
        editor1.documentEditor.viewChange = function () {
            var pos = editor1.documentEditor.selection.getScrollPosition();
            editor2.documentEditor.selection.setScrollPosition(pos);
        };
        editor2.documentEditor.viewChange = function () {
            var pos = editor2.documentEditor.selection.getScrollPosition();
            editor1.documentEditor.selection.setScrollPosition(pos);
        };
    }
}

originalFileInput.addEventListener('change', function (e) {
    originalFile = e.target.files[0] || null;
    updateButtonStates();
    setOriginalFileName();
});
revisedFileInput.addEventListener('change', function (e) {
    revisedFile = e.target.files[0] || null;
    updateButtonStates();
    setRevisedFileName();
});

// Add event listeners for clicking the remove icon for file names.
removeOriginalFileSpan.addEventListener('click', function (e) {
    originalFile = null;
    updateButtonStates();
    setOriginalFileName();
});

removeRevisedFileSpan.addEventListener('click', function (e) {
    revisedFile = null;
    updateButtonStates();
    setRevisedFileName();
});

showTrackedChanges.addEventListener('change', function (e) {
    editor2Label.textContent = e.target.checked ? 'Result Document (with tracked changes)' : 'Revised Document';
    showRevisionsButton.style.display = e.target.checked ? 'block' : 'none';
});

compareButton.addEventListener('click', function () {
    onCompare(originalFile, revisedFile, showTrackedChanges.checked);
});

downloadButton.addEventListener('click', onDownload);

showRevisionsButton.addEventListener('click', function () {
    if (editor2) {
        editor2.documentEditor.showRevisions = !editor2.documentEditor.showRevisions;
        showRevisionsButtonEJ.content = editor2.documentEditor.showRevisions ? 'Hide Review Pane' : 'Show Review Pane';
    }
});

function onCompare(originalFile, revisedFile, showResult) {
    var formatTypeOriginalFile = originalFile.name.slice(originalFile.name.lastIndexOf('.')).toLowerCase();
    var formatTypeRevisedFile = revisedFile.name.slice(revisedFile.name.lastIndexOf('.')).toLowerCase();
    if (isSupportedFormatType(formatTypeOriginalFile) && isSupportedFormatType(formatTypeRevisedFile)) {
        downloadButtonEJ.disabled = true;
        showRevisionsButtonEJ.content = 'Show Review Pane';
        showHideWaitingIndicator(true);
        setTimeout(async function () {
            try {
                if (showResult) {
                    if (originalFile) await openFileInEditor(originalFile, editor1);
                    if (originalFile && revisedFile) {
                        await loadComparedDocumentAndOpen(originalFile, revisedFile);
                        downloadButtonEJ.disabled = false;
                    }
                } else {
                    if (originalFile) await openFileInEditor(originalFile, editor1);
                    if (revisedFile) {
                        await openFileInEditor(revisedFile, editor2);
                        downloadButtonEJ.disabled = false;
                    }
                }
            } catch (error) {
                alert('Failed to complete comparison: ' + error.message);
            }
            showHideWaitingIndicator(false);
        }, 0);
    }
    else {
        alert('The source and revised file should be either in SFDT or DOCX. Please try again.');
        compareButtonEJ.disabled = true;
        downloadButtonEJ.disabled = true;
    }
}

function onDownload() {
    if (editor2 && editor2.documentEditor)
        editor2.documentEditor.save('Result', 'Docx');
}

function isSupportedFormatType(formatType) {
    return ['.docx', '.sfdt'].includes(formatType);
}

function openFileInEditor(file, editor) {
    return new Promise(function (resolve, reject) {
        var formatType = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (formatType === '.sfdt') {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (editor && editor.documentEditor) {
                    editor.documentEditor.showRevisions = false;
                    editor.documentEditor.open(e.target.result);
                    resolve();
                } else reject(new Error('Editor not ready'));
            };
            reader.onerror = reject;
            reader.readAsText(file);
        }
        else if (isSupportedFormatType(formatType)) {
            var formData = new FormData();
            formData.append('file', file);
            fetch(serviceUrl + 'Import', {
                method: 'POST',
                body: formData
            })
                .then(r => r.ok ? r.text() : Promise.reject(new Error('Failed import')))
                .then(sfdtString => {
                    if (editor && editor.documentEditor) {
                        editor.documentEditor.showRevisions = false;
                        editor.documentEditor.open(sfdtString);
                        resolve();
                    } else reject(new Error('Editor not ready'));
                })
                .catch(reject);
        }
        else {
            alert('Unsupported file type.');
            compareButtonEJ.disabled = true;
            downloadButtonEJ.disabled = true;
            reject(new Error('Unsupported file type'));
        }
    });
}

function loadComparedDocumentAndOpen(originalFile, revisedFile) {
    return new Promise(function (resolve, reject) {
        var formData = new FormData();
        formData.append('originalFile', originalFile);
        formData.append('revisedFile', revisedFile);
        formData.append('author', 'Author');
        formData.append('dateTime', new Date().toISOString());
        fetch(serviceUrl + 'CompareDocuments', {
            method: 'POST',
            body: formData
        })
            .then(r => r.ok ? r.text() : Promise.reject(new Error('Compare failed')))
            .then(sfdtString => {
                if (editor2 && editor2.documentEditor) {
                    editor2.documentEditor.showRevisions = false;
                    editor2.documentEditor.open(sfdtString);
                    resolve();
                } else reject(new Error('Editor not ready'));
            })
            .catch(reject);
    });
}
