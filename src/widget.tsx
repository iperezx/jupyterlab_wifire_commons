import { ReactWidget } from '@jupyterlab/apputils';

import React from 'react';

import Form from "@rjsf/core";

export class FormWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    
    const schema = `{
      "title": "Submit model",
      "type": "object",
      "required": ["catalogEndpoint","catalogType","modelFile"],
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
        "modelFile": {
          "type": "string",
          "title": "Model file name"
        }
      }
    }`;
    const schemaAsObject = JSON.parse(schema);
    function onFormSubmit () {
      console.log("---Form submitted---");
    }
    return <div>
            <Form 
              schema={schemaAsObject}
              onSubmit={onFormSubmit}
            />
          </div>;
  }
}
