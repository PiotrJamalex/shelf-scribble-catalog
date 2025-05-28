
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Archive, Folder, FileText, Package } from 'lucide-react';
import { useInventoryStore } from '@/stores/inventoryStore';
import { Rack, Shelf, Box, Binder, Container } from '@/types/inventory';

export function LocationManager() {
  const { 
    racks, shelves, boxes, binders, containers,
    addRack, addShelf, addBox, addBinder, addContainer,
    updateRack, updateShelf, updateBox, updateBinder, updateContainer,
    deleteRack, deleteShelf, deleteBox, deleteBinder, deleteContainer,
    getItemsByLocation 
  } = useInventoryStore();
  
  const [activeTab, setActiveTab] = useState<'racks' | 'shelves' | 'boxes' | 'binders' | 'containers'>('racks');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const resetForm = () => {
    setFormData({});
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Edycja
      if (activeTab === 'racks') {
        updateRack(editingItem.id, formData);
      } else if (activeTab === 'shelves') {
        updateShelf(editingItem.id, formData);
      } else if (activeTab === 'boxes') {
        updateBox(editingItem.id, formData);
      } else if (activeTab === 'binders') {
        updateBinder(editingItem.id, formData);
      } else if (activeTab === 'containers') {
        updateContainer(editingItem.id, formData);
      }
    } else {
      // Dodawanie
      if (activeTab === 'racks') {
        addRack(formData);
      } else if (activeTab === 'shelves') {
        addShelf(formData);
      } else if (activeTab === 'boxes') {
        addBox(formData);
      } else if (activeTab === 'binders') {
        addBinder(formData);
      } else if (activeTab === 'containers') {
        addContainer(formData);
      }
    }
    
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'racks') {
      deleteRack(id);
    } else if (activeTab === 'shelves') {
      deleteShelf(id);
    } else if (activeTab === 'boxes') {
      deleteBox(id);
    } else if (activeTab === 'binders') {
      deleteBinder(id);
    } else if (activeTab === 'containers') {
      deleteContainer(id);
    }
  };

  const getItemCount = (shelfId: string, boxId?: string, binderId?: string, containerId?: string) => {
    return getItemsByLocation(shelfId, boxId, binderId, containerId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
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
          <Package className="h-4 w-4 mr-2" />
          Kartony
        </Button>
        <Button
          variant={activeTab === 'binders' ? 'default' : 'outline'}
          onClick={() => setActiveTab('binders')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Segregatory
        </Button>
        <Button
          variant={activeTab === 'containers' ? 'default' : 'outline'}
          onClick={() => setActiveTab('containers')}
        >
          <Package className="h-4 w-4 mr-2" />
          Inne opakowania
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {activeTab === 'racks' && 'Zarządzanie regałami'}
          {activeTab === 'shelves' && 'Zarządzanie półkami'}
          {activeTab === 'boxes' && 'Zarządzanie kartonami'}
          {activeTab === 'binders' && 'Zarządzanie segregatorami'}
          {activeTab === 'containers' && 'Zarządzanie innymi opakowaniami'}
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
              {editingItem ? 'Edytuj' : 'Dodaj nowy'} {
                activeTab === 'racks' ? 'regał' : 
                activeTab === 'shelves' ? 'półkę' : 
                activeTab === 'boxes' ? 'karton' :
                activeTab === 'binders' ? 'segregator' :
                'opakowanie'
              }
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
                    <Select 
                      value={formData.rackId || ''} 
                      onValueChange={(value) => setFormData({...formData, rackId: value})}
                    >
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

              {(activeTab === 'boxes' || activeTab === 'binders') && (
                <>
                  <div>
                    <Label>Półka *</Label>
                    <Select 
                      value={formData.shelfId || ''} 
                      onValueChange={(value) => setFormData({...formData, shelfId: value})}
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
                  <div>
                    <Label htmlFor="number">Numer {activeTab === 'boxes' ? 'kartonu' : 'segregatora'} *</Label>
                    <Input
                      id="number"
                      type="number"
                      value={formData.number || ''}
                      onChange={(e) => setFormData({...formData, number: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Nazwa {activeTab === 'boxes' ? 'kartonu' : 'segregatora'} *</Label>
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

              {activeTab === 'containers' && (
                <>
                  <div>
                    <Label>Półka *</Label>
                    <Select 
                      value={formData.shelfId || ''} 
                      onValueChange={(value) => setFormData({...formData, shelfId: value})}
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
                  <div>
                    <Label htmlFor="number">Numer opakowania *</Label>
                    <Input
                      id="number"
                      type="number"
                      value={formData.number || ''}
                      onChange={(e) => setFormData({...formData, number: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Nazwa opakowania *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Typ opakowania *</Label>
                    <Input
                      id="type"
                      value={formData.type || ''}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      placeholder="np. pudełko, worek, teczka"
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
                <Button type="submit">{editingItem ? 'Aktualizuj' : 'Dodaj'}</Button>
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(rack)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(rack.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(shelf)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(shelf.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(box)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(box.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {activeTab === 'binders' && binders.map((binder) => {
          const shelf = shelves.find(s => s.id === binder.shelfId);
          const rack = shelf ? racks.find(r => r.id === shelf.rackId) : null;
          const itemsCount = getItemCount(binder.shelfId, undefined, binder.id);
          return (
            <Card key={binder.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{binder.name} #{binder.number}</h3>
                    <p className="text-sm text-gray-600">
                      {rack?.name} {rack?.number} - Półka {shelf?.number}
                    </p>
                    <p className="text-sm text-gray-600">{binder.description}</p>
                    {binder.color && (
                      <Badge variant="outline" className="mt-1 mr-1">
                        {binder.color}
                      </Badge>
                    )}
                    <Badge variant="outline" className="mt-1">
                      {itemsCount} przedmiotów
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(binder)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(binder.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {activeTab === 'containers' && containers.map((container) => {
          const shelf = shelves.find(s => s.id === container.shelfId);
          const rack = shelf ? racks.find(r => r.id === shelf.rackId) : null;
          const itemsCount = getItemCount(container.shelfId, undefined, undefined, container.id);
          return (
            <Card key={container.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{container.name} - {container.type} #{container.number}</h3>
                    <p className="text-sm text-gray-600">
                      {rack?.name} {rack?.number} - Półka {shelf?.number}
                    </p>
                    <p className="text-sm text-gray-600">{container.description}</p>
                    {container.color && (
                      <Badge variant="outline" className="mt-1 mr-1">
                        {container.color}
                      </Badge>
                    )}
                    <Badge variant="outline" className="mt-1">
                      {itemsCount} przedmiotów
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(container)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(container.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
