import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LogOut, ShieldAlert } from "lucide-react";

const TechnicianDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-soft">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-16 w-16 text-warning" />
          </div>
          <CardTitle className="text-2xl">Acceso No Autorizado</CardTitle>
          <CardDescription className="text-base mt-2">
            Usted no está autorizado para acceder al módulo de asignación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-medium">Restricción de Acceso</p>
                <p className="text-sm text-muted-foreground">
                  Solo los supervisores y administradores pueden acceder a este módulo. 
                  Los técnicos no tienen permisos para realizar asignaciones de órdenes de servicio.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Si cree que esto es un error, por favor contacte con su supervisor.
            </p>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianDashboard;
