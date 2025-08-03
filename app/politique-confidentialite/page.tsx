import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | PackedIn - Protection des Données',
  description: 'Politique de confidentialité de PackedIn.tn - Comment nous protégeons et utilisons vos données personnelles conformément à la législation tunisienne.',
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Politique de Confidentialité
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-6 text-lg">
              Chez Packedin.tn, nous nous engageons à protéger la vie privée de nos utilisateurs et clients. 
              Cette politique décrit les types d'informations que nous collectons, comment nous les utilisons 
              et les choix dont vous disposez à cet égard.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Données collectées
              </h2>
              <p className="text-gray-700 mb-4">Nous collectons les données suivantes :</p>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Informations personnelles :</h4>
                  <p className="text-blue-700">nom, adresse e-mail, numéro de téléphone, adresse de livraison.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Informations de navigation :</h4>
                  <p className="text-purple-700">adresse IP, type de navigateur, pages visitées, cookies.</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Finalité de la collecte
              </h2>
              <p className="text-gray-700 mb-4">Vos données sont utilisées pour :</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</span>
                  <span className="text-gray-700">Traiter vos commandes et assurer les livraisons.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</span>
                  <span className="text-gray-700">Améliorer votre expérience utilisateur.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</span>
                  <span className="text-gray-700">Vous envoyer des offres promotionnelles (si vous y avez consenti).</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</span>
                  <span className="text-gray-700">Répondre à vos demandes ou questions.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Partage des données
              </h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-800 font-semibold">
                  Packedin.tn s'engage à ne jamais vendre vos données personnelles.
                </p>
              </div>
              <p className="text-gray-700 mb-4">Nous pouvons toutefois les partager avec :</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">🚚</span>
                  <span className="text-gray-700">Nos partenaires logistiques pour assurer la livraison.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">💳</span>
                  <span className="text-gray-700">Nos prestataires techniques (paiement en ligne, hébergement).</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">⚖️</span>
                  <span className="text-gray-700">Les autorités compétentes, si la loi l'exige.</span>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Durée de conservation
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">
                  Les données sont conservées le temps nécessaire aux finalités mentionnées, 
                  ou pour répondre aux obligations légales et fiscales.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Vos droits
              </h2>
              <p className="text-gray-700 mb-4">
                Conformément à la Loi tunisienne n° 2004-63, vous disposez de droits :
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Droit d'accès</h4>
                  <p className="text-green-700 text-sm">Accès à vos données personnelles.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Droit de rectification</h4>
                  <p className="text-blue-700 text-sm">Rectification ou suppression de vos informations.</p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-yellow-800">
                  📩 Pour exercer vos droits, contactez-nous à : 
                  <a href="mailto:contact@packedin.tn" className="font-semibold hover:underline ml-1">contact@packedin.tn</a>
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                Sécurité des données
              </h2>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-green-800">
                  Nous mettons en place des mesures de sécurité strictes pour protéger vos informations
                  contre tout accès non autorisé, perte, vol ou altération.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                Cookies
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Le site peut utiliser des cookies pour améliorer la navigation.
                </p>
                <p>
                  Vous pouvez modifier les paramètres de votre navigateur pour les désactiver.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                Modifications
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">
                  Packedin.tn se réserve le droit de modifier à tout moment la présente politique de confidentialité.
                  Les mises à jour seront publiées sur cette page.
                </p>
              </div>
            </section>

            {/* Contact */}
            <div className="bg-green-50 rounded-lg p-6 mt-12">
              <h3 className="text-xl font-bold text-green-800 mb-4">Contact</h3>
              <p className="text-green-700">
                Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à :
                <a href="mailto:contact@packedin.tn" className="font-semibold hover:underline ml-1">contact@packedin.tn</a>
              </p>
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-green-600">
                  Dernière mise à jour : Janvier 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
