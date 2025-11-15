export interface LocationInfo {
  name: string;
  url: string;
}

export const LOCATIONS = {
  cafeSociedade: {
    name: 'Café Sociedade',
    url: 'https://maps.app.goo.gl/6b4hyN2v7zgYSLDb7',
  },
  fidelis: {
    name: 'Fidélis',
    url: 'https://maps.app.goo.gl/vGUHBfTgUpr96E7z7',
  },
  escolaGumaraes: {
    name: 'Antiga Escola de Gumarães (Penafiel)',
    url: 'https://maps.app.goo.gl/KbuSZ5HesDFNqh5J9',
  },
  pontoC: {
    name: 'Ponto C',
    url: 'https://maps.app.goo.gl/A42NBU42qjfrDHg18',
  },
  pontoX: {
    name: 'Ponto X',
    url: 'https://maps.app.goo.gl/B6YXyTWVt1dKQuZD9',
  },
  garagemCDDC: {
    name: 'Garagem CDDC',
    url: 'https://maps.app.goo.gl/gzdNZeS1rKfupFHV8',
  },
} as const;

export type LocationKey = keyof typeof LOCATIONS;
