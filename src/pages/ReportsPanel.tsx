import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { apiService, Technician, WorkOrder, SavedReport } from "@/lib/api";
import { 
  ArrowLeft, 
  Download, 
  BarChart3, 
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  MapPin,
  Award,
  Save,
  History,
  Trash2,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface TechnicianMetrics {
  technicianId: string;
  technicianName: string;
  zone: string;
  specialty: string;
  totalOrders: number;
  avgResolutionTime: number;
  completedOrders: number;
  inProgressOrders: number;
}

interface ReportFilter {
  startDate: string;
  endDate: string;
  serviceType: string;
  zone: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

const ReportsPanel = () => {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [metrics, setMetrics] = useState<TechnicianMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilter>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    serviceType: 'all',
    zone: 'all',
  });
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [reportName, setReportName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
    loadReportHistory();
  }, []);

  useEffect(() => {
    if (technicians.length > 0 && workOrders.length > 0) {
      calculateMetrics();
    }
  }, [technicians, workOrders, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [techData, ordersData] = await Promise.all([
        apiService.getTechnicians(),
        apiService.getWorkOrders(),
      ]);
      setTechnicians(techData);
      setWorkOrders(ordersData);
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos del reporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const filteredOrders = workOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      const matchesDate = orderDate >= startDate && orderDate <= endDate;
      const matchesServiceType = filters.serviceType === 'all' || order.specialty === filters.serviceType;
      const matchesZone = filters.zone === 'all' || order.zone === filters.zone;
      
      return matchesDate && matchesServiceType && matchesZone && order.assignedTechnicianId;
    });

    const techMetrics = technicians.map(tech => {
      const techOrders = filteredOrders.filter(o => o.assignedTechnicianId === tech.id);
      const completedOrders = techOrders.filter(o => o.status === 'completed');
      const inProgressOrders = techOrders.filter(o => o.status === 'in_progress');
      
      // Calcular tiempo promedio de resolución (simulado en días)
      const avgResolutionTime = completedOrders.length > 0
        ? Math.floor(Math.random() * 5) + 1 // Simulación temporal
        : 0;

      return {
        technicianId: tech.id || '',
        technicianName: tech.name || '',
        zone: tech.zone || '',
        specialty: tech.specialty || '',
        totalOrders: techOrders.length,
        avgResolutionTime,
        completedOrders: completedOrders.length,
        inProgressOrders: inProgressOrders.length,
      };
    }).filter(m => m.totalOrders > 0);

    setMetrics(techMetrics);
  };

  const loadReportHistory = async () => {
    try {
      const { reports } = await apiService.getReportHistory(1, 100);
      setSavedReports(reports);
    } catch (error) {
      console.error('Error loading report history:', error);
    }
  };

  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingrese un nombre para el reporte",
        variant: "destructive",
      });
      return;
    }

    try {
      const summary = {
        totalOrders: metrics.reduce((sum, m) => sum + m.totalOrders, 0),
        totalCompleted: metrics.reduce((sum, m) => sum + m.completedOrders, 0),
        totalInProgress: metrics.reduce((sum, m) => sum + m.inProgressOrders, 0),
        avgResolutionTime: metrics.length > 0 
          ? parseFloat((metrics.reduce((sum, m) => sum + m.avgResolutionTime, 0) / metrics.length).toFixed(1))
          : 0,
      };

      await apiService.saveReport({
        reportName,
        filters,
        metrics,
        summary,
      });

      toast({
        title: "Reporte guardado",
        description: "El reporte ha sido guardado exitosamente",
      });

      setReportName('');
      setSaveDialogOpen(false);
      loadReportHistory();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el reporte",
        variant: "destructive",
      });
    }
  };

  const handleViewReport = async (reportId: string) => {
    try {
      const report = await apiService.getReportDetail(reportId);
      setSelectedReport(report);
      setViewDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el reporte",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await apiService.deleteReport(reportId);
      toast({
        title: "Reporte eliminado",
        description: "El reporte ha sido eliminado exitosamente",
      });
      loadReportHistory();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el reporte",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = () => {
    const headers = ['Técnico', 'Zona', 'Especialidad', 'Órdenes Totales', 'Completadas', 'En Progreso', 'Tiempo Promedio (días)'];
    const rows = metrics.map(m => [
      m.technicianName,
      m.zone,
      m.specialty,
      m.totalOrders,
      m.completedOrders,
      m.inProgressOrders,
      m.avgResolutionTime
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_tecnicos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Reporte exportado",
      description: "El reporte ha sido descargado en formato CSV.",
    });
  };

  const zones = Array.from(new Set(technicians.map(t => t.zone)));
  const specialties = Array.from(new Set(technicians.map(t => t.specialty)));

  // Datos para gráficos
  const ordersByTechChart = metrics.slice(0, 10).map(m => ({
    name: m.technicianName.split(' ')[0],
    ordenes: m.totalOrders,
  }));

  const ordersByZoneChart = zones.map(zone => ({
    name: zone,
    value: metrics.filter(m => m.zone === zone).reduce((sum, m) => sum + m.totalOrders, 0),
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Panel de Reportes</h1>
            <p className="text-sm text-muted-foreground">Análisis y métricas de rendimiento</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="current">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reporte Actual
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6 mt-6">
        {/* Filtros */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Reporte
            </CardTitle>
            <CardDescription>Personaliza el periodo y criterios del reporte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha Inicio
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha Fin
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Tipo de Servicio</Label>
                <Select value={filters.serviceType} onValueChange={(v) => setFilters({ ...filters, serviceType: v })}>
                  <SelectTrigger id="serviceType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {specialties.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone">Zona</Label>
                <Select value={filters.zone} onValueChange={(v) => setFilters({ ...filters, zone: v })}>
                  <SelectTrigger id="zone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {zones.map(zone => (
                      <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <Button onClick={handleExportExcel} variant="outline" className="flex-1 md:flex-none">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 md:flex-none">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Reporte
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guardar Reporte</DialogTitle>
                    <DialogDescription>
                      Ingrese un nombre para identificar este reporte en el historial
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportName">Nombre del Reporte</Label>
                      <Input
                        id="reportName"
                        placeholder="Ej: Reporte Mensual Enero 2024"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveReport}>
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Órdenes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {metrics.reduce((sum, m) => sum + m.totalOrders, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {metrics.reduce((sum, m) => sum + m.completedOrders, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {metrics.reduce((sum, m) => sum + m.inProgressOrders, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tiempo Prom. (días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {metrics.length > 0 
                  ? (metrics.reduce((sum, m) => sum + m.avgResolutionTime, 0) / metrics.length).toFixed(1)
                  : 0
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Órdenes por Técnico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersByTechChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ordenes" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Distribución por Zona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ordersByZoneChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {ordersByZoneChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Métricas Detalladas */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Métricas Detalladas por Técnico</CardTitle>
            <CardDescription>Desempeño individual de cada técnico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Técnico</TableHead>
                    <TableHead>
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Zona
                    </TableHead>
                    <TableHead>
                      <Award className="h-4 w-4 inline mr-1" />
                      Especialidad
                    </TableHead>
                    <TableHead className="text-center">Total Órdenes</TableHead>
                    <TableHead className="text-center">Completadas</TableHead>
                    <TableHead className="text-center">En Progreso</TableHead>
                    <TableHead className="text-center">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Tiempo Prom.
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No hay datos para el periodo seleccionado
                      </TableCell>
                    </TableRow>
                  ) : (
                    metrics.map((metric) => (
                      <TableRow key={metric.technicianId}>
                        <TableCell className="font-medium">{metric.technicianName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{metric.zone}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{metric.specialty}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{metric.totalOrders}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-success font-medium">{metric.completedOrders}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-warning font-medium">{metric.inProgressOrders}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.avgResolutionTime} días
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Reportes Guardados
                </CardTitle>
                <CardDescription>
                  Consulta y descarga reportes generados anteriormente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre del Reporte</TableHead>
                        <TableHead>Periodo</TableHead>
                        <TableHead className="text-center">Total Órdenes</TableHead>
                        <TableHead className="text-center">Completadas</TableHead>
                        <TableHead>Fecha Creación</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedReports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No hay reportes guardados
                          </TableCell>
                        </TableRow>
                      ) : (
                        savedReports.map((report) => (
                          <TableRow key={report.reportId}>
                            <TableCell className="font-medium">{report.reportName}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(report.filters.startDate).toLocaleDateString()} - {new Date(report.filters.endDate).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-semibold">
                              {report.summary.totalOrders}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-success font-medium">
                                {report.summary.totalCompleted}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(report.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {report.createdByName}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewReport(report.reportId)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteReport(report.reportId)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog para ver detalle de reporte */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedReport?.reportName}</DialogTitle>
              <DialogDescription>
                Detalle del reporte generado el {selectedReport && new Date(selectedReport.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Órdenes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {selectedReport.summary.totalOrders}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Completadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-success">
                        {selectedReport.summary.totalCompleted}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        En Progreso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-warning">
                        {selectedReport.summary.totalInProgress}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Tiempo Prom.
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-accent">
                        {selectedReport.summary.avgResolutionTime} días
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Técnico</TableHead>
                        <TableHead>Zona</TableHead>
                        <TableHead>Especialidad</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Completadas</TableHead>
                        <TableHead className="text-center">En Progreso</TableHead>
                        <TableHead className="text-center">Tiempo Prom.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedReport.metrics.map((metric) => (
                        <TableRow key={metric.technicianId}>
                          <TableCell className="font-medium">{metric.technicianName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{metric.zone}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{metric.specialty}</Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold">{metric.totalOrders}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-success font-medium">{metric.completedOrders}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-warning font-medium">{metric.inProgressOrders}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            {metric.avgResolutionTime} días
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ReportsPanel;
