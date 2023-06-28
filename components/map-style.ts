import type {FillLayer} from 'react-map-gl';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer: FillLayer = {
  id: 'broadband',
  type: 'fill',
  source: 'mapbox',
  'source-layer': 'broadband',
  paint: {
    'fill-color': {
      property: 'f_broadband',
      stops: [
        [60, '#800000'],
        [70, '#b81414'],
        [80, '#d13400'],
        [90, '#ffcd38'],
        [100, '#ffff33']
      ]
    },
    'fill-opacity': 0.8
  }
};