// Inject toolbar
ej.documenteditor.DocumentEditorContainer.Inject(ej.documenteditor.Toolbar);

// Initialize Document Editor Container component
var documenteditorContainer = new ej.documenteditor.DocumentEditorContainer({ 
    enableToolbar: true, 
    height: '590px'

});

// Use the following service URL only for demo purposes
documenteditorContainer.serviceUrl = 'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';
// Render the DocumentEditorContainer control
documenteditorContainer.appendTo('#DocumentEditor');