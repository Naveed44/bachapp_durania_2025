import { useState } from 'react';
import { IncidentReportForm } from './components/IncidentReportForm';
import { ReportsList } from './components/ReportsList';
import { Dashboard } from './components/Dashboard';
import { AlertCircle, LayoutDashboard, FileText, List, Menu } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from './components/ui/sidebar';
import { Separator } from './components/ui/separator';

export interface IncidentReport {
  id: string;
  location: string;
  description: string;
  priority: string;
  photos: string[];
  timestamp: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export default function App() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'report' | 'reports'>('dashboard');

  const handleSubmitReport = (report: Omit<IncidentReport, 'id' | 'timestamp'>) => {
    const newReport: IncidentReport = {
      ...report,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setReports([newReport, ...reports]);
  };

  return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border">
              <div className="flex items-center gap-2 px-2 py-3">
                <AlertCircle className="w-6 h-6 text-indigo-600" />
                <div className="flex flex-col">
                  <span className="text-indigo-900">Reportador de Incidentes</span>
                  <span className="text-xs text-gray-500">Reportes móviles</span>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      isActive={activeView === 'dashboard'}
                      onClick={() => setActiveView('dashboard')}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Panel de Control</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                      isActive={activeView === 'report'}
                      onClick={() => setActiveView('report')}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Reportar Incidente</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                      isActive={activeView === 'reports'}
                      onClick={() => setActiveView('reports')}
                  >
                    <List className="w-4 h-4" />
                    <span>Ver Reportes</span>
                    <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {reports.length}
                  </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            <div className="flex flex-col min-h-screen">
              {/* Header with Sidebar Toggle */}
              <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-indigo-600" />
                  <h1 className="text-indigo-900">
                    {activeView === 'dashboard' && 'Panel de Control'}
                    {activeView === 'report' && 'Reportar Incidente'}
                    {activeView === 'reports' && 'Ver Reportes'}
                  </h1>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
                <div className="mx-auto max-w-6xl">
                  {activeView === 'dashboard' && <Dashboard reports={reports} />}
                  {activeView === 'report' && <IncidentReportForm onSubmit={handleSubmitReport} />}
                  {activeView === 'reports' && <ReportsList reports={reports} />}
                </div>
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
  );
}