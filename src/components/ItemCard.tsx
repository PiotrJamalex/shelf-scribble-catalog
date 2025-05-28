
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin } from 'lucide-react';
import { InventoryItem } from '@/types/inventory';
import { useInventoryStore } from '@/stores/inventoryStore';

interface ItemCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
}

export function ItemCard({ item, onEdit }: ItemCardProps) {
  const { deleteItem, getShelfLocation } = useInventoryStore();
  const location = getShelfLocation(item.location.shelfId);

  const handleDelete = () => {
    if (confirm('Czy na pewno chcesz usunąć ten przedmiot?')) {
      deleteItem(item.id);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{item.name}</CardTitle>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-3 w-3 mr-1" />
          {location}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {item.images.length > 0 && (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-32 object-cover rounded-md mb-2"
          />
        )}
        
        <p className="text-sm text-gray-700 line-clamp-3 mb-2">
          {item.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edytuj
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
