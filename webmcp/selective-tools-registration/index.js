// Inject required modules
ej.documenteditor.DocumentEditorContainer.Inject(ej.documenteditor.Toolbar, ej.documenteditor.Ribbon);

// Initialize Document Editor Container component with WebMCP enabled
var documenteditorcontainer = new ej.documenteditor.DocumentEditorContainer({
    height: '590px',
    enableWebMcp: true,
    toolbarMode: 'Ribbon',
    webMcpSettings: { name: 'container', tools: [ 'getDocumentBookmarks', 'getSelectionText', 'find', 'findAll', 'goToPage' ] } //Register only with needed tools
});

// Use the following service URL only for demo purposes
documenteditorcontainer.serviceUrl = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';
// Render the DocumentEditorContainer control
documenteditorcontainer.appendTo('#DocumentEditor');
