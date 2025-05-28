
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { useInventoryStore } from '@/stores/inventoryStore';

interface InventoryFiltersProps {
  onFiltersChange: (filters: InventoryFilters) => void;
}

export interface InventoryFilters {
  rackId?: string;
  shelfId?: string;
  boxId?: string;
  binderId?: string;
  containerId?: string;
}

export function InventoryFilters({ onFiltersChange }: InventoryFiltersProps) {
  const { racks, shelves, boxes, binders, containers } = useInventoryStore();
  const [filters, setFilters] = useState<InventoryFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof InventoryFilters, value: string | undefined) => {
    const newFilters = { ...filters };
    
    if (value === 'all' || !value) {
      delete newFilters[key];
      // Clear dependent filters
      if (key === 'rackId') {
        delete newFilters.shelfId;
        delete newFilters.boxId;
        delete newFilters.binderId;
        delete newFilters.containerId;
      } else if (key === 'shelfId') {
        delete newFilters.boxId;
        delete newFilters.binderId;
        delete newFilters.containerId;
      }
    } else {
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const filteredShelves = filters.rackId 
    ? shelves.filter(s => s.rackId === filters.rackId)
    : shelves;

  const filteredBoxes = filters.shelfId
    ? boxes.filter(b => b.shelfId === filters.shelfId)
    : boxes;

  const filteredBinders = filters.shelfId
    ? binders.filter(b => b.shelfId === filters.shelfId)
    : binders;

  const filteredContainers = filters.shelfId
    ? containers.filter(c => c.shelfId === filters.shelfId)
    : containers;

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtry
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-3 w-3 mr-1" />
            Wyczyść filtry
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="text-sm font-medium">Regał</label>
            <Select
              value={filters.rackId || 'all'}
              onValueChange={(value) => updateFilter('rackId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie regały" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie regały</SelectItem>
                {racks.map((rack) => (
                  <SelectItem key={rack.id} value={rack.id}>
                    {rack.name} #{rack.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Półka</label>
            <Select
              value={filters.shelfId || 'all'}
              onValueChange={(value) => updateFilter('shelfId', value)}
              disabled={!filters.rackId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie półki" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie półki</SelectItem>
                {filteredShelves.map((shelf) => (
                  <SelectItem key={shelf.id} value={shelf.id}>
                    Półka {shelf.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Karton</label>
            <Select
              value={filters.boxId || 'all'}
              onValueChange={(value) => updateFilter('boxId', value)}
              disabled={!filters.shelfId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie kartony" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie kartony</SelectItem>
                {filteredBoxes.map((box) => (
                  <SelectItem key={box.id} value={box.id}>
                    {box.name} #{box.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Segregator</label>
            <Select
              value={filters.binderId || 'all'}
              onValueChange={(value) => updateFilter('binderId', value)}
              disabled={!filters.shelfId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie segregatory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie segregatory</SelectItem>
                {filteredBinders.map((binder) => (
                  <SelectItem key={binder.id} value={binder.id}>
                    {binder.name} #{binder.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Inne opakowanie</label>
            <Select
              value={filters.containerId || 'all'}
              onValueChange={(value) => updateFilter('containerId', value)}
              disabled={!filters.shelfId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie opakowania" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie opakowania</SelectItem>
                {filteredContainers.map((container) => (
                  <SelectItem key={container.id} value={container.id}>
                    {container.name} - {container.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
