/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
    ApiResponse, // @demo remove-current-line
    ApisauceInstance,
    create,
  } from "apisauce"
  import Config from "../../config"
  import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
  import type {
    ApiConfig,
    ApiFeedResponse,
    GetWineListsResult, // @demo remove-current-line
  } from "./api.types"
import { WineListSnapshotIn } from "../../models/WineList"
import SQLite from 'react-native-sqlite-storage';
  
const db = SQLite.openDatabase(
    {
        name: 'Winery.db',
        location: 'default',
        createFromLocation: 1,
      },
      () => {
        console.log('db connect success');
      },
      (error) => {
        console.log('db connect error', error);
      }
    );

  /**
   * Configuring the apisauce instance.
   */
  export const DEFAULT_API_CONFIG: ApiConfig = {
    url: Config.API_URL,
    timeout: 10000,
  }
  
  /**
   * Manages all requests to the API. You can use this class to build out
   * various requests that you need to call from your backend API.
   */
  export class Api {
    apisauce: ApisauceInstance
    config: ApiConfig
  
    /**
     * Set up our API instance. Keep this lightweight!
     */
    constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
      this.config = config
      this.apisauce = create({
        baseURL: this.config.url,
        timeout: this.config.timeout,
        headers: {
          Accept: "application/json",
        },
      })
    }
  


    async getWineList(): Promise<GetWineListsResult> {
      try {
        const data = [];
        const response = await new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql('SELECT (SELECT count(1) FROM wine_list) totalCnt, a.* FROM wine_list a WHERE WINE_ID < ?', [10], (_, res) => {
            // tx.executeSql('SELECT * FROM wine_list WHERE WINE_ID < ?', [10], (_, res) => {
              const rows = res.rows;
              const len = rows.length;
              for (let i = 0; i < len; i++) {
                data.push(rows.item(i));
              }
              resolve(data);
            }, reject);
          });
        });
        
        console.log('data')
        console.log(data)
        console.log('data.[0]')
        console.log(data[0].totalCnt)
        const wineLists = data;
        const totalCnt = data[0].totalCnt;
    
        return { kind: "ok", wineLists, totalCnt }
      } catch (e) {
        console.log("NoticeApi/getNotices(): " + e.message);
        return { kind: "bad-data" }
      }
    }

    /*
    async getWineList2(): Promise<GetWineListsResult> {
      try {
        var aaa=[];
        var json2 ;
        var json3 = 0;
        var results0;
        // For retrieving key
          const response1: ApiResponse<any> = await 
          db.transaction(async (tx) => {
            // tx.executeSql('SELECT * FROM RT_WINE_INFO_202112 WHERE WINE_ID < 10', [], (tx, results) => {
            results0 = await tx.executeSql('SELECT * FROM wine_list WHERE WINE_ID < 10', [], async (tx, res) => {
                const json = await res;
                const rows = res.rows;
                var len = res.rows.length;
                json3 = await len;
                var data = [];
                for (let i = 0; i < len; i++) {
                  data.push(res.rows.item(i));
                  aaa.push(res.rows.item(i));
                }
                console.log('transaction data@@@@@@@@@@@@')
                console.log(data)
                json2 = await data;
      
              }, (error) => {
                console.log(' failed - ' + error);
            });
      
          })
        // the typical ways to die when calling an api
        // if (!response1.ok) {
        //   const problem = getGeneralApiProblem(response1)
        //   if (problem){ 
        //     return problem
        //   }
        // }
        
        //const wineList = response1.data;
        const wineLists = json2
        const totalCnt = json3;
  
        
  
        return { kind: "ok", wineLists, totalCnt }
      } catch (e) {
        //__DEV__&& alert("게시판 목록조회 서비스: " + e.message);
        __DEV__ && console.log("NoticeApi/getNotices(): " + e.message);
        //__DEV__ && console.tron.log(e.message)
        return { kind: "bad-data" }
      }
    }

    */
    // @demo remove-block-end
  }
  
  // Singleton instance of the API for convenience
  export const api = new Api()
  