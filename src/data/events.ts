import { EventItem } from '../types/Event';
import { LOCATIONS } from './locations';
import { DESCRIPTIONS } from './descriptions';

// Assets
import LojaPopUp_Ola from '../assets/24_12_01_LojaPopUp_1_Ola.jpg';
import LojaPopUp_PuroL from '../assets/24_12_15_LojaPopUp_2_PuroL.jpg';
import LojaPopUp_Oficinas from '../assets/24_12_21_LojaPopUp_3_Oficinas.jpg';
import LojaPopUp from '../assets/24_12_28_LojaPopUp_4_AteJa.jpg';
import Beernissage_Jam from '../assets/25_01_11_Beernissage_Jam.jpg';
import Beernissage_Bruxa from '../assets/25_02_08_Beernissage_Bruxa.jpeg';
import VozesQueRasgam from '../assets/25_03_01_Vozes_Que_Rasgam.jpeg';
import Beernissage_Claudia from '../assets/25_03_08_Beernissage_Claudia.jpeg';
import MotherEarthsPlantasia from '../assets/25_03_23_Mother_Earths_Plantasia.jpg';
import Beernissage_Lourenco from '../assets/25_04_12_Beernissage_Lourenco.jpeg';
import AbrilLiberdade from '../assets/25_04_25_de_Abril_Liberdade.jpeg';
import OhmeSessions from '../assets/25_07_26_Ohme_Sessions.jpg';
import GumaJazz from '../assets/25_08_17_GumaJazz.jpg';
import Aniversario_Capa from '../assets/25_09_26_Aniversario_Capa.jpg';
import Aniversario_Exposicao from '../assets/25_09_26_Aniversario_Exposicao.jpg';
import Aniversario_PequenoAlmoco from '../assets/25_09_27_Aniversario_PequenoAlmoco.jpg';
import Aniversario_Raku from '../assets/25_09_27_Aniversario_Raku.jpg';
import PoesiaEmConstrucao from '../assets/25_10_23_Poesia_Em_Construcao.jpg';

