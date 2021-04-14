import { ReactWidget } from '@jupyterlab/apputils';

import React from 'react';

import Form from "@rjsf/core";

import axios from 'axios';

import {
  AxiosRequestConfig
} from 'axios';

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
    //Get token first
    const userCrendentials = {
      "password":password,
      "username":userName
    }
  
    const data = JSON.stringify(userCrendentials);
    const signInEndpoint = catalogURL + '/user/login';
    
    const config: AxiosRequestConfig = {
      method: 'post',
      url: signInEndpoint,
      headers: {'Content-Type': 'application/json'},
      data: data
    };


    var loginResponseJSON;
    try {
      const response = axios(config);
      loginResponseJSON = (await response).data
      console.log('Got token');
    } catch(error) {
      console.log(error);
    }

    // Now use the token to post a model
    const catalogToken = loginResponseJSON['access_token'];
    const postModelEndpoint = catalogURL + '/models';
    var modelData = JSON.stringify({"username": userName,
    "description":["Machine learning model for fast fuels data"],
    "keywords":["machine learning","wildfire","fire model","fuelscape"],
    "label":["Fast Fuel's Machine Learning Model"],"category":["Fire"]});

    var modelConfig: AxiosRequestConfig = {
      method: 'post',
      url: postModelEndpoint,
      headers: { 
        'Authorization': 'Bearer ' + catalogToken, 
        'Content-Type': 'application/json'
      },
      data : modelData
    };
    try {
      const response = axios(modelConfig);
      loginResponseJSON = (await response).data
      console.log('Publish model to ' + typeOfCatalog);
    } catch(error) {
      console.log(error);
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
      "catalogPassword": {
        "ui:widget": "password"
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

    return <div>
            <App
            />
          </div>;
  }
}
