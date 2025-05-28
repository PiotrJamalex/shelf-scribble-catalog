
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InventoryItem, Rack, Shelf, Box, Binder, Container } from '@/types/inventory';

interface InventoryStore {
  items: InventoryItem[];
  racks: Rack[];
  shelves: Shelf[];
  boxes: Box[];
  binders: Binder[];
  containers: Container[];
  
  // Akcje dla przedmiotów
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  searchItems: (query: string) => InventoryItem[];
  
  // Akcje dla regałów
  addRack: (rack: Omit<Rack, 'id' | 'shelves'>) => void;
  updateRack: (id: string, updates: Partial<Rack>) => void;
  deleteRack: (id: string) => void;
  
  // Akcje dla półek
  addShelf: (shelf: Omit<Shelf, 'id'>) => void;
  updateShelf: (id: string, updates: Partial<Shelf>) => void;
  deleteShelf: (id: string) => void;
  
  // Akcje dla kartonów
  addBox: (box: Omit<Box, 'id'>) => void;
  updateBox: (id: string, updates: Partial<Box>) => void;
  deleteBox: (id: string) => void;
  
  // Akcje dla segregatorów
  addBinder: (binder: Omit<Binder, 'id'>) => void;
  updateBinder: (id: string, updates: Partial<Binder>) => void;
  deleteBinder: (id: string) => void;
  
  // Akcje dla innych opakowań
  addContainer: (container: Omit<Container, 'id'>) => void;
  updateContainer: (id: string, updates: Partial<Container>) => void;
  deleteContainer: (id: string) => void;
  
  // Funkcje pomocnicze
  getItemsByLocation: (shelfId: string, boxId?: string, binderId?: string, containerId?: string) => InventoryItem[];
  getShelfLocation: (shelfId: string) => string;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: [],
      racks: [],
      shelves: [],
      boxes: [],
      binders: [],
      containers: [],

      addItem: (itemData) => {
        const newItem: InventoryItem = {
          ...itemData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: new Date() }
              : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      searchItems: (query) => {
        const { items, shelves, racks, boxes, binders, containers } = get();
        const lowerQuery = query.toLowerCase();
        
        return items.filter((item) => {
          const matchesName = item.name.toLowerCase().includes(lowerQuery);
          const matchesDescription = item.description.toLowerCase().includes(lowerQuery);
          const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
          
          // Szukaj też po lokalizacji
          const shelf = shelves.find(s => s.id === item.location.shelfId);
          const rack = shelf ? racks.find(r => r.id === shelf.rackId) : null;
          const box = item.location.boxId ? boxes.find(b => b.id === item.location.boxId) : null;
          const binder = item.location.binderId ? binders.find(b => b.id === item.location.binderId) : null;
          const container = item.location.containerId ? containers.find(c => c.id === item.location.containerId) : null;
          
          const locationString = `${rack?.name || ''} ${shelf?.number || ''} ${box?.name || ''} ${binder?.name || ''} ${container?.name || ''}`.toLowerCase();
          const matchesLocation = locationString.includes(lowerQuery);
          
          return matchesName || matchesDescription || matchesTags || matchesLocation;
        });
      },

      addRack: (rackData) => {
        const newRack: Rack = {
          ...rackData,
          id: crypto.randomUUID(),
          shelves: [],
        };
        set((state) => ({ racks: [...state.racks, newRack] }));
      },

      updateRack: (id, updates) => {
        set((state) => ({
          racks: state.racks.map((rack) =>
            rack.id === id ? { ...rack, ...updates } : rack
          ),
        }));
      },

      deleteRack: (id) => {
        set((state) => ({
          racks: state.racks.filter((rack) => rack.id !== id),
          shelves: state.shelves.filter((shelf) => shelf.rackId !== id),
        }));
      },

      addShelf: (shelfData) => {
        const newShelf: Shelf = {
          ...shelfData,
          id: crypto.randomUUID(),
        };
        set((state) => ({ shelves: [...state.shelves, newShelf] }));
      },

      updateShelf: (id, updates) => {
        set((state) => ({
          shelves: state.shelves.map((shelf) =>
            shelf.id === id ? { ...shelf, ...updates } : shelf
          ),
        }));
      },

      deleteShelf: (id) => {
        set((state) => ({
          shelves: state.shelves.filter((shelf) => shelf.id !== id),
          boxes: state.boxes.filter((box) => box.shelfId !== id),
          binders: state.binders.filter((binder) => binder.shelfId !== id),
          containers: state.containers.filter((container) => container.shelfId !== id),
        }));
      },

      addBox: (boxData) => {
        const newBox: Box = {
          ...boxData,
          id: crypto.randomUUID(),
        };
        set((state) => ({ boxes: [...state.boxes, newBox] }));
      },

      updateBox: (id, updates) => {
        set((state) => ({
          boxes: state.boxes.map((box) =>
            box.id === id ? { ...box, ...updates } : box
          ),
        }));
      },

      deleteBox: (id) => {
        set((state) => ({
          boxes: state.boxes.filter((box) => box.id !== id),
        }));
      },

      addBinder: (binderData) => {
        const newBinder: Binder = {
          ...binderData,
          id: crypto.randomUUID(),
        };
        set((state) => ({ binders: [...state.binders, newBinder] }));
      },

      updateBinder: (id, updates) => {
        set((state) => ({
          binders: state.binders.map((binder) =>
            binder.id === id ? { ...binder, ...updates } : binder
          ),
        }));
      },

      deleteBinder: (id) => {
        set((state) => ({
          binders: state.binders.filter((binder) => binder.id !== id),
        }));
      },

      addContainer: (containerData) => {
        const newContainer: Container = {
          ...containerData,
          id: crypto.randomUUID(),
        };
        set((state) => ({ containers: [...state.containers, newContainer] }));
      },

      updateContainer: (id, updates) => {
        set((state) => ({
          containers: state.containers.map((container) =>
            container.id === id ? { ...container, ...updates } : container
          ),
        }));
      },

      deleteContainer: (id) => {
        set((state) => ({
          containers: state.containers.filter((container) => container.id !== id),
        }));
      },

      getItemsByLocation: (shelfId, boxId, binderId, containerId) => {
        const { items } = get();
        return items.filter(
          (item) =>
            item.location.shelfId === shelfId &&
            item.location.boxId === boxId &&
            item.location.binderId === binderId &&
            item.location.containerId === containerId
        );
      },

      getShelfLocation: (shelfId) => {
        const { shelves, racks } = get();
        const shelf = shelves.find((s) => s.id === shelfId);
        if (!shelf) return '';
        
        const rack = racks.find((r) => r.id === shelf.rackId);
        return `${rack?.name || 'Regał'} ${rack?.number || ''} - Półka ${shelf.number}`;
      },
    }),
    {
      name: 'inventory-storage',
    }
  )
);
