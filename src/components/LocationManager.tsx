
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Archive, Folder } from 'lucide-react';
import { useInventoryStore } from '@/stores/inventoryStore';

export function LocationManager() {
  const { 
    racks, shelves, boxes, 
    addRack, addShelf, addBox,
    deleteRack, deleteShelf, deleteBox,
    getItemsByLocation 
  } = useInventoryStore();
  
  const [activeTab, setActiveTab] = useState<'racks' | 'shelves' | 'boxes'>('racks');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const resetForm = () => {
    setFormData({});
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'racks') {
      addRack(formData);
    } else if (activeTab === 'shelves') {
      addShelf(formData);
    } else if (activeTab === 'boxes') {
      addBox(formData);
    }
    
    resetForm();
  };

  const getItemCount = (shelfId: string, boxId?: string) => {
    return getItemsByLocation(shelfId, boxId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'racks' ? 'default' : 'outline'}
          onClick={() => setActiveTab('racks')}
        >
          <Archive className="h-4 w-4 mr-2" />
          Regały
        </Button>
        <Button
          variant={activeTab === 'shelves' ? 'default' : 'outline'}
          onClick={() => setActiveTab('shelves')}
        >
          <Folder className="h-4 w-4 mr-2" />
          Półki
        </Button>
        <Button
          variant={activeTab === 'boxes' ? 'default' : 'outline'}
          onClick={() => setActiveTab('boxes')}
        >
          <Archive className="h-4 w-4 mr-2" />
          Kartony
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {activeTab === 'racks' && 'Zarządzanie regałami'}
          {activeTab === 'shelves' && 'Zarządzanie półkami'}
          {activeTab === 'boxes' && 'Zarządzanie kartonami'}
        </h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Dodaj
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              Dodaj nowy {activeTab === 'racks' ? 'regał' : activeTab === 'shelves' ? 'półkę' : 'karton'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'racks' && (
                <>
                  <div>
                    <Label htmlFor="number">Numer regału *</Label>
                    <Input
                      id="number"
                      type="number"
                      value={formData.number || ''}
                      onChange={(e) => setFormData({...formData, number: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Nazwa regału *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Opis</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </>
              )}

              {activeTab === 'shelves' && (
                <>
                  <div>
                    <Label>Regał *</Label>
                    <Select onValueChange={(value) => setFormData({...formData, rackId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz regał" />
                      </SelectTrigger>
                      <SelectContent>
                        {racks.map((rack) => (
                          <SelectItem key={rack.id} value={rack.id}>
                            {rack.name} (#{rack.number})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="number">Numer półki *</Label>
                    <Input
                      id="number"
                      type="number"
                      value={formData.number || ''}
                      onChange={(e) => setFormData({...formData, number: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Opis</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </>
              )}

              {activeTab === 'boxes' && (
                <>
                  <div>
                    <Label>Półka *</Label>
                    <Select onValueChange={(value) => setFormData({...formData, shelfId: value})}>
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
                  <div>
                    <Label htmlFor="number">Numer kartonu *</Label>
                    <Input
                      id="number"
                      type="number"
                      value={formData.number || ''}
                      onChange={(e) => setFormData({...formData, number: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Nazwa kartonu *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Opis</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Kolor</Label>
                    <Input
                      id="color"
                      value={formData.color || ''}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      placeholder="np. niebieski, czerwony"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button type="submit">Dodaj</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Anuluj
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {activeTab === 'racks' && racks.map((rack) => {
          const shelvesCount = shelves.filter(s => s.rackId === rack.id).length;
          return (
            <Card key={rack.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{rack.name} #{rack.number}</h3>
                    <p className="text-sm text-gray-600">{rack.description}</p>
                    <Badge variant="outline" className="mt-1">
                      {shelvesCount} półek
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteRack(rack.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {activeTab === 'shelves' && shelves.map((shelf) => {
          const rack = racks.find(r => r.id === shelf.rackId);
          const itemsCount = getItemCount(shelf.id);
          return (
            <Card key={shelf.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {rack?.name} {rack?.number} - Półka {shelf.number}
                    </h3>
                    <p className="text-sm text-gray-600">{shelf.description}</p>
                    <Badge variant="outline" className="mt-1">
                      {itemsCount} przedmiotów
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteShelf(shelf.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {activeTab === 'boxes' && boxes.map((box) => {
          const shelf = shelves.find(s => s.id === box.shelfId);
          const rack = shelf ? racks.find(r => r.id === shelf.rackId) : null;
          const itemsCount = getItemCount(box.shelfId, box.id);
          return (
            <Card key={box.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{box.name} #{box.number}</h3>
                    <p className="text-sm text-gray-600">
                      {rack?.name} {rack?.number} - Półka {shelf?.number}
                    </p>
                    <p className="text-sm text-gray-600">{box.description}</p>
                    {box.color && (
                      <Badge variant="outline" className="mt-1 mr-1">
                        {box.color}
                      </Badge>
                    )}
                    <Badge variant="outline" className="mt-1">
                      {itemsCount} przedmiotów
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteBox(box.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
