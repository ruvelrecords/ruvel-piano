import { StudentGuard } from '@/components/layout/AuthGuard';
import { AppProvider } from '@/contexts/AppContext';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentGuard>
      <AppProvider>
        <div className="min-h-screen bg-[#0a0a0a]">
          {children}
        </div>
      </AppProvider>
    </StudentGuard>
  );
}
