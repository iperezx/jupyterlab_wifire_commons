import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_wifire_commons extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_wifire_commons:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_wifire_commons is activated!');
  }
};

export default extension;
