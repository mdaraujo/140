import { MovingObject } from '../types/MovingObject';
import logoW1 from '/logo_b_1.png';
import QsEAgora from '../assets/QS_EAgora.png';
import QsEcras from '../assets/QS_Ecras.png';
import QsFotoGrupo from '../assets/QS_FotoGrupo.png';
import QsLojaPopUp from '../assets/QS_LojaPopUp.png';
import QsPublico from '../assets/QS_Publico.png';

export const aboutItems: MovingObject[] = [
  {
    image: logoW1,
    formLink: null,
    ticketsLink: null,
    location: null,
    description:
      'Associação 140. Associação sem fins lucrativos, artística e sociocultural.\nCriámos e promovemos projetos artísticos e culturais, com forte consciência ambiental e compromisso com a sustentabilidade.\nA missão é conectar a arte à comunidade.',
    weight: 1,
  },
  {
    image: QsEAgora,
    formLink: null,
    ticketsLink: null,
    location: null,
    description:
      '"E Agora ?"\n\nPergunta muito frequente quando chegamos a um fim, a um término de algo de que gostamos ou que participamos.\nO saber que há um fim acrescenta um toque agridoce a tudo a que nos propomos fazer.\nNa nossa opinião, o “e agora?” apresenta-se como uma nova oportunidade, uma roupagem nova, onde as ideias e as capacidades se sentem renovadas, embebidas de um néctar criativo, tornando a nossa sede (e que sede!) impossível de ser saciada.\n\nFecha-se a porta do armazém e abre-se a janela de casa.\nEssa casa chama-se Associação 140, lugar onde a arte e a cultura encontram (des)conforto para poder existir e fluir.',
    weight: 1,
  },
  {
    image: QsEcras,
    formLink: null,
    ticketsLink: null,
    location: null,
    description:
      'Trabalhamos com tecnologia acessível e meios modestos para maximizar ideias e ligações.',
    weight: 1,
  },
  {
    image: QsFotoGrupo,
    formLink: null,
    ticketsLink: null,
    location: null,
    description:
      'Comunidade 140: pessoas diferentes a construir em conjunto. A casa é de quem participa.',
    weight: 1,
  },
  {
    image: QsLojaPopUp,
    formLink: null,
    ticketsLink: null,
    location: null,
    description:
      'Projetos e formatos diversos: exposições, oficinas, jam sessions, cinema, conversas e lojas pop‑up.',
    weight: 1,
  },
  {
    image: QsPublico,
    formLink: null,
    ticketsLink: null,
    location: null,
    description:
      'A missão é ligar a arte à comunidade — encontros abertos, proximidade e acolhimento.',
    weight: 1,
  },
];

export default aboutItems;
