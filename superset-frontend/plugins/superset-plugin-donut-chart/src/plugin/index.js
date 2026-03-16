import { t, ChartMetadata, ChartPlugin } from '@superset-ui/core';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from '../images/thumbnail.png';


export default class DonutChartPlugin extends ChartPlugin {
 constructor() {
   const metadata = new ChartMetadata({
     description: 'Enhanced Donut Chart with customizable options',
     name: t('Enhanced Donut Chart'),
     thumbnail,
     credits: ['Recharts', 'Superset UI'],
     supportedAnnotationTypes: ['FORMULA', 'INTERVAL', 'EVENT'],
     tags: ['analytical', 'comparison', 'proportional'],
     category: t('Part-to-whole'),
   });


   super({
     buildQuery,
     controlPanel,
     loadChart: () => import('../SupersetPluginDonutChart'),
     metadata,
     transformProps,
   });
 }
}
