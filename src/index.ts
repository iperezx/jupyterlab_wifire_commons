import {
  IDisposable
} from '@phosphor/disposable';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

class UploadToCKANButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {

  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {

    let uploadToCKAN = () => {
      console.log('Upload model to CKAN.');
    };
    
    let button = new ToolbarButton({
      className: 'uploadToCKANButton',
      label: 'Upload Model to CKAN',
      onClick: uploadToCKAN,
      tooltip: 'Upload to CKAN'
    });
    
    panel.toolbar.insertItem(10, 'uploadToCKAN', button);
  
    return button;
  }
}
function activate(app: JupyterFrontEnd): void {
  let buttonExtension = new UploadToCKANButtonExtension();
  app.docRegistry.addWidgetExtension('Notebook', buttonExtension);
}


const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_wifire_commons:plugin',
  autoStart: true,
  activate
};


export default extension;
