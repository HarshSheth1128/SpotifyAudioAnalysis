import { AxisDomain } from 'recharts';
import { GraphFeatures } from './types';

export const featureDomains: {
  [key: string]: [AxisDomain, AxisDomain]
} = {
  [GraphFeatures.danceability]: [0,1],
  [GraphFeatures.energy]: [0,1],
  [GraphFeatures.loudness]: [0, 1],
  [GraphFeatures.valence]: [0, 1],  
  [GraphFeatures.tempo]: [0, 250]
}
