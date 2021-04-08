import {
  IDisposable
} from '@phosphor/disposable';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  CommandToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookPanel, 
  INotebookModel
} from '@jupyterlab/notebook';

import {
  BoxPanel
} from "@lumino/widgets";

import { CommandRegistry } from '@lumino/commands';

import { reactIcon } from '@jupyterlab/ui-components';

import { FormWidget } from './widget';

namespace CommandIDs {
  export const create = 'submit-model-widget';
}
class UploadToCatalogButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  private _commands: CommandRegistry

  constructor(options: UploadToCatalogButtonExtension.IOptions) {
    this._commands = options.commands;
  }

  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {  
    let button = new CommandToolbarButton({
      commands: this._commands,
      id: CommandIDs.create,
    });
    
    panel.toolbar.insertItem(10, 'uploadToCatalog', button);
  
    return button;
  }
}


function activate(app: JupyterFrontEnd): void {
  const { commands } = app;
  const command = CommandIDs.create;

  const form = new FormWidget();
  const panel = new BoxPanel();
  panel.addWidget(form);

  panel.title.label = 'Submit model';
  panel.title.icon = reactIcon;
  panel.title.closable = true;
  panel.id = 'id-form-widget';

  commands.addCommand(command, {
    caption: 'Click to submit model to catalog',
    label: 'Submit model to catalog',
    icon: args => (args['isPalette'] ? null : reactIcon),
    execute: () => {
      if(!panel.isAttached){
        app.shell.add(panel, 'right');
        //shell.expandRight();
      }
      app.shell.activateById(panel.id);
    }
  });


  let buttonExtension = new UploadToCatalogButtonExtension({ commands });
  app.docRegistry.addWidgetExtension('Notebook', buttonExtension);
}

export namespace UploadToCatalogButtonExtension {
  export interface IOptions {
    commands: CommandRegistry;
  }
}


const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_wifire_commons:plugin',
  autoStart: true,
  activate
};


export default extension;
