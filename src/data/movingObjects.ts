import { MovingObject } from '../types/MovingObject';
import { LOCATIONS, FORMS } from './constants';
import { DESCRIPTIONS } from './descriptions';

// Import assets
import gumaJazzCartaz from '../assets/GUMAJAZZ_cartaz.jpg';
import gumaJazzLogo from '../assets/GUMAJAZZ_logo.png';
import gumaJazzGig15 from '../assets/GUMAJAZZ_gig_15.jpeg';
import gumaJazzGig17 from '../assets/GUMAJAZZ_gig_17.jpeg';
import gumaJazzGig18 from '../assets/GUMAJAZZ_gig_18.jpeg';
import gumaJazzGig21 from '../assets/GUMAJAZZ_gig_21.jpeg';
import gumaJazzGig22 from '../assets/GUMAJAZZ_gig_22.jpeg';

// Define moving objects with explicit probability weights
export const movingObjects: MovingObject[] = [
  // Cartaz - very minimal probability since it's always shown first (weight: 0.1)
  {
    image: gumaJazzCartaz,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.cartaz,
    weight: 0.1,
  },
  // Logo - minimal probability (weight: 1 ≈ 5.9%)
  {
    image: gumaJazzLogo,
    formLink: FORMS.gumaJazz,
    ticketsLink: null,
    location: null,
    weight: 1,
  },
  // Artist gig images - maximum focus (weight: 3 each ≈ 17.6% each, 70.6% total)
  {
    image: gumaJazzGig15,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.workshop15h,
    weight: 3,
  },
  {
    image: gumaJazzGig17,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.gentrifugacao17h,
    weight: 3,
  },
  {
    image: gumaJazzGig18,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.miguelMeirinhos18h,
    weight: 3,
  },
  {
    image: gumaJazzGig21,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.claraLacerdaTrio21h,
    weight: 3,
  },
  {
    image: gumaJazzGig22,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.barananu22h,
    weight: 3,
  },
  // Commented out logos with weight references for future use
  // { image: logoB1, formLink: FORMS.fichaSocio, ticketsLink: null, location: null, weight: 1 },
  // { image: logoB2, formLink: FORMS.fichaSocio, ticketsLink: null, location: null, weight: 1 },
  // { image: logoW1, formLink: FORMS.fichaSocio, ticketsLink: null, location: null, weight: 1 },
  // { image: logoW2, formLink: FORMS.fichaSocio, ticketsLink: null, location: null, weight: 1 },
];

export const eAgoraObject = movingObjects[0];
