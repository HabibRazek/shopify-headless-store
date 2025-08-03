import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | PackedIn - CGV',
  description: 'Conditions générales de vente de PackedIn.tn - Modalités de commande, livraison et garanties pour nos solutions d\'emballage en Tunisie.',
};

export default function ConditionsGeneralesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Conditions Générales de Vente
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-6 text-lg">
              Les présentes conditions générales de vente s'appliquent à toutes les commandes 
              passées sur le site Packedin.tn.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Objet et champ d'application
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les présentes conditions générales de vente (CGV) régissent les relations contractuelles 
                  entre la société Kings Worldwide Distribution (Packedin.tn) et ses clients.
                </p>
                <p>
                  Toute commande implique l'acceptation pleine et entière des présentes conditions générales de vente.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Produits et services
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Packedin.tn propose des solutions d'emballage flexible personnalisées, notamment :
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold mr-2 mt-1">•</span>
                    <span>Doypacks personnalisés</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold mr-2 mt-1">•</span>
                    <span>Emballages éco-responsables</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold mr-2 mt-1">•</span>
                    <span>Solutions sur mesure</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Commandes et devis
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les commandes peuvent être passées via notre site web ou par contact direct.
                </p>
                <p>
                  Tout devis est valable 30 jours à compter de sa date d'émission.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Processus de commande :</h4>
                  <ol className="space-y-1 text-blue-700 text-sm">
                    <li>1. Demande de devis</li>
                    <li>2. Validation du devis</li>
                    <li>3. Confirmation de commande</li>
                    <li>4. Production et livraison</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Prix et paiement
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les prix sont exprimés en dinars tunisiens (TND) et sont valables au moment de la commande.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Modalités de paiement</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Virement bancaire</li>
                      <li>• Chèque</li>
                      <li>• Espèces (sur place)</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Conditions</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Acompte : 50% à la commande</li>
                      <li>• Solde : à la livraison</li>
                      <li>• Délai : 30 jours maximum</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Livraison
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les délais de livraison sont communiqués à titre indicatif et dépendent de la complexité de la commande.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <p><strong>Zone de livraison :</strong> Tunisie entière</p>
                  <p><strong>Délai standard :</strong> 7 à 15 jours ouvrables</p>
                  <p><strong>Frais de livraison :</strong> Selon destination et volume</p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                Garanties et réclamations
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Nos produits sont garantis contre tout défaut de fabrication.
                </p>
                <p>
                  Toute réclamation doit être formulée dans les 48h suivant la réception.
                </p>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-red-800">
                    <strong>Important :</strong> Les produits personnalisés ne peuvent être repris sauf défaut de fabrication.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                Droit applicable et litiges
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Les présentes CGV sont soumises au droit tunisien.
                </p>
                <p>
                  En cas de litige, les tribunaux de Tunis sont seuls compétents.
                </p>
              </div>
            </section>

            {/* Contact */}
            <div className="bg-green-50 rounded-lg p-6 mt-12">
              <h3 className="text-xl font-bold text-green-800 mb-4">Contact</h3>
              <p className="text-green-700">
                Pour toute question concernant ces conditions générales de vente : 
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
