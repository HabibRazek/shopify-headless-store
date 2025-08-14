'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UploadDropzone } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { 
  Download, 
  Package, 
  CheckCircle,
  AlertCircle,
  Info,
  Printer,
  X
} from 'lucide-react';

const KRAFT_VIEW_DIMENSIONS = [
  '10×15', '12×20', '14×22', '16×26', '18×30', '20×30'
];

const KRAFT_ALU_DIMENSIONS = [
  '10×15', '11×18.5', '13×21', '17×24', '20×30'
];

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company: string;
  material: 'KRAFT_VIEW' | 'KRAFT_ALU' | '';
  dimensions: string;
  quantity: string;
  deliveryDate: string;
  notes: string;
  designFileUrl: string;
  designFileName: string;
}

interface PrintServiceDialogProps {
  trigger: React.ReactNode;
}

export function PrintServiceDialog({ trigger }: PrintServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    company: '',
    material: '',
    dimensions: '',
    quantity: '',
    deliveryDate: '',
    notes: '',
    designFileUrl: '',
    designFileName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMaterialChange = (material: 'KRAFT_VIEW' | 'KRAFT_ALU') => {
    setFormData(prev => ({
      ...prev,
      material,
      dimensions: '' // Reset dimensions when material changes
    }));
  };

  const getAvailableDimensions = () => {
    return formData.material === 'KRAFT_VIEW' ? KRAFT_VIEW_DIMENSIONS : KRAFT_ALU_DIMENSIONS;
  };

  const downloadInstructions = () => {
    const instructions = `
INSTRUCTIONS POUR LES FICHIERS GRAPHIQUES - SERVICE D'IMPRESSION PACKEDIN

FORMATS ACCEPTÉS:
- PDF (recommandé)
- Adobe Illustrator (.ai)

SPÉCIFICATIONS TECHNIQUES:
- Résolution: 300 DPI minimum
- Mode colorimétrique: CMJN
- Fond perdu: 3mm de chaque côté
- Zone de sécurité: 5mm des bords

DIMENSIONS DISPONIBLES:

KRAFT VIEW:
- 10×15 cm, 12×20 cm, 14×22 cm
- 16×26 cm, 18×30 cm, 20×30 cm

KRAFT ALU:
- 10×15 cm, 11×18.5 cm, 13×21 cm
- 17×24 cm, 20×30 cm

NOTES IMPORTANTES:
- Les dimensions indiquées correspondent aux mesures externes de la pochette
- Quantité minimum: 300 unités
- Délai de production: 5-7 jours ouvrables

CONTACT:
Email: packedin.tn@gmail.com
Téléphone: +216 29 362 224
    `;

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Instructions_Graphiques_Packedin.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Instructions téléchargées avec succès!');
  };

  const validateForm = () => {
    const requiredFields = [
      'customerName', 'customerEmail', 'material', 'dimensions', 
      'quantity', 'deliveryDate', 'designFileUrl'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        return false;
      }
    }
    
    const quantity = parseInt(formData.quantity);
    if (quantity < 300) {
      toast.error('La quantité minimum est de 300 unités');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/print-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity)
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success('Votre demande a été envoyée avec succès!');
        setStep(4); // Success step
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de l\'envoi de votre demande');
      }
    } catch (error) {
      console.error('Network Error:', error);
      toast.error('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.customerName || !formData.customerEmail) {
        toast.error('Veuillez remplir vos informations de contact');
        return;
      }
    } else if (step === 2) {
      if (!formData.material || !formData.dimensions) {
        toast.error('Veuillez sélectionner le matériau et les dimensions');
        return;
      }
    } else if (step === 3) {
      if (!formData.quantity || !formData.deliveryDate || !formData.designFileUrl) {
        toast.error('Veuillez compléter toutes les informations');
        return;
      }
      if (parseInt(formData.quantity) < 300) {
        toast.error('La quantité minimum est de 300 unités');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      company: '',
      material: '',
      dimensions: '',
      quantity: '',
      deliveryDate: '',
      notes: '',
      designFileUrl: '',
      designFileName: ''
    });
    setStep(1);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full flex items-center justify-center">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Service d'Impression Personnalisée
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Créez vos pochettes personnalisées avec vos propres designs
                </DialogDescription>
              </div>
            </div>
            <Button
              onClick={downloadInstructions}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Instructions
            </Button>
          </div>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">Informations de Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nom complet *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Téléphone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Entreprise</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Format Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">Sélection du Format</h3>

              <div>
                <Label className="text-base font-medium mb-3 block">Matériau *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                      formData.material === 'KRAFT_VIEW'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMaterialChange('KRAFT_VIEW')}
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-medium">Kraft View</h4>
                        <p className="text-sm text-gray-600">Fenêtre transparente</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                      formData.material === 'KRAFT_ALU'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMaterialChange('KRAFT_ALU')}
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="w-6 h-6 text-gray-600" />
                      <div>
                        <h4 className="font-medium">Kraft Alu</h4>
                        <p className="text-sm text-gray-600">Barrière aluminium</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {formData.material && (
                <div>
                  <Label htmlFor="dimensions">Dimensions (cm) *</Label>
                  <Select value={formData.dimensions} onValueChange={(value) => handleInputChange('dimensions', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez les dimensions" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDimensions().map((dimension) => (
                        <SelectItem key={dimension} value={dimension}>
                          {dimension} cm
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Note importante</h4>
                    <p className="text-sm text-blue-700">
                      Les dimensions indiquées correspondent aux mesures externes de la pochette.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Order Details */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">Détails de la Commande</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantité *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="300"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="Minimum 300 unités"
                  />
                  <p className="text-sm text-gray-500 mt-1">Quantité minimum: 300 unités</p>
                </div>
                <div>
                  <Label htmlFor="deliveryDate">Date de livraison souhaitée *</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                  <p className="text-sm text-gray-500 mt-1">Délai minimum: 7 jours ouvrables</p>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Upload du Design *</Label>
                {!formData.designFileUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <UploadDropzone
                      endpoint="designUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          setFormData(prev => ({
                            ...prev,
                            designFileUrl: res[0].url,
                            designFileName: res[0].name
                          }));
                          toast.success('Fichier uploadé avec succès!');
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Erreur d'upload: ${error.message}`);
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Fichier uploadé</p>
                        <p className="text-sm text-green-700">{formData.designFileName}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, designFileUrl: '', designFileName: '' }))}
                        className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white"
                      >
                        Changer
                      </Button>
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Formats acceptés: PDF, Adobe Illustrator (.ai)
                </p>
              </div>

              <div>
                <Label htmlFor="notes">Notes additionnelles</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Informations supplémentaires, instructions spéciales..."
                  rows={3}
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Résumé de votre demande</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Matériau:</span>
                    <Badge variant="secondary">
                      {formData.material === 'KRAFT_VIEW' ? 'Kraft View' : 'Kraft Alu'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span className="font-medium">{formData.dimensions} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantité:</span>
                    <span className="font-medium">{formData.quantity} unités</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date souhaitée:</span>
                    <span className="font-medium">
                      {formData.deliveryDate ? new Date(formData.deliveryDate).toLocaleDateString('fr-FR') : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Demande envoyée avec succès!
              </h3>
              <p className="text-gray-600 mb-4">
                Nous avons bien reçu votre demande d'impression personnalisée.
                Notre équipe va l'examiner et vous contacter sous 24-48h.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Prochaines étapes:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Révision de votre design par notre équipe</li>
                  <li>• Validation des spécifications techniques</li>
                  <li>• Envoi d'un devis détaillé</li>
                  <li>• Confirmation de la commande</li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t gap-4">
          {step > 1 && step < 4 && (
            <Button variant="outline" onClick={prevStep} size="sm">
              Précédent
            </Button>
          )}
          {step === 1 && <div />}
          {step < 3 && (
            <Button onClick={nextStep} size="sm" className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white">
              Suivant
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="sm"
              className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white"
            >
              {isSubmitting ? 'Envoi...' : 'Envoyer la Demande'}
            </Button>
          )}
          {step === 4 && (
            <Button onClick={handleClose} size="sm" className="bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] hover:from-green-800 hover:via-green-600 hover:to-[#77db19] text-white">
              Fermer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
