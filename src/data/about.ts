import { ContentItem } from '../types/ContentItem';
import logoB1 from '/logo_b_1.png';
import QsEAgora from '../assets/QS_EAgora.png';
import QsEcras from '../assets/QS_Ecras.png';
import QsFotoGrupo from '../assets/QS_FotoGrupo.png';
import QsLojaPopUp from '../assets/QS_LojaPopUp.png';
import QsPublico from '../assets/QS_Publico.png';

export const aboutItems: ContentItem[] = [
  { kind: 'image', src: logoB1, alt: 'Associação 140' },
  {
    kind: 'text',
    text: 'Associação 140. Associação sem fins lucrativos, artística e sociocultural.\n\nCriámos e promovemos projetos artísticos e culturais, com forte consciência ambiental e compromisso com a sustentabilidade.\n\nA missão é conectar a arte à comunidade.',
  },
  { kind: 'image', src: QsEAgora, alt: 'E Agora?' },
  {
    kind: 'text',
    text: '"E Agora ?"\n\nPergunta muito frequente quando chegamos a um fim, a um término de algo de que gostamos ou que participamos.\nO saber que há um fim acrescenta um toque agridoce a tudo a que nos propomos fazer.\nNa nossa opinião, o “e agora?” apresenta-se como uma nova oportunidade, uma roupagem nova, onde as ideias e as capacidades se sentem renovadas, embebidas de um néctar criativo, tornando a nossa sede (e que sede!) impossível de ser saciada.\n\nFecha-se a porta do armazém e abre-se a janela de casa.\nEssa casa chama-se Associação 140, lugar onde a arte e a cultura encontram (des)conforto para poder existir e fluir.',
  },
  { kind: 'image', src: QsEcras, alt: 'Ecrãs' },

  {
    kind: 'text',
    text: 'Comunidade 140: pessoas diferentes a construir em conjunto. A casa é de quem participa.',
  },
  { kind: 'image', src: QsLojaPopUp, alt: 'Loja Pop-Up' },
  {
    kind: 'text',
    text: 'Exposições, oficinas, jam sessions, cinema, conversas e lojas pop‑up: formatos diversos para públicos diversos.',
  },
  { kind: 'image', src: QsPublico, alt: 'Público' },
  { kind: 'text', text: 'A missão é ligar a arte à comunidade — aparece, propõe, colabora.' },
  { kind: 'image', src: QsFotoGrupo, alt: 'Grupo' },
  { kind: 'text', text: 'Obrigado!' },
];

export default aboutItems;
