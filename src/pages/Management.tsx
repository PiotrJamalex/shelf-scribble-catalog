
import { LocationManager } from '@/components/LocationManager';

export function Management() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Zarządzanie lokalizacjami</h1>
      <LocationManager />
    </div>
  );
}
