import AboutContent from '@/components/AboutContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos de PackedIn | Emballages Écologiques en Tunisie',
  description: 'Découvrez l\'histoire de PackedIn, notre mission et pourquoi nous sommes le choix idéal pour vos besoins d\'emballage écologique en Tunisie.',
};

export default function AboutPage() {
  return <AboutContent />;
}
