import { EventItem } from '../types/Event';
import { LOCATIONS } from './constants';
import { DESCRIPTIONS } from './descriptions';

// Assets
import GumaJazz from '../assets/25_08_17_GumaJazz.jpg';
import OhmeSessions from '../assets/25_07_26_Ohme_Sessions.jpg';
import LojaPopUp from '../assets/24_12_28_LojaPopUp_AteJa.jpeg';
import Beernissage_Jam from '../assets/25_01_11_Beernissage_Jam.jpeg';
import Beernissage_Bruxa from '../assets/25_02_08_Beernissage_Bruxa.jpeg';
import VozesQueRasgam from '../assets/25_03_01_Vozes_Que_Rasgam.jpeg';
import Beernissage_Claudia from '../assets/25_03_08_Beernissage_Claudia.jpeg';
import MotherEarthsPlantasia from '../assets/25_03_23_Mother_Earths_Plantasia.jpeg';
import Beernissage_Lourenco from '../assets/25_04_12_Beernissage_Lourenco.jpeg';
import AbrilLiberdade from '../assets/25_04_25_de_Abril_Liberdade.jpeg';

export const events: EventItem[] = [
  {
    id: '2025-08-17-gumajazz',
    name: 'GumaJazz',
    description: DESCRIPTIONS.gumaJazz,
    image: GumaJazz,
    location: LOCATIONS.gumaJazz,
    startAt: '2025-08-17T15:00:00',
    endAt: '2025-08-17T23:59:00',
    weight: 1,
  },
  {
    id: '2024-12-28-loja-pop-up',
    name: 'Loja Pop Up - Até Já',
    image: LojaPopUp,
    startAt: '2024-12-28T14:00:00',
    endAt: '2024-12-28T19:00:00',
    description: DESCRIPTIONS.lojaPopUp,
    weight: 1,
  },
  {
    id: '2025-01-11-beernissage-jam',
    name: 'Beernissage - Jam',
    image: Beernissage_Jam,
    startAt: '2025-01-11T21:00:00',
    endAt: '2025-01-11T23:30:00',
    description: DESCRIPTIONS.beernissageJam,
    weight: 1,
  },
  {
    id: '2025-02-08-beernissage-bruxa',
    name: 'Beernissage - Bruxa',
    image: Beernissage_Bruxa,
    startAt: '2025-02-08T21:00:00',
    endAt: '2025-02-08T23:30:00',
    description: DESCRIPTIONS.beernissageBruxa,
    weight: 1,
  },
  {
    id: '2025-03-01-vozes-que-rasgam',
    name: 'Vozes que rasgam',
    image: VozesQueRasgam,
    startAt: '2025-03-01T21:00:00',
    endAt: '2025-03-01T23:00:00',
    description: DESCRIPTIONS.vozesQueRasgam,
    weight: 1,
  },
  {
    id: '2025-03-08-beernissage-claudia',
    name: 'Beernissage - Cláudia',
    image: Beernissage_Claudia,
    startAt: '2025-03-08T21:00:00',
    endAt: '2025-03-08T23:30:00',
    description: DESCRIPTIONS.beernissageClaudia,
    weight: 1,
  },
  {
    id: '2025-03-23-plantasia',
    name: "Mother Earth's Plantasia",
    image: MotherEarthsPlantasia,
    startAt: '2025-03-23T18:00:00',
    endAt: '2025-03-23T20:00:00',
    description: DESCRIPTIONS.plantasia,
    weight: 1,
  },
  {
    id: '2025-04-12-beernissage-lourenco',
    name: 'Beernissage - Lourenço',
    image: Beernissage_Lourenco,
    startAt: '2025-04-12T21:00:00',
    endAt: '2025-04-12T23:30:00',
    description: DESCRIPTIONS.beernissageLourenco,
    weight: 1,
  },
  {
    id: '2025-04-25-abril-liberdade',
    name: '25 de Abril - Liberdade',
    image: AbrilLiberdade,
    startAt: '2025-04-25T15:00:00',
    endAt: '2025-04-25T23:00:00',
    description: DESCRIPTIONS.abrilLiberdade,
    weight: 1,
  },
  {
    id: '2025-07-26-ohme-sessions-julho',
    name: 'Ohme Sessions - Julho',
    image: OhmeSessions,
    startAt: '2025-07-26T21:00:00',
    endAt: '2025-07-26T23:30:00',
    description: DESCRIPTIONS.ohmeJulho,
    weight: 1,
  },
];


