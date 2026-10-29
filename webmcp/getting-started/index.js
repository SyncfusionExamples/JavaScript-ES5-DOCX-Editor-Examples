// Inject required modules
ej.documenteditor.DocumentEditorContainer.Inject(ej.documenteditor.Toolbar, ej.documenteditor.Ribbon);

// Initialize Document Editor Container component with WebMCP enabled
var documenteditorcontainer = new ej.documenteditor.DocumentEditorContainer({
    height: '590px',
    enableWebMcp: true,
    toolbarMode: 'Ribbon',
    webMcpSettings: { name: 'container' },
    created: function () {
        // Get the registered WebMCP tools.
        var webMcpTools = documenteditorcontainer.getWebMcpTools();

        // Set document name.
        documenteditorcontainer.documentEditor.documentName = 'WebMCP Tool Demo';

        // Update document title.
        document.title = 'WebMCP Tool Demo - DocumentEditorContainer';
    },
    beforeWebMcpToolExecute: function (args) {
        // For write operations, show confirmation dialog.
        var writeOperations = [
            'replaceAll',
            'insertText',
            'paste',
            'insertBookmark',
            'enforceProtection',
            'stopProtection',
            'insertField',
            'insertEditingRegion',
            'formatCharacter',
            'formatParagraph',
            'insertImage',
            'insertHyperlink'];

        if (args.toolName) {
            var toolName = args.toolName.indexOf('_') !== -1 ? args.toolName.substring(args.toolName.indexOf('_') + 1) : args.toolName;

            if (writeOperations.indexOf(toolName) !== -1) {
                args.showConfirmationDialog = true;
            }
        }
    }
});

// Use the following service URL only for demo purposes
documenteditorcontainer.serviceUrl = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';
// Render the DocumentEditorContainer control
documenteditorcontainer.appendTo('#DocumentEditor');