export const events: EventItem[] = [
  {
    id: 'loja-pop-up-ola',
    name: 'Loja Pop Up - Olá',
    image: LojaPopUp_Ola,
    startAt: '2024-12-01T10:00:00',
    endAt: '2024-12-01T11:30:00',
    description: DESCRIPTIONS.lojaPopUpOla,
    weight: 1,
  },
  {
    id: 'loja-pop-up-puro-l',
    name: 'Loja Pop Up - Puro L',
    image: LojaPopUp_PuroL,
    startAt: '2024-12-15T12:00:00',
    endAt: '2024-12-15T13:00:00',
    description: DESCRIPTIONS.lojaPopUpPuroL,
    weight: 1,
  },
  {
    id: 'loja-pop-up-oficinas',
    name: 'Loja Pop Up - Oficinas',
    image: LojaPopUp_Oficinas,
    startAt: '2024-12-21T13:00:00',
    endAt: '2024-12-21T14:00:00',
    description: DESCRIPTIONS.lojaPopUpOficinas,
    weight: 1,
  },
  {
    id: 'loja-pop-up-ate-ja',
    name: 'Loja Pop Up - Até Já',
    image: LojaPopUp,
    startAt: '2024-12-28T14:00:00',
    endAt: '2024-12-28T19:00:00',
    description: DESCRIPTIONS.lojaPopUp,
    weight: 1,
  },
  {
    id: 'beernissage-jam',
    name: 'Beernissage - Jam',
    image: Beernissage_Jam,
    startAt: '2025-01-11T21:00:00',
    endAt: '2025-01-11T23:30:00',
    description: DESCRIPTIONS.beernissageJam,
    weight: 1,
  },
  {
    id: 'beernissage-bruxa',
    name: 'Beernissage - Bruxa',
    image: Beernissage_Bruxa,
    startAt: '2025-02-08T21:00:00',
    endAt: '2025-02-08T23:30:00',
    description: DESCRIPTIONS.beernissageBruxa,
    weight: 1,
  },
  {
    id: 'vozes-que-rasgam',
    name: 'Vozes que rasgam',
    image: VozesQueRasgam,
    startAt: '2025-03-01T21:00:00',
    endAt: '2025-03-01T23:00:00',
    description: DESCRIPTIONS.vozesQueRasgam,
    weight: 1,
  },
  {
    id: 'beernissage-claudia',
    name: 'Beernissage - Cláudia',
    image: Beernissage_Claudia,
    startAt: '2025-03-08T21:00:00',
    endAt: '2025-03-08T23:30:00',
    description: DESCRIPTIONS.beernissageClaudia,
    weight: 1,
  },
  {
    id: 'plantasia',
    name: "Mother Earth's Plantasia",
    image: MotherEarthsPlantasia,
    startAt: '2025-03-23T18:00:00',
    endAt: '2025-03-23T20:00:00',
    description: DESCRIPTIONS.plantasia,
    weight: 1,
  },
  {
    id: 'beernissage-lourenco',
    name: 'Beernissage - Lourenço',
    image: Beernissage_Lourenco,
    startAt: '2025-04-12T21:00:00',
    endAt: '2025-04-12T23:30:00',
    description: DESCRIPTIONS.beernissageLourenco,
    weight: 1,
  },
  {
    id: '25-abril-25',
    name: '25 de Abril - Liberdade',
    image: AbrilLiberdade,
    startAt: '2025-04-25T15:00:00',
    endAt: '2025-04-25T23:00:00',
    description: DESCRIPTIONS.abrilLiberdade,
    weight: 1,
  },
  {
    id: 'ohme-sessions-julho-25',
    name: 'Ohme Sessions - Julho',
    image: OhmeSessions,
    startAt: '2025-07-26T21:00:00',
    endAt: '2025-07-26T23:30:00',
    description: DESCRIPTIONS.ohmeSessions,
    weight: 1,
  },
  {
    id: 'guma-jazz-25',
    name: 'GumaJazz',
    description: DESCRIPTIONS.gumaJazz,
    image: GumaJazz,
    location: LOCATIONS.escolaGumaraes,
    startAt: '2025-08-17T15:00:00',
    endAt: '2025-08-17T23:59:00',
    weight: 1,
  },
  {
    id: 'aniversario-capa-25',
    name: 'Aniversário 140',
    image: Aniversario_Capa,
    startAt: '2025-09-26T17:30:00',
    endAt: '2025-09-27T23:30:00',
    description: DESCRIPTIONS.aniversarioCapa,
    location: LOCATIONS.pontoC,
    weight: 1,
    isHeaderOnly: true,
  },
  {
    id: 'aniversario-exposicao-25',
    name: 'Aniversário 140',
    image: Aniversario_Exposicao,
    startAt: '2025-09-26T17:30:00',
    endAt: '2025-09-26T20:00:00',
    description: DESCRIPTIONS.aniversarioExposicao,
    location: LOCATIONS.pontoC,
    weight: 1,
  },
  {
    id: 'aniversario-pequeno-almoco-25',
    name: 'Aniversário 140',
    image: Aniversario_PequenoAlmoco,
    startAt: '2025-09-27T10:00:00',
    endAt: '2025-09-27T13:00:00',
    description: DESCRIPTIONS.aniversarioPequenoAlmoco,
    location: LOCATIONS.pontoC,
    weight: 1,
  },
  {
    id: 'aniversario-raku-25',
    name: 'Aniversário 140',
    image: Aniversario_Raku,
    startAt: '2025-09-27T17:00:00',
    endAt: '2025-09-27T23:30:00',
    description: DESCRIPTIONS.aniversarioRaku,
    location: LOCATIONS.pontoC,
    weight: 1,
  },
  {
    id: 'poesia-em-construcao',
    name: 'Poesia em Construção',
    image: PoesiaEmConstrucao,
    startAt: '2025-10-23T21:30:00',
    endAt: '2025-10-24T00:00:00',
    description: DESCRIPTIONS.poesiaEmConstrucao,
    location: LOCATIONS.pontoC,
    weight: 1,
  },
];
