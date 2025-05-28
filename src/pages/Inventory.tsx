import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ItemForm } from '@/components/ItemForm';
import { ItemCard } from '@/components/ItemCard';
import { SearchBar } from '@/components/SearchBar';
import { InventoryFilters } from '@/components/InventoryFilters';
import { useInventoryStore } from '@/stores/inventoryStore';
import { Download, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Inventory() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const { items, categories, locations } = useInventoryStore();
  const { toast } = useToast();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesLocation = !selectedLocation || item.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleDownload = () => {
    // Create a downloadable version of the app
    const appData = {
      items,
      categories,
      locations,
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
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Dodaj przedmiot
          </Button>
        </div>
      </div>

      {/* Karta z informacjami o systemie */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Download className="h-5 w-5" />
            System Inwentaryzacji - Gotowy do pobrania
          </CardTitle>
          <CardDescription className="text-blue-600">
            Twój system inwentaryzacji jest w pełni funkcjonalny i można go pobrać jako kopię zapasową
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 mb-3">
            Aktualnie masz <strong>{items.length}</strong> przedmiotów w {categories.length} kategoriach
          </p>
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Pobierz kopię zapasową
          </Button>
        </CardContent>
      </Card>

      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <InventoryFilters
        categories={categories}
        locations={locations}
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
        onCategoryChange={setSelectedCategory}
        onLocationChange={setSelectedLocation}
      />

      
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
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
        open={showForm} 
        onOpenChange={setShowForm}
      />
    </div>
  );
}
