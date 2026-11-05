// Inject required modules
ej.documenteditor.DocumentEditorContainer.Inject(
    ej.documenteditor.Toolbar,
    ej.documenteditor.Ribbon,
    ej.documenteditor.WebMcpDocumentEditor
);

// Initialize Document Editor Container component with WebMCP enabled
var documenteditorcontainer = new ej.documenteditor.DocumentEditorContainer({
    height: '590px',
    enableWebMcp: true,
    toolbarMode: 'Ribbon',
    webMcpSettings: {
        name: 'DocumentEditor'
    },

    beforeWebMcpToolExecute: function (args) {
        var toolName = args.toolName;
        var toolArgs = args.toolArgs;

        // Audit all WebMCP tool invocations
        console.log('[WebMCP] Executing: ' + toolName, toolArgs);

        var commandName = toolName && toolName.indexOf('_') !== -1
            ? toolName.substring(toolName.indexOf('_') + 1)
            : toolName;

        // Restrict a specific tool
        if (commandName === 'saveDocument') {
            args.cancel = true;
            args.cancellationResponse = 'The saveDocument operation has been restricted.';
        }
    }
});

// Use the following service URL only for demo purposes
documenteditorcontainer.serviceUrl =
    'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';

// Render the DocumentEditorContainer control
documenteditorcontainer.appendTo('#DocumentEditor');