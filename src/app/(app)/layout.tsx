import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import { AppProvider } from '@/contexts/AppContext';
import { TeacherGuard } from '@/components/layout/AuthGuard';
import QuickNote from '@/components/ui/QuickNote';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeacherGuard>
      <AppProvider>
        <div className="min-h-screen bg-[#0a0a0a]">
          <Sidebar />
          <BottomNav />
          <main className="md:ml-[240px] pb-20 md:pb-0">
            <div className="page-transition">
              {children}
            </div>
          </main>
          <QuickNote />
        </div>
      </AppProvider>
    </TeacherGuard>
  );
}
