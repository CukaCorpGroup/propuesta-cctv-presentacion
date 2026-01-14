import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { 
  ColDef,
  CellValueChangedEvent,
  GridReadyEvent,
  GridApi,
  ValueFormatterParams,
  SelectionChangedEvent,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';

// Set license key
LicenseManager.setLicenseKey('Using_this_{AG_Grid}_Enterprise_key_{AG-080666}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{MARBELIZE}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Grid}_Enterprise___This_key_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{12_August_2026}____[v3]_[01]_MTc4NjQ4OTIwMDAwMA==7facb398a9057725bf651e2a7b325b68');

// Currency formatter
export const currencyFormatter = (params: ValueFormatterParams) => {
  if (params.value == null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(params.value);
};

// Number formatter
export const numberFormatter = (params: ValueFormatterParams) => {
  if (params.value == null) return '';
  return new Intl.NumberFormat('en-US').format(params.value);
};

interface CCTVGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  onCellValueChanged?: (event: CellValueChangedEvent<T>) => void;
  onAddRow?: () => void;
  onDeleteRows?: (ids: number[]) => void;
  onSave?: () => boolean;
  title: string;
  subtitle?: string;
  height?: number;
  enableExport?: boolean;
  enableAddRow?: boolean;
  enableDeleteRow?: boolean;
  enableSave?: boolean;
  hasUnsavedChanges?: boolean;
  pinnedBottomRowData?: T[];
  getRowStyle?: (params: any) => any;
}

export function CCTVGrid<T extends { id: number }>({ 
  rowData, 
  columnDefs, 
  onCellValueChanged, 
  onAddRow,
  onDeleteRows,
  onSave,
  title,
  subtitle,
  height = 350,
  enableExport = true,
  enableAddRow = false,
  enableDeleteRow = false,
  enableSave = false,
  hasUnsavedChanges = false,
  pinnedBottomRowData,
  getRowStyle
}: CCTVGridProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const gridApiRef = useRef<GridApi<T> | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Reset saved status after 2 seconds
  useEffect(() => {
    if (saveStatus === 'saved') {
      const timer = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const onGridReady = useCallback((params: GridReadyEvent<T>) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  }, []);

  const onSelectionChanged = useCallback((event: SelectionChangedEvent<T>) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedCount(selectedRows.length);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (!gridApiRef.current || !onDeleteRows) return;
    const selectedRows = gridApiRef.current.getSelectedRows();
    const ids = selectedRows.map(row => row.id);
    if (ids.length > 0) {
      onDeleteRows(ids);
      setSelectedCount(0);
    }
  }, [onDeleteRows]);

  const handleSave = useCallback(() => {
    if (!onSave) return;
    setSaveStatus('saving');
    const success = onSave();
    if (success) {
      setSaveStatus('saved');
    } else {
      setSaveStatus('idle');
    }
  }, [onSave]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    cellClass: 'ag-cell-custom',
  }), []);

  const exportToExcel = useCallback(() => {
    gridApiRef.current?.exportDataAsExcel({
      fileName: `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`,
      sheetName: title,
    });
  }, [title]);

  const exportToCSV = useCallback(() => {
    gridApiRef.current?.exportDataAsCsv({
      fileName: `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`,
    });
  }, [title]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        
        <div className="flex gap-2">
          {enableSave && onSave && (
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                saveStatus === 'saved' 
                  ? 'text-white bg-green-500' 
                  : saveStatus === 'saving'
                  ? 'text-gray-500 bg-gray-100 cursor-wait'
                  : hasUnsavedChanges
                  ? 'text-amber-700 bg-amber-100 hover:bg-amber-200 animate-pulse'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {saveStatus === 'saved' ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Guardado!
                </>
              ) : saveStatus === 'saving' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Guardar
                </>
              )}
            </button>
          )}
          {enableAddRow && onAddRow && (
            <button
              onClick={onAddRow}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Añadir Fila
            </button>
          )}
          {enableDeleteRow && onDeleteRows && selectedCount > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar ({selectedCount})
            </button>
          )}
          {enableExport && (
            <>
              <button
                onClick={exportToExcel}
                className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
              <button
                onClick={exportToCSV}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Grid */}
      <div 
        className="ag-theme-alpine"
        style={{ height, width: '100%' }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          onSelectionChanged={onSelectionChanged}
          pinnedBottomRowData={pinnedBottomRowData}
          getRowStyle={getRowStyle}
          animateRows={true}
          enableCellChangeFlash={true}
          rowSelection="multiple"
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
          enableRangeSelection={true}
          enableFillHandle={true}
        />
      </div>
      
      {/* Footer hint */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-4 flex-wrap">
        <span>💡 Doble clic para editar</span>
        <span>📋 Ctrl+C/V copiar/pegar</span>
        <span>↩️ Ctrl+Z deshacer</span>
        {enableSave && <span>💾 Guardar cambios</span>}
        {enableAddRow && <span>➕ Añadir filas</span>}
        {enableDeleteRow && <span>🗑️ Eliminar filas</span>}
      </div>
    </div>
  );
}

export default CCTVGrid;

