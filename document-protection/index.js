var users = [
    {
        name: 'Nancy',
        email: 'nancy@example.com',
        role: 'Price Editor',
        protectionType: 'ReadOnly',
        description: 'Can edit only the price values (editable ranges marked in the document)'
    },
    {
        name: 'Andrew',
        email: 'andrew@example.com',
        role: 'Reviewer',
        protectionType: 'RevisionsOnly',
        description: 'All edits are tracked as revisions; cannot accept or reject revisions'
    },
    {
        name: 'Steven',
        email: 'steven@example.com',
        role: 'Commenter',
        protectionType: 'CommentsOnly',
        description: 'Can insert comments only; cannot edit document content'
    },
    {
        name: 'Michael',
        email: 'michael@example.com',
        role: 'Editor',
        protectionType: 'NoProtection',
        description: 'Full editing access on the entire document'
    },
    {
        name: 'Laura',
        email: 'laura@example.com',
        role: 'Viewer',
        protectionType: 'ReadOnly',
        description: 'Read-only access to the document'
    }
];

// Injects the dependent modules into DocumentEditorContainer
ej.documenteditor.DocumentEditorContainer.Inject(
    ej.documenteditor.Toolbar,
    ej.documenteditor.Ribbon
);

// Initializes the DocumentEditorContainer component
var container = new ej.documenteditor.DocumentEditorContainer({
    enableToolbar: true,
    toolbarMode: 'Ribbon',
    height: '590px',
    // Use the following service URL only for demo purposes
    serviceUrl: 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/'
});

// Renders the DocumentEditorContainer component
container.appendTo('#DocumentEditor');

var documentEditor = container.documentEditor;
var currentUser = users[0];

documentEditor.open(JSON.stringify(documentProtectionData));
applyUserPermissions(currentUser);

var userSelect = document.getElementById('userSelect');
users.forEach(function (user) {
    var option = document.createElement('option');
    option.value = user.email;
    option.text = user.name;
    userSelect.appendChild(option);
});

userSelect.addEventListener('change', function () {
    var selected = users.find(function (user) {
        return user.email === userSelect.value;
    });
    if (selected) {
        currentUser = selected;
        applyUserPermissions(currentUser);
    }
});

/**
 * Enforces the document protection for the selected user.
 * The Document Editor checks `documentHelper.isDocumentProtected` along with
 * the editable ranges of `currentUser`, so switching the user re-applies the
 * restrictions of the loaded document instantly.
 */
function applyUserPermissions(user) {
    // Clear the previous protection before applying the new user's rights
    if (documentEditor.documentHelper.isDocumentProtected) {
        documentEditor.editorModule.unProtectDocument();
    }
    // Reset read-only restriction of the container (used for Laura)
    documentEditor.isReadOnly = false;
    documentEditor.currentUser = user.email;
    if (user.protectionType !== 'NoProtection') {
        // Enforces ReadOnly, RevisionsOnly or CommentsOnly without a password
        documentEditor.editorModule.enforceProtection('', user.protectionType);
    }
    if (user.email === 'laura@example.com') {
        // Laura: read-only access to the document
        documentEditor.isReadOnly = true;
    }
    // Close the built-in restrict editing pane; the sample shows the effective
    // permissions in its own panel on the right
    documentEditor.documentHelper.restrictEditingPane.showHideRestrictPane(false);
    updatePermissionBanner(user);
}

/**
 * Andrew works in `RevisionsOnly` protection: every edit is tracked, but the
 * built-in accept/reject actions are blocked, so a reviewer with approval
 * rights (e.g. Michael, the full editor) reviews and approves the changes.
 */
documentEditor.beforeAcceptRejectChanges = function (args) {
    if (currentUser.email === 'andrew@example.com') {
        // Cancel the accept/reject action for Andrew
        args.cancel = true;
    }
};

function updatePermissionBanner(user) {
    var banner = document.getElementById('permissionBanner');
    if (banner) {
        banner.textContent = 'Signed in as ' + user.name + ' (' + user.email + ') - ' + user.role;
    }
}
