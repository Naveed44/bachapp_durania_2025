import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AlertCircle, TrendingUp, Calendar, MapPin, Smile, Meh, Frown } from 'lucide-react';
import { IncidentsMap } from './IncidentsMap';
import type { IncidentReport } from '../App';

interface DashboardProps {
  reports: IncidentReport[];
}

export function Dashboard({ reports }: DashboardProps) {
  // Calculate statistics
  const totalReports = reports.length;
  const highSeverity = reports.filter(r => r.priority === 'high').length;
  const mediumSeverity = reports.filter(r => r.priority === 'medium').length;
  const lowSeverity = reports.filter(r => r.priority === 'low').length;

  // Prepare data for severity pie chart
  const severityData = [
    { name: 'Alta', value: highSeverity, color: '#ef4444' },
    { name: 'Media', value: mediumSeverity, color: '#eab308' },
    { name: 'Baja', value: lowSeverity, color: '#22c55e' },
  ].filter(item => item.value > 0);

  // Prepare data for timeline chart (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  };

  const timelineData = getLast7Days().map(date => {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayReports = reports.filter(report => {
      const reportDate = new Date(report.timestamp);
      return reportDate >= date && reportDate < nextDay;
    });

    return {
      date: dateStr,
      high: dayReports.filter(r => r.priority === 'high').length,
      medium: dayReports.filter(r => r.priority === 'medium').length,
      low: dayReports.filter(r => r.priority === 'low').length,
      total: dayReports.length,
    };
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const recentReports = reports.slice(0, 5);

  return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total de Reportes</p>
                  <p className="text-indigo-600 mt-1">{totalReports}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Gravedad Alta</p>
                  <p className="text-red-600 mt-1">{highSeverity}</p>
                </div>
                <Frown className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Gravedad Media</p>
                  <p className="text-yellow-600 mt-1">{mediumSeverity}</p>
                </div>
                <Meh className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Gravedad Baja</p>
                  <p className="text-green-600 mt-1">{lowSeverity}</p>
                </div>
                <Smile className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incidents Map */}
        <Card>
          <CardHeader>
            <CardTitle>Mapa de Incidentes</CardTitle>
            <CardDescription>Distribución geográfica de todos los incidentes reportados</CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentsMap reports={reports} />
          </CardContent>
        </Card>

        {/* Charts Row */}
        {totalReports > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Severity Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Gravedad</CardTitle>
                  <CardDescription>Desglose de incidentes por nivel de gravedad</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                          data={severityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                      >
                        {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Timeline Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de Últimos 7 Días</CardTitle>
                  <CardDescription>Reportes diarios de incidentes por gravedad</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={timelineData}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="high" stackId="a" fill="#ef4444" name="Alta" />
                      <Bar dataKey="medium" stackId="a" fill="#eab308" name="Media" />
                      <Bar dataKey="low" stackId="a" fill="#22c55e" name="Baja" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
        ) : null}

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Incidentes Recientes</CardTitle>
            <CardDescription>Últimos reportes de incidentes enviados</CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aún no se han reportado incidentes</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Envíe su primer reporte de incidente para verlo aquí
                  </p>
                </div>
            ) : (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                      <div
                          key={report.id}
                          className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        {/* Photo Thumbnail */}
                        <div className="flex-shrink-0">
                          {report.photos.length > 0 ? (
                              <img
                                  src={report.photos[0]}
                                  alt="Miniatura del incidente"
                                  className="w-16 h-16 rounded-lg object-cover"
                              />
                          ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-gray-400" />
                              </div>
                          )}
                        </div>

                        {/* Report Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge className={getPriorityColor(report.priority)}>
                              {report.priority === 'high' ? 'ALTA' : report.priority === 'medium' ? 'MEDIA' : 'BAJA'}
                            </Badge>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(report.timestamp)}
                      </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{report.location}</span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {report.description}
                          </p>
                          {report.photos.length > 1 && (
                              <p className="text-xs text-gray-500 mt-1">
                                +{report.photos.length - 1} foto{report.photos.length - 1 !== 1 ? 's' : ''} más
                              </p>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}