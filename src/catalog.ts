import axios from 'axios';

import {
  AxiosRequestConfig
} from 'axios';

abstract class BaseCatalog{

    userName: string;
    password: string;
    catalogEndpoint: string;
    constructor(userName: string,password: string,catalogEndpoint:string){
        this.userName = userName;
        this.password = password;
        this.catalogEndpoint = catalogEndpoint;
    }

    abstract postModel(): any;
}

export class MintCatalog extends BaseCatalog{
    postModelEndpoint: string;
    signInEndpoint: string;
    catalogType: string;
    
    constructor(userName: string,password: string,catalogEndpoint:string){
        super(userName,password,catalogEndpoint);
        this.postModelEndpoint = catalogEndpoint + '/models'; 
        this.signInEndpoint =  catalogEndpoint + '/user/login';
        this.catalogType = 'MINT';
    }

    async getCatalogToken(){
        const userCrendentials = {
            "password":this.password,
            "username":this.userName
          }
          const data = JSON.stringify(userCrendentials);
          
          const config: AxiosRequestConfig = {
            method: 'post',
            url: this.signInEndpoint,
            headers: {'Content-Type': 'application/json'},
            data: data
          };
          var responseJSON;
          try {
            const response = await axios(config);
            responseJSON = response.data
            console.log('Got token');
          } catch(error) {
            console.log(error);
          }
        const catalogToken = responseJSON['access_token'];
        return catalogToken;
    }

    async postModel(): Promise<any> {
        const catalogToken = await this.getCatalogToken();
        var modelData = JSON.stringify({"username": this.userName,
        "description":["Machine learning model for fast fuels data"],
        "keywords":["machine learning","wildfire","fire model","fuelscape"],
        "label":["Fast Fuel's Machine Learning Model"],"category":["Fire"]});

        var modelConfig: AxiosRequestConfig = {
            method: 'post',
            url: this.postModelEndpoint,
            headers: { 
                'Authorization': 'Bearer ' + catalogToken, 
                'Content-Type': 'application/json'
            },
            data : modelData
        };
        
        try {
            const response = axios(modelConfig);
            const responseJSON = (await response).data
            console.log('Publish model to ' + this.catalogType);
        } catch(error) {
            console.log(error);
        }
    }
}