
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Image } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const imageUrl = event.target.result as string;
            onImagesChange([...images, imageUrl]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      onImagesChange([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (imageToRemove: string) => {
    onImagesChange(images.filter(img => img !== imageToRemove));
  };

  return (
    <div>
      <Label>Zdjęcia</Label>
      
      <div className="space-y-3 mt-2">
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="flex-1"
          />
          <Button type="button" onClick={() => document.querySelector('input[type="file"]')?.click()} size="sm">
            <Upload className="h-3 w-3 mr-1" />
            Plik
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Lub dodaj URL zdjęcia"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
          />
          <Button type="button" onClick={addImageUrl} size="sm">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Zdjęcie ${index + 1}`}
              className="w-full h-20 object-cover rounded"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0"
              onClick={() => removeImage(image)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
