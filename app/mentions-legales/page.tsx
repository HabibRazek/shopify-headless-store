import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales | PackedIn - Emballages Premium Tunisie',
  description: 'Mentions légales de PackedIn.tn - Informations légales sur notre société Kings Worldwide Distribution spécialisée dans l\'emballage flexible en Tunisie.',
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Mentions Légales
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Éditeur du site
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <p><strong>Nom commercial :</strong> Packedin.tn</p>
                <p><strong>Raison sociale :</strong> Société Kings Worldwide Distribution</p>
                <p><strong>Adresse du siège social :</strong> Megrine Business Center, Mégrine Saint Gobain, 2033 Ben Arous, Tunisie</p>
                <p><strong>Numéro d'immatriculation :</strong> 1586831/T/N/M/000</p>
                <p><strong>Téléphone :</strong> +216 20 387 333 / +216 50 09 5115</p>
                <p><strong>Adresse email :</strong> contact@packedin.tn</p>
                <p><strong>Responsable de la publication :</strong> Kacem Berkhais</p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Propriété intellectuelle
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Tous les éléments du site Packedin.tn (textes, images, graphismes, logo, vidéos, icônes, sons, logiciels…) 
                  sont protégés par le droit d'auteur et la propriété intellectuelle.
                </p>
                <p>
                  Ils sont la propriété exclusive de la société Kings Worldwide Distribution ou de ses partenaires.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments 
                  du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Hébergement
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                <p><strong>Site web :</strong> <a href="https://vercel.com" className="text-green-600 hover:text-green-700">vercel.com</a></p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Responsabilité
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année.
                </p>
                <p>
                  Cependant, des erreurs ou omissions peuvent survenir. L'internaute devra donc s'assurer de l'exactitude des informations 
                  auprès de Packedin.tn et signaler toutes modifications du site qu'il jugerait utile.
                </p>
                <p>
                  Packedin.tn n'est en aucun cas responsable de l'utilisation faite de ces informations, et de tout préjudice direct ou indirect 
                  pouvant en découler.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Liens hypertextes
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres ressources 
                  présentes sur le réseau Internet ne sauraient engager la responsabilité de Packedin.tn.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                Droit applicable
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Tout litige en relation avec l'utilisation du site Packedin.tn est soumis au droit tunisien. 
                  Il est fait attribution exclusive de juridiction aux tribunaux compétents de Tunis.
                </p>
              </div>
            </section>

            {/* Contact */}
            <div className="bg-green-50 rounded-lg p-6 mt-12">
              <h3 className="text-xl font-bold text-green-800 mb-4">Contact</h3>
              <p className="text-green-700">
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter à : 
                <a href="mailto:contact@packedin.tn" className="font-semibold hover:underline ml-1">contact@packedin.tn</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
