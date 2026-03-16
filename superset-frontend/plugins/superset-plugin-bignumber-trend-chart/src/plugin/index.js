

/**
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
import { t, ChartMetadata, ChartPlugin } from '@superset-ui/core';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from '../images/thumbnail.png';


export default class SupersetPluginBignumberTrendChart extends ChartPlugin {
 constructor() {
   const metadata = new ChartMetadata({
     name: t('Superset Plugin Big Number with Trend'),
     description: t(
       'A customizable big number visualization that displays a primary metric ' +
       'with optional trend indicators, secondary comparison metrics, and ' +
       'percentage changes. Features include configurable number formatting, ' +
       'trend arrows (▲/▼), and color-coded values based on positive/negative trends.'
     ),
     tags: [
       t('Analytical'),
       t('Business'),
       t('Key Performance Indicator'),
       t('Trend'),
       t('Big Number'),
     ],
     thumbnail,
     show: true,
   });


   super({
     buildQuery,       
     controlPanel,   
     loadChart: () => import('../SupersetPluginBignumberTrendChart'), 
     metadata,         
     transformProps,   
   });
 }
}


