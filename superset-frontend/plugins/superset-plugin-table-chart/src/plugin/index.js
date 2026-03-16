import {
  t,
  ChartMetadata,
  ChartPlugin,
} from '@superset-ui/core';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from '../images/thumbnail.png';

export default class SupersetPluginTableChart extends ChartPlugin {
  constructor() {
    const metadata = new ChartMetadata({
      name: t('Dual Table Chart'),
      description: 'Dual table chart with full cross-filtering support',
      thumbnail,
      behaviors: [
        'INTERACTIVE_CHART',
        'DRILL_TO_DETAIL',
        'DRILL_BY',
        'CROSS_FILTER',
      ],
      canBeAnnotationTypes: ['EVENT', 'INTERVAL'],
      datasourceCount: 2,
      enableNoResults: true,
      supportedAnnotationTypes: [
        'FORMULA',
        'INTERVAL',
        'EVENT',
        'TIME_SERIES',
      ],
      supportsCrossFiltering: true,
    });

    super({
      buildQuery,
      controlPanel,
      transformProps,
      metadata,
      supportsCrossFiltering: true,
      canBeAnnotationTypes: [],
      loadChart: () => import('../SupersetPluginTableChart'),
    });
  }
}
