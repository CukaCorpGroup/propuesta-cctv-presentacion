import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cctv_proposal_data';

// Interfaces
export interface InfraestructuraItem {
  id: number;
  item: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface CotizacionItem {
  id: number;
  categoria: string;
  componente: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  icono: string;
}

export interface UbicacionItem {
  id: number;
  ubicacion: string;
  icono: string;
  conexionSwitch: string;
  estado: string;
  camarasAnalogicas: number;
  camarasIP: number;
}

export interface EquipoItem {
  id: number;
  item: string;
  cantidad: number;
  capacidad: string;
}

export interface OpcionData {
  id: string;
  nombre: string;
  inversion: number;
  equipos: EquipoItem[];
  especificaciones: {
    escalabilidadMaxima: number;
    almacenamientoTotal: number;
    diasGrabacion: number;
    compatibilidad: string;
    inteligenciaArtificial?: boolean;
  };
  recomendada?: boolean;
  capacidadesIA?: string[];
}

export interface ComparativaItem {
  id: number;
  caracteristica: string;
  escalable: string;
  focalizada: string;
  premium: string;
}

export interface BeneficioItem {
  id: number;
  beneficio: string;
  impacto: string;
  ahorro: number;
  descripcion: string;
}

export interface ROIItem {
  id: number;
  concepto: string;
  ahorroAnual: number;
  descripcion: string;
}

export interface ControlAccesoItem {
  id: number;
  categoria: string;
  componente: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  icono: string;
}

export interface KitDesgloseItem {
  id: number;
  componente: string;
  descripcion: string;
  cantidad: number;
}

export interface NotaItem {
  id: number;
  titulo: string;
  contenido: string;
}

export interface CCTVData {
  situacionActual: {
    infraestructura: InfraestructuraItem[];
    caracteristicas: {
      resolucion: string;
      tiempoGrabacion: number;
    };
  };
  cotizacion: {
    items: CotizacionItem[];
    ivaRate: number;
    categoriaColores: Record<string, string>;
  };
  ubicaciones: UbicacionItem[];
  opciones: {
    escalable: OpcionData;
    focalizada: OpcionData;
    premium: OpcionData;
  };
  comparativa: ComparativaItem[];
  beneficios: BeneficioItem[];
  roi: ROIItem[];
  controlAcceso: {
    items: ControlAccesoItem[];
    kitDesglose: KitDesgloseItem[];
    notas: NotaItem[];
    ivaRate: number;
    categoriaColores: Record<string, string>;
  };
}

// Load initial data from JSON
import initialData from '../data/cctvData.json';

// Merge function to ensure all required fields exist
const mergeWithDefaults = (saved: any): CCTVData => {
  return {
    situacionActual: saved.situacionActual || initialData.situacionActual,
    cotizacion: {
      items: (initialData as any).cotizacion?.items || [], // Always use JSON data (with fresh URLs and descriptions)
      notas: (initialData as any).cotizacion?.notas || [], // Always use JSON data (not editable)
      ivaRate: saved.cotizacion?.ivaRate ?? initialData.cotizacion.ivaRate,
      categoriaColores: (initialData as any).cotizacion?.categoriaColores || initialData.cotizacion.categoriaColores,
    },
    ubicaciones: saved.ubicaciones || initialData.ubicaciones,
    opciones: saved.opciones || initialData.opciones,
    comparativa: saved.comparativa || initialData.comparativa,
    beneficios: saved.beneficios || initialData.beneficios,
    roi: saved.roi || initialData.roi,
    controlAcceso: {
      items: saved.controlAcceso?.items || (initialData as any).controlAcceso?.items || [],
      kitDesglose: (initialData as any).controlAcceso?.kitDesglose || [], // Always use JSON data (not editable)
      notas: (initialData as any).controlAcceso?.notas || [], // Always use JSON data (not editable)
      ivaRate: saved.controlAcceso?.ivaRate ?? (initialData as any).controlAcceso?.ivaRate ?? 0.15,
      categoriaColores: saved.controlAcceso?.categoriaColores || (initialData as any).controlAcceso?.categoriaColores || {},
    },
  };
};

export function useCCTVData() {
  const [data, setData] = useState<CCTVData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return mergeWithDefaults(parsed);
      } catch {
        return initialData as CCTVData;
      }
    }
    return initialData as CCTVData;
  });

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLastUpdated(new Date());
    setHasUnsavedChanges(true);
  }, [data]);

  // Explicit save function with confirmation
  const saveData = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
    return true;
  }, [data]);

  // Update infraestructura
  const updateInfraestructura = useCallback((newData: InfraestructuraItem[]) => {
    setData(prev => ({
      ...prev,
      situacionActual: {
        ...prev.situacionActual,
        infraestructura: newData
      }
    }));
  }, []);

  // Update cotización items
  const updateCotizacion = useCallback((newItems: CotizacionItem[]) => {
    const updatedItems = newItems.map(item => ({
      ...item,
      total: item.cantidad * item.precioUnitario
    }));
    setData(prev => ({
      ...prev,
      cotizacion: {
        ...prev.cotizacion,
        items: updatedItems
      }
    }));
  }, []);

  // Update ubicaciones
  const updateUbicaciones = useCallback((newData: UbicacionItem[]) => {
    setData(prev => ({
      ...prev,
      ubicaciones: newData
    }));
  }, []);

  // Update opciones
  const updateOpcion = useCallback((opcionId: 'escalable' | 'focalizada' | 'premium', newData: Partial<OpcionData>) => {
    setData(prev => ({
      ...prev,
      opciones: {
        ...prev.opciones,
        [opcionId]: {
          ...prev.opciones[opcionId],
          ...newData
        }
      }
    }));
  }, []);

  // Update equipos for an option
  const updateEquipos = useCallback((opcionId: 'escalable' | 'focalizada' | 'premium', newEquipos: EquipoItem[]) => {
    setData(prev => ({
      ...prev,
      opciones: {
        ...prev.opciones,
        [opcionId]: {
          ...prev.opciones[opcionId],
          equipos: newEquipos
        }
      }
    }));
  }, []);

  // Update comparativa
  const updateComparativa = useCallback((newData: ComparativaItem[]) => {
    setData(prev => ({
      ...prev,
      comparativa: newData
    }));
  }, []);

  // Update beneficios
  const updateBeneficios = useCallback((newData: BeneficioItem[]) => {
    setData(prev => ({
      ...prev,
      beneficios: newData
    }));
  }, []);

  // Update ROI
  const updateROI = useCallback((newData: ROIItem[]) => {
    setData(prev => ({
      ...prev,
      roi: newData
    }));
  }, []);

  // Reset to initial data
  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialData as CCTVData);
  }, []);

  // Export data as JSON
  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `propuesta_cctv_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Calculated values
  const totalInversionActual = data.situacionActual.infraestructura.reduce((sum, item) => sum + item.total, 0);
  const totalAhorroAnual = data.roi.reduce((sum, item) => sum + item.ahorroAnual, 0);
  
  // Cotización calculations
  const subtotalCotizacion = data.cotizacion.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
  const ivaCotizacion = subtotalCotizacion * data.cotizacion.ivaRate;
  const totalCotizacion = subtotalCotizacion + ivaCotizacion;
  
  // Cotización by category
  const cotizacionPorCategoria = data.cotizacion.items.reduce((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = 0;
    acc[item.categoria] += item.cantidad * item.precioUnitario;
    return acc;
  }, {} as Record<string, number>);

  // Ubicaciones totals
  const totalCamarasAnalogicas = data.ubicaciones.reduce((sum, u) => sum + u.camarasAnalogicas, 0);
  const totalCamarasIP = data.ubicaciones.reduce((sum, u) => sum + u.camarasIP, 0);

  // Control de Acceso calculations
  const subtotalControlAcceso = data.controlAcceso.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
  const ivaControlAcceso = subtotalControlAcceso * data.controlAcceso.ivaRate;
  const totalControlAcceso = subtotalControlAcceso + ivaControlAcceso;

  // Update Control de Acceso items
  const updateControlAcceso = useCallback((newItems: ControlAccesoItem[]) => {
    const updatedItems = newItems.map(item => ({
      ...item,
      total: item.cantidad * item.precioUnitario
    }));
    setData(prev => ({
      ...prev,
      controlAcceso: {
        ...prev.controlAcceso,
        items: updatedItems
      }
    }));
  }, []);

  return {
    data,
    setData,
    lastUpdated,
    updateInfraestructura,
    updateCotizacion,
    updateUbicaciones,
    updateOpcion,
    updateEquipos,
    updateComparativa,
    updateBeneficios,
    updateROI,
    updateControlAcceso,
    resetData,
    exportData,
    saveData,
    hasUnsavedChanges,
    lastSaved,
    // Calculated values
    totalInversionActual,
    totalAhorroAnual,
    subtotalCotizacion,
    ivaCotizacion,
    totalCotizacion,
    cotizacionPorCategoria,
    totalCamarasAnalogicas,
    totalCamarasIP,
    subtotalControlAcceso,
    ivaControlAcceso,
    totalControlAcceso
  };
}
