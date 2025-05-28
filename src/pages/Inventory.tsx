
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useInventoryStore } from '@/stores/inventoryStore';
import { SearchBar } from '@/components/SearchBar';
import { ItemCard } from '@/components/ItemCard';
import { ItemForm } from '@/components/ItemForm';
import { InventoryItem } from '@/types/inventory';

export function Inventory() {
  const { items, searchItems } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();

  const filteredItems = searchQuery.trim() 
    ? searchItems(searchQuery)
    : items;

  const handleAddNew = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold">Inwentarz</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Dodaj przedmiot
        </Button>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Szukaj po nazwie, opisie, tagach lub lokalizacji..."
      />

      <div className="text-sm text-gray-600">
        Znaleziono: {filteredItems.length} z {items.length} przedmiotów
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery.trim() 
              ? 'Nie znaleziono przedmiotów spełniających kryteria wyszukiwania'
              : 'Brak przedmiotów w inwentarzu'
            }
          </p>
          {!searchQuery.trim() && (
            <Button onClick={handleAddNew} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj pierwszy przedmiot
            </Button>
          )}
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
