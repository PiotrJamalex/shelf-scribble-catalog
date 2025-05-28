import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { InventoryItem } from '@/types/inventory';
import { useInventoryStore } from '@/stores/inventoryStore';
import { ImageUpload } from '@/components/ImageUpload';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InventoryItem;
}

export function ItemForm({ isOpen, onClose, item }: ItemFormProps) {
  const { addItem, updateItem, shelves, racks, boxes, binders, containers } = useInventoryStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    images: [] as string[],
    location: {
      shelfId: '',
      boxId: undefined as string | undefined,
      binderId: undefined as string | undefined,
      containerId: undefined as string | undefined,
    },
  });
  
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        tags: [...item.tags],
        images: [...item.images],
        location: { ...item.location },
      });
    } else {
      setFormData({
        name: '',
        description: '',
        tags: [],
        images: [],
        location: { shelfId: '', boxId: undefined, binderId: undefined, containerId: undefined },
      });
    }
  }, [item, isOpen]);

  const selectedShelf = shelves.find(s => s.id === formData.location.shelfId);
  const availableBoxes = boxes.filter(b => b.shelfId === formData.location.shelfId);
  const availableBinders = binders.filter(b => b.shelfId === formData.location.shelfId);
  const availableContainers = containers.filter(c => c.shelfId === formData.location.shelfId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (item) {
      updateItem(item.id, formData);
    } else {
      addItem(formData);
    }
    
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edytuj przedmiot' : 'Dodaj nowy przedmiot'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nazwa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Opis</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Regał i półka *</Label>
            <Select
              value={formData.location.shelfId}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                location: { shelfId: value, boxId: undefined, binderId: undefined, containerId: undefined }
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz półkę" />
              </SelectTrigger>
              <SelectContent>
                {shelves.map((shelf) => {
                  const rack = racks.find(r => r.id === shelf.rackId);
                  return (
                    <SelectItem key={shelf.id} value={shelf.id}>
                      {rack?.name} {rack?.number} - Półka {shelf.number}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Karton (opcjonalnie)</Label>
              <Select
                value={formData.location.boxId || 'none'}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, boxId: value === 'none' ? undefined : value }
                }))}
                disabled={!selectedShelf}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz karton" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Brak kartonu</SelectItem>
                  {availableBoxes.map((box) => (
                    <SelectItem key={box.id} value={box.id}>
                      {box.name} (#{box.number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Segregator (opcjonalnie)</Label>
              <Select
                value={formData.location.binderId || 'none'}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, binderId: value === 'none' ? undefined : value }
                }))}
                disabled={!selectedShelf}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz segregator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Brak segregatora</SelectItem>
                  {availableBinders.map((binder) => (
                    <SelectItem key={binder.id} value={binder.id}>
                      {binder.name} (#{binder.number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Inne opakowanie (opcjonalnie)</Label>
              <Select
                value={formData.location.containerId || 'none'}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, containerId: value === 'none' ? undefined : value }
                }))}
                disabled={!selectedShelf}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz opakowanie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Brak opakowania</SelectItem>
                  {availableContainers.map((container) => (
                    <SelectItem key={container.id} value={container.id}>
                      {container.name} - {container.type} (#{container.number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Tagi</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Dodaj tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <ImageUpload
            images={formData.images}
            onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {item ? 'Aktualizuj' : 'Dodaj'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Anuluj
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
