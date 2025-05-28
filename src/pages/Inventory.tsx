
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ItemForm } from '@/components/ItemForm';
import { ItemCard } from '@/components/ItemCard';
import { SearchBar } from '@/components/SearchBar';
import { InventoryFilters, InventoryFilters as FilterType } from '@/components/InventoryFilters';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { useInventoryStore } from '@/stores/inventoryStore';
import { Download, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem } from '@/types/inventory';

export function Inventory() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterType>({});
  const { items, racks, shelves, boxes, binders, containers } = useInventoryStore();
  const { toast } = useToast();

  const filteredItems = items.filter(item => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Location filters
    let matchesFilters = true;
    
    if (filters.rackId) {
      const shelf = shelves.find(s => s.id === item.location.shelfId);
      matchesFilters = matchesFilters && shelf?.rackId === filters.rackId;
    }
    
    if (filters.shelfId) {
      matchesFilters = matchesFilters && item.location.shelfId === filters.shelfId;
    }
    
    if (filters.boxId) {
      matchesFilters = matchesFilters && item.location.boxId === filters.boxId;
    }
    
    if (filters.binderId) {
      matchesFilters = matchesFilters && item.location.binderId === filters.binderId;
    }
    
    if (filters.containerId) {
      matchesFilters = matchesFilters && item.location.containerId === filters.containerId;
    }
    
    return matchesSearch && matchesFilters;
  });

  const handleDownload = () => {
    // Create a downloadable version of the app
    const appData = {
      items,
      racks,
      shelves,
      boxes,
      binders,
      containers,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-inwentaryzacji-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Pobieranie zakończone",
      description: "Kopia zapasowa systemu została pobrana",
    });
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inwentarz</h1>
          <p className="text-gray-600 mt-1">Zarządzaj swoimi rzeczami, książkami i dokumentami</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Pobierz system
          </Button>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Dodaj przedmiot
          </Button>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Karta z informacjami o systemie */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Download className="h-5 w-5" />
            System Inwentaryzacji - PWA Ready
          </CardTitle>
          <CardDescription className="text-blue-600">
            Aplikacja jest teraz dostępna jako PWA - można ją zainstalować na pulpicie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 mb-3">
            Aktualnie masz <strong>{items.length}</strong> przedmiotów w {racks.length} regałach
          </p>
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Pobierz kopię zapasową
          </Button>
        </CardContent>
      </Card>

      <SearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
      />

      <InventoryFilters
        onFiltersChange={setFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} onEdit={handleEditItem} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {items.length === 0 
              ? 'Brak przedmiotów w inwentarzu. Dodaj pierwszy przedmiot!'
              : 'Nie znaleziono przedmiotów spełniających kryteria wyszukiwania.'
            }
          </p>
        </div>
      )}

      <ItemForm 
        isOpen={showForm} 
        onClose={handleCloseForm}
        item={editingItem}
      />
    </div>
  );
}
