// Inject required modules
ej.documenteditor.DocumentEditorContainer.Inject(
    ej.documenteditor.Toolbar,
    ej.documenteditor.Ribbon,
    ej.documenteditor.WebMcpDocumentEditor
);

// First Document Editor instance
var documentEditor1 = new ej.documenteditor.DocumentEditorContainer({
    height: '590px',
    width: '100%',
    enableWebMcp: true,
    toolbarMode: 'Ribbon',
    webMcpSettings: {
        name: 'documentEditor1'
    }
});

// Use the following service URL only for demo purposes
documentEditor1.serviceUrl =
    'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';

documentEditor1.appendTo('#DocumentEditor1');

// Second Document Editor instance
var documentEditor2 = new ej.documenteditor.DocumentEditorContainer({
    height: '590px',
    width: '100%',
    enableWebMcp: true,
    toolbarMode: 'Ribbon',
    webMcpSettings: {
        name: 'documentEditor2'
    }
});

// Use the following service URL only for demo purposes
documentEditor2.serviceUrl =
    'https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/';

documentEditor2.appendTo('#DocumentEditor2');