import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Camera, Upload, X, CheckCircle, Smile, Meh, Frown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { LocationPickerMap } from './LocationPickerMap';
import type { IncidentReport } from '../App';

interface IncidentReportFormProps {
  onSubmit: (report: Omit<IncidentReport, 'id' | 'timestamp'>) => void;
}

export function IncidentReportForm({ onSubmit }: IncidentReportFormProps) {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === files.length) {
            setPhotos([...photos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    // Optionally update the location text field with coordinates
    setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || !description) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        location,
        description,
        priority,
        photos,
        coordinates,
      });

      // Reset form
      setLocation('');
      setDescription('');
      setPriority('medium');
      setPhotos([]);
      setCoordinates(undefined);
      setIsSubmitting(false);

      toast.success('¡Incidente reportado exitosamente!');
    }, 500);
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle>Reportar Nuevo Incidente</CardTitle>
          <CardDescription>
            Complete los detalles a continuación y suba fotos del incidente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Severity Level */}
            <div className="space-y-3">
              <Label>Nivel de Gravedad *</Label>
              <div className="flex gap-3 justify-center">
                <button
                    type="button"
                    onClick={() => setPriority('low')}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                        priority === 'low'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                >
                  <Smile className={`w-12 h-12 mx-auto ${
                      priority === 'low' ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <p className={`mt-2 ${
                      priority === 'low' ? 'text-green-700' : 'text-gray-600'
                  }`}>Baja</p>
                </button>

                <button
                    type="button"
                    onClick={() => setPriority('medium')}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                        priority === 'medium'
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 bg-white hover:border-yellow-300'
                    }`}
                >
                  <Meh className={`w-12 h-12 mx-auto ${
                      priority === 'medium' ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                  <p className={`mt-2 ${
                      priority === 'medium' ? 'text-yellow-700' : 'text-gray-600'
                  }`}>Media</p>
                </button>

                <button
                    type="button"
                    onClick={() => setPriority('high')}
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                        priority === 'high'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-white hover:border-red-300'
                    }`}
                >
                  <Frown className={`w-12 h-12 mx-auto ${
                      priority === 'high' ? 'text-red-500' : 'text-gray-400'
                  }`} />
                  <p className={`mt-2 ${
                      priority === 'high' ? 'text-red-700' : 'text-gray-600'
                  }`}>Alta</p>
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                  id="location"
                  placeholder="ej., Edificio A, Piso 3, Oficina 301"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
              />
            </div>

            {/* Map for Location Selection */}
            <div className="space-y-2">
              <Label>Marcar Ubicación en el Mapa</Label>
              <LocationPickerMap
                  onLocationSelect={handleLocationSelect}
                  initialPosition={coordinates}
              />
              {coordinates && (
                  <p className="text-xs text-gray-500">
                    Coordenadas seleccionadas: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                  id="description"
                  placeholder="Proporcione información detallada sobre el incidente..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Fotos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Haga clic para subir fotos</p>
                    <p className="text-gray-400 text-sm">PNG, JPG hasta 10MB</p>
                  </div>
                </label>
              </div>

              {/* Photo Previews */}
              {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                              src={photo}
                              alt={`Foto del incidente ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
            >
              {isSubmitting ? (
                  'Enviando...'
              ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Enviar Reporte
                  </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}