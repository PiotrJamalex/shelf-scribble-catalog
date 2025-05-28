
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  images: string[];
  location: ItemLocation;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemLocation {
  shelfId: string;
  boxId: string | undefined;
  binderId: string | undefined;
  containerId: string | undefined;
}

export interface Shelf {
  id: string;
  rackId: string;
  number: number;
  description?: string;
}

export interface Rack {
  id: string;
  number: number;
  name: string;
  description?: string;
  shelves: Shelf[];
}

export interface Box {
  id: string;
  shelfId: string;
  number: number;
  name: string;
  description?: string;
  color?: string;
}

export interface Binder {
  id: string;
  shelfId: string;
  number: number;
  name: string;
  description?: string;
  color?: string;
}

export interface Container {
  id: string;
  shelfId: string;
  number: number;
  name: string;
  description?: string;
  type: string;
  color?: string;
}
