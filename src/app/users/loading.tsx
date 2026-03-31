import { Loader2 } from 'lucide-react';
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin" style={{ color: 'hsl(38 92% 58%)' }} />
    </div>
  );
}
