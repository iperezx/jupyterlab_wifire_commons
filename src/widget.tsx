import { ReactWidget } from '@jupyterlab/apputils';

import React from 'react';

import Form from "@rjsf/core";

import { MintCatalog } from './catalog';
    
// @ts-ignore
import imgLogo from '../style/wfc-logo.png';

export class FormWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass('jp-ReactWidget');
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async (form: { formData: any; }) => {
    console.log("---Form submitted---");
    const userName = form.formData.catalogUser
    const password = form.formData.catalogPassword
    const catalogURL = form.formData.catalogEndpoint;
    const typeOfCatalog = form.formData.catalogType;
    if (typeOfCatalog == "MINT") {
      let catalog: MintCatalog = new MintCatalog(userName,password,catalogURL);
      catalog.postModel();
    }
  }

  render(): JSX.Element {
    
    const schema = `{
      "title": "Submit model",
      "type": "object",
      "required": ["catalogEndpoint","catalogType","catalogUser","catalogPassword","modelFile"],
      "properties": {
        "catalogEndpoint": {
          "type": "string", 
          "title": "Catalog Endpoint"
        },
        "catalogType": {
          "type": "string",
          "title": "Type of Catalog",
          "examples": ["CKAN","MINT"]
        },
        "catalogUser": {
          "type": "string",
          "title": "Catalog User Name"
        },
        "catalogPassword": {
          "type": "string",
          "title": "Catalog Password"
        },
        "modelFile": {
          "type": "string",
          "format": "data-url",
          "title": "Model file"
        }
      }
    }`;
    const uiSchema = `{
      "catalogEndpoint": {
        "classNames": "wfc-input"
      },
      "catalogType": {
        "classNames": "wfc-input"
      },
      "catalogUser": {
        "classNames": "wfc-input"
      },
      "catalogPassword": {
        "ui:widget": "password",
        "classNames": "wfc-input"
      },
      "modelFile": {
        "classNames": "wfc-input"
      }
    }`;

    const schemaAsObj = JSON.parse(schema);
    const uiSchemaObj = JSON.parse(uiSchema);

    const App = () => { const [formData, setFormData] =
      React.useState(null);
        return (<Form 
          schema={schemaAsObj}
          uiSchema={uiSchemaObj}
          onSubmit={this.handleSubmit}
          formData={formData}
          formContext={formData}
          onChange={e => setFormData(e.formData)}
        />);
    };

    return <div className="wfc">
            <img className="logo" src={imgLogo}/>
            <App
            />
          </div>;
  }
}
