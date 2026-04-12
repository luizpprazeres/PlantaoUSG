const BASE_URL = 'https://laudousg.com/';
const UTM_SOURCE = 'utm_source=plantao_usg&utm_medium=app';

export const FunilURLs = {
  home: `${BASE_URL}?${UTM_SOURCE}&utm_campaign=home`,
  resultado: `${BASE_URL}?${UTM_SOURCE}&utm_campaign=resultado`,
  historico: `${BASE_URL}?${UTM_SOURCE}&utm_campaign=historico`,
  sobre: `${BASE_URL}?${UTM_SOURCE}&utm_campaign=sobre`,
  modal5: `${BASE_URL}?${UTM_SOURCE}&utm_campaign=modal_5`,
} as const;
