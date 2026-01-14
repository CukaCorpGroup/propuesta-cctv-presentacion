import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, FileText, AlertCircle, Layers, BarChart3, CheckCircle2, Target,
  Download, RotateCcw, Zap, Brain, Camera, HardDrive, Clock, DollarSign,
  TrendingUp, AlertTriangle, ArrowRight, MapPin, Calculator, Plus, Trash2, Lock, Info, Package,
  ArrowUpRight, Activity, PieChart, FileDown, Check, X, Building2
} from 'lucide-react';
import { useCCTVData, InfraestructuraItem, ComparativaItem, BeneficioItem, ROIItem, EquipoItem, CotizacionItem, UbicacionItem, ControlAccesoItem } from './hooks/useCCTVData';
import { generateCCTVPDF, generateControlAccesoPDF, type PDFData } from './utils/pdfGenerator';
import { CCTVGrid, currencyFormatter, numberFormatter } from './components/CCTVGrid';

// Base URL for assets (works with GitHub Pages)
const BASE_URL = import.meta.env.BASE_URL || '/';

// ============================================================
// TAB CONFIGURATION
// ============================================================
const tabs = [
  { id: 'resumen', label: 'Resumen', icon: FileText },
  { id: 'cotizacion', label: 'Cotización', icon: Calculator },
  { id: 'control', label: 'Control Acceso', icon: Lock },
  { id: 'ubicaciones', label: 'Ubicaciones', icon: MapPin },
  { id: 'comparativa', label: 'Comparativa', icon: BarChart3 },
  { id: 'beneficios', label: 'ROI', icon: TrendingUp },
  { id: 'decision', label: 'Decisión', icon: CheckCircle2 },
];

// ============================================================
// RESUMEN EJECUTIVO - Business Value Focused
// ============================================================
const ResumenEjecutivo = ({ data, totalInversionActual, totalCotizacion, totalCamarasIP }: any) => {
  const totalCamarasAnalogicas = data.ubicaciones?.reduce((acc: number, u: any) => acc + (u.camarasAnalogicas || 0), 0) || 117;
  const reduccionCamaras = Math.round((1 - totalCamarasIP / totalCamarasAnalogicas) * 100);
  const mejoraDiasGrabacion = Math.round(365 / 15);
  
  return (
    <div className="py-12 px-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-screen relative overflow-hidden">
      {/* Background Decoratives */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Logo and Hero Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={`${BASE_URL}images/logo.png`} 
            alt="JEIVIAN Logo" 
            className="h-24 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(79,70,229,0.3)]"
          />
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-6 text-sm font-black tracking-[0.2em] text-cyan-400 uppercase bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            <Lock size={16} className="text-cyan-500" />
            Ecosistema de Seguridad JEIVIAN
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Vigilancia <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Ultra Pro 4K con IA</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Migración estratégica de infraestructura analógica a <span className="text-white font-bold">Tecnología de Próxima Generación</span> con inteligencia predictiva.
          </p>
        </motion.div>

        {/* Featured Hardware Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { img: `${BASE_URL}images/camera.png`, title: 'UVC G6 Bullet', tag: 'Cámara 4K IA', desc: 'Detección de largo alcance y visión nocturna ultra clara.' },
            { img: `${BASE_URL}images/server.png`, title: 'Protect ENVR', tag: 'Almacenamiento', desc: 'Grabación segura en espejo con 16 bahías de alta capacidad.' },
            { img: `${BASE_URL}images/ai_key.png`, title: 'NeXT AI Key', tag: 'Procesamiento', desc: 'Búsqueda instantánea por lenguaje natural y reconocimiento facial.' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 group cursor-default shadow-2xl"
            >
              <div className="aspect-video mb-6 overflow-hidden rounded-2xl relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 right-3 px-3 py-1 bg-indigo-600 text-[10px] font-black text-white rounded-full uppercase tracking-wider">
                  {item.tag}
                </div>
              </div>
              <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Key Transformation Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} delay={0.2}
            className="p-6 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md rounded-3xl border border-white/10 text-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-5xl font-black text-red-400 mb-1 leading-none">-{reduccionCamaras}%</div>
            <div className="text-xs font-black text-slate-300 uppercase tracking-widest mt-2">Cámaras</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Eficiencia en Cobertura</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} delay={0.3}
            className="p-6 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md rounded-3xl border border-white/10 text-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-5xl font-black text-emerald-400 mb-1 leading-none">{mejoraDiasGrabacion}x</div>
            <div className="text-xs font-black text-slate-300 uppercase tracking-widest mt-2">Días Grabación</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Capacidad de Respaldo</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} delay={0.4}
            className="p-6 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md rounded-3xl border border-white/10 text-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-5xl font-black text-indigo-400 mb-1 leading-none">4K</div>
            <div className="text-xs font-black text-slate-300 uppercase tracking-widest mt-2">Ultra HD</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Claridad Forense</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} delay={0.5}
            className="p-6 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md rounded-3xl border border-white/10 text-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-5xl font-black text-cyan-400 mb-1 leading-none">IA</div>
            <div className="text-xs font-black text-slate-300 uppercase tracking-widest mt-2">Pro Predictiva</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Visión Cognitiva</div>
          </motion.div>
        </div>

        {/* Business Value Cards */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <TrendingUp className="text-cyan-400" size={28} />
              Valor para el Negocio
            </h2>
            <div className="h-px flex-1 bg-white/10 ml-6 hidden md:block"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                area: 'Gerencia', 
                icon: '👔', 
                title: 'Control Ejecutivo Total',
                benefit: 'Dashboard unificado con acceso móvil seguro desde cualquier lugar del mundo.',
                metrics: 'Gestión remota de todas las sedes en una App.',
                color: 'from-blue-600/10 to-transparent',
                border: 'border-blue-500/20'
              },
              { 
                area: 'Seguridad', 
                icon: '🛡️', 
                title: 'Protección Inteligente',
                benefit: 'Identificación humana y vehicular inmediata con alertas críticas al celular.',
                metrics: 'Respuesta ante incidentes 80% más eficiente.',
                color: 'from-red-600/10 to-transparent',
                border: 'border-red-500/20'
              },
              { 
                area: 'Legal y cumplimiento', 
                icon: '⚖️', 
                title: 'Evidencia Irrefutable',
                benefit: 'Video 4K disponible por meses para respaldo en auditorías y procesos legales.',
                metrics: 'Historial completo de más de 6 meses.',
                color: 'from-purple-600/10 to-transparent',
                border: 'border-purple-500/20'
              },
              { 
                area: 'Operaciones', 
                icon: '⚙️', 
                title: 'Optimización de Tiempos',
                benefit: 'Encuentre eventos específicos en segundos en lugar de horas de revisión manual.',
                metrics: 'Búsqueda inteligente por color, marca o persona.',
                color: 'from-emerald-600/10 to-transparent',
                border: 'border-emerald-500/20'
              },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
                className={`p-8 bg-gradient-to-br ${item.color} backdrop-blur-sm rounded-[2.5rem] border ${item.border} transition-all duration-300 cursor-default flex flex-col justify-between h-full shadow-lg`}
              >
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{item.area}</span>
                      <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 mb-6 leading-relaxed">{item.benefit}</p>
                </div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-2 bg-emerald-500/10 self-start px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={14} /> {item.metrics}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA Card */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          className="p-10 bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-700 rounded-[3rem] shadow-3xl text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4">Lleve su seguridad al siglo XXI</h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto font-medium">Inversión tecnológica diseñada para proteger el activo más importante: su tranquilidad y la continuidad de su negocio.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="text-left">
                <div className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-1">Inversión Total Estimada</div>
                <div className="text-5xl font-black text-white tracking-tighter">${totalCotizacion.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="h-12 w-px bg-white/20 hidden md:block mx-4"></div>
              <button 
                onClick={() => setActiveTab('cotizacion')}
                className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:bg-cyan-50 transition-all hover:scale-105 shadow-xl flex items-center gap-2 group"
              >
                Ver Desglose de Fases <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================
// COTIZACIÓN - Phased Investment Design
// ============================================================
const Cotizacion = ({ data, activeTab, setActiveTab, totalCotizacion }: any) => {
  return (
    <div className="py-12 px-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full border border-orange-500/30 mb-6 focus-within:ring-2 focus-within:ring-orange-500">
            <span className="text-sm font-black text-orange-400 tracking-[0.2em] uppercase">Propuesta Económica</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-4">
            Plan de <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">Inversión Estratégica</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Desglose detallado por fases diseñado para una implementación progresiva, minimizando el impacto operativo inicial y asegurando escalabilidad total.
          </p>
        </motion.div>

        {/* Phases Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* FASE 1 - Sistema Base */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="relative bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col group"
          >
            {/* Header with Background Image */}
            <div className="relative h-56 overflow-hidden">
              <img src={`${BASE_URL}images/server.png`} alt="Sistema Base" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-6 left-8 flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-white/10 ring-4 ring-orange-500/20">🚀</div>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">FASE 1</h3>
                  <p className="text-orange-400 font-black text-xs uppercase tracking-[0.3em]">Cimiento Tecnológico & IA</p>
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <table className="w-full">
                  <tbody className="divide-y divide-white/5">
                    <tr><td colSpan={3} className="pb-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">🔌 Conectividad & Almacenamiento</td></tr>
                    <tr className="text-slate-300 text-sm">
                      <td className="py-2.5">Cableado UTP + Switches PoE++ Empresariales</td>
                      <td className="text-center text-slate-500 font-mono text-xs">19 pts</td>
                      <td className="text-right font-black text-white">$4,934.50</td>
                    </tr>
                    <tr className="text-slate-300 text-sm">
                      <td className="py-2.5">Servidor UniFi Protect ENVR (16 bahías)</td>
                      <td className="text-center text-slate-500 font-mono text-xs">1 ud</td>
                      <td className="text-right font-black text-white">$2,498.75</td>
                    </tr>
                    <tr className="text-slate-300 text-sm">
                      <td className="py-2.5">Discos Enterprise 24TB (Ultra Resistencia)</td>
                      <td className="text-center text-slate-500 font-mono text-xs">6 uds</td>
                      <td className="text-right font-black text-white">$4,142.04</td>
                    </tr>

                    <tr><td colSpan={3} className="py-3 pt-6 text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">📷 Visualización & Inteligencia</td></tr>
                    <tr className="text-slate-300 text-sm">
                      <td className="py-2.5">Cámaras G6 Bullet Pro 4K (IA Multi-TOPS)</td>
                      <td className="text-center text-slate-500 font-mono text-xs">19 uds</td>
                      <td className="text-right font-black text-white">$4,732.52</td>
                    </tr>
                    <tr className="text-slate-300 text-sm">
                      <td className="py-2.5">Acelerador de Procesamiento NeXT AI Key</td>
                      <td className="text-center text-slate-500 font-mono text-xs">1 ud</td>
                      <td className="text-right font-black text-white">$1,389.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-10">
                <div className="p-8 bg-gradient-to-br from-orange-600 to-amber-700 rounded-[2rem] shadow-2xl relative overflow-hidden group/btn">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/btn:scale-125 transition-transform duration-500">🚀</div>
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <span className="text-white/80 font-black uppercase tracking-[0.2em] text-[10px] block mb-1">Inversión Fase Inicial</span>
                      <span className="text-4xl font-black text-white tracking-tighter">$17,696.81</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-1">Retención</div>
                      <div className="text-xl font-black text-white">~65 Días</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-xs text-slate-400">
                    <Zap size={16} className="text-orange-400" />
                    <span>Infraestructura lista para <span className="text-white font-bold">IA Predictiva</span></span>
                  </div>
                  <CheckCircle2 size={16} className="text-orange-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* FASE 2 - Expansión */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="relative bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col group"
          >
            {/* Header with Background Image */}
            <div className="relative h-56 overflow-hidden">
              <img src={`${BASE_URL}images/camera.png`} alt="Expansión" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-6 left-8 flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-white/10 ring-4 ring-emerald-500/20">📈</div>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">FASE 2</h3>
                  <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em]">Máxima Retención & Cobertura</p>
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <table className="w-full">
                  <tbody className="divide-y divide-white/5">
                    <tr><td colSpan={3} className="pb-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">💾 Almacenamiento Premium (Full Rack)</td></tr>
                    <tr className="text-slate-300 text-sm">
                      <td className="py-2.5">Expansión de Almacenamiento Enterprise 24TB</td>
                      <td className="text-center text-slate-500 font-mono text-xs">10 uds</td>
                      <td className="text-right font-black text-white">$6,903.40</td>
                    </tr>

                    <tr><td colSpan={3} className="py-3 pt-6 text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">📷 Cobertura Perimetral Completa</td></tr>
                    <tr className="text-slate-300 text-sm">
                      <td className="py-2.5">Cámaras G6 Bullet Pro 4K Adicionales</td>
                      <td className="text-center text-slate-500 font-mono text-xs">6 uds</td>
                      <td className="text-right font-black text-white">$1,494.48</td>
                    </tr>
                    <tr className="text-slate-300 text-sm">
                      <td className="py-2.5">Infraestructura de Red & Certificación Pts.</td>
                      <td className="text-center text-slate-500 font-mono text-xs">6 pts</td>
                      <td className="text-right font-black text-white">$933.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-10">
                <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2rem] shadow-2xl relative overflow-hidden group/btn">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/btn:scale-125 transition-transform duration-500">📈</div>
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <span className="text-white/80 font-black uppercase tracking-[0.2em] text-[10px] block mb-1">Inversión Fase 2</span>
                      <span className="text-4xl font-black text-white tracking-tighter">$9,330.88</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-1">Retención Final</div>
                      <div className="text-xl font-black text-white">~365 Días</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="p-5 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Check size={14} className="text-emerald-500" /> Historial 6+ meses
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Check size={14} className="text-emerald-500" /> Cobertura 100%
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Check size={14} className="text-emerald-500" /> Redundancia RAID
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Check size={14} className="text-emerald-500" /> Escalable a 70 cam.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Investment Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-12 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 rounded-[3.5rem] shadow-3xl text-white relative overflow-hidden border border-white/10"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 grid md:grid-cols-3 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="text-xs font-black text-indigo-300 uppercase tracking-[0.4em] mb-4">Inversión Consolidada Proyectada</div>
              <div className="text-6xl font-black tracking-tighter mb-2 leading-none">${totalCotizacion.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-tighter border border-white/5">
                <Info size={10} className="text-indigo-300" /> Valor neto sin impuestos detallados
              </div>
            </div>
            
            <div className="hidden md:block h-24 w-px bg-white/10 mx-auto"></div>
            
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between text-base px-6 py-4 bg-slate-950/40 rounded-3xl border border-white/5 backdrop-blur-xl">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Total Neto de Equipos</span>
                <span className="font-black text-2xl text-cyan-400">${totalCotizacion.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <button 
                onClick={() => setActiveTab('beneficios')}
                className="w-full py-5 bg-white text-indigo-950 font-black rounded-3xl hover:bg-cyan-50 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group text-lg"
              >
                Analizar Proyección ROI <TrendingUp size={22} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notes section */}
        {data.cotizacion.notas && data.cotizacion.notas.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
            <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                <FileText className="text-orange-500" size={24} />
              </div>
              Términos & Condiciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.cotizacion.notas.map((nota: any) => (
                <div key={nota.id} className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group hover:bg-slate-900/60 shadow-xl">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                      {nota.id}
                    </div>
                    <div className="font-black text-white text-base tracking-tight pt-1 leading-tight">{nota.titulo}</div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{nota.contenido}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// UBICACIONES (NEW!)
// ============================================================
const Ubicaciones = ({ data, totalCamarasAnalogicas, totalCamarasIP }: any) => {

  return (
    <div className="py-12 px-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-full border border-cyan-500/30 mb-4">
            <span className="text-sm font-semibold text-cyan-300">📍 MAPA DE INSTALACIÓN</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            Ubicaciones de <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Instalación</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Detalle de áreas donde se instalarán las cámaras
          </p>
        </motion.div>

        {/* Location Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {data.ubicaciones.map((ubicacion: any, index: number) => {
            const colorMap: Record<string, { accent: string, badge: string, glow: string }> = {
              'orange': { accent: 'border-orange-500/50', badge: 'bg-orange-500', glow: 'from-orange-500/10' },
              'cyan': { accent: 'border-cyan-500/50', badge: 'bg-cyan-500', glow: 'from-cyan-500/10' },
              'yellow': { accent: 'border-yellow-500/50', badge: 'bg-yellow-500', glow: 'from-yellow-500/10' },
              'green': { accent: 'border-green-500/50', badge: 'bg-green-500', glow: 'from-green-500/10' },
              'teal': { accent: 'border-teal-500/50', badge: 'bg-teal-500', glow: 'from-teal-500/10' },
              'purple': { accent: 'border-purple-500/50', badge: 'bg-purple-500', glow: 'from-purple-500/10' },
              'red': { accent: 'border-red-500/50', badge: 'bg-red-500', glow: 'from-red-500/10' },
              'amber': { accent: 'border-amber-500/50', badge: 'bg-amber-500', glow: 'from-amber-500/10' },
              'slate': { accent: 'border-slate-500/50', badge: 'bg-slate-500', glow: 'from-slate-500/10' },
              'lime': { accent: 'border-lime-500/50', badge: 'bg-lime-500', glow: 'from-lime-500/10' },
            };
            const color = colorMap[ubicacion.color] || colorMap['cyan'];
            
            return (
              <motion.div
                key={ubicacion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className={`relative p-5 bg-gradient-to-br ${color.glow} to-slate-900/90 backdrop-blur-sm rounded-2xl border ${color.accent} border-l-4 overflow-hidden cursor-default`}
              >
                {/* Header with location name and camera badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ubicacion.icono}</span>
                    <h4 className="text-lg font-bold text-white">{ubicacion.ubicacion}</h4>
                  </div>
                  <span className={`${color.badge} px-3 py-1 rounded-full text-xs font-bold text-white`}>
                    {ubicacion.camarasIP} cámara{ubicacion.camarasIP !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Purpose Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-cyan-300">
                    <Check size={12} className="text-green-400" />
                    {ubicacion.proposito}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed">
                  {ubicacion.descripcion}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 rounded-2xl shadow-2xl"
        >
          <div className="grid md:grid-cols-4 gap-6 text-center text-white">
            <div>
              <div className="text-sm font-semibold opacity-70 uppercase tracking-wider">Total Ubicaciones</div>
              <div className="text-3xl font-black">{data.ubicaciones.length}</div>
            </div>
            <div>
              <div className="text-sm font-semibold opacity-70 uppercase tracking-wider">Cámaras IP</div>
              <div className="text-3xl font-black">{totalCamarasIP}</div>
            </div>
            <div>
              <div className="text-sm font-semibold opacity-70 uppercase tracking-wider">Resolución</div>
              <div className="text-3xl font-black">4K</div>
            </div>
            <div>
              <div className="text-sm font-semibold opacity-70 uppercase tracking-wider">Tecnología</div>
              <div className="text-3xl font-black">IA</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================
// CONTROL DE ACCESO (NEW!)
// ============================================================
const ControlAcceso = ({ data, updateControlAcceso, subtotalControlAcceso, ivaControlAcceso, totalControlAcceso, saveData, hasUnsavedChanges }: any) => {
  
  const columnDefs = useMemo<ColDef<ControlAccesoItem>[]>(() => [
    { 
      field: 'icono', 
      headerName: '', 
      width: 50, 
      editable: false,
      cellClass: 'text-2xl'
    },
    { 
      field: 'componente', 
      headerName: 'Componente', 
      flex: 1.5, 
      editable: (params) => !params.node?.rowPinned,
      cellClass: (params) => params.node?.rowPinned ? 'font-bold text-gray-900' : 'font-medium'
    },
    { 
      field: 'descripcion', 
      headerName: 'Descripción', 
      flex: 2,
      editable: (params) => !params.node?.rowPinned,
      cellClass: 'text-gray-600'
    },
    { 
      field: 'cantidad', 
      headerName: 'Cant.', 
      width: 80,
      type: 'numericColumn',
      editable: (params) => !params.node?.rowPinned,
      valueFormatter: (params) => {
        if (params.node?.rowPinned) return '';
        return params.value?.toLocaleString() || '0';
      }
    },
    { 
      field: 'precioUnitario', 
      headerName: 'P. Unit.', 
      width: 110,
      type: 'numericColumn',
      editable: (params) => !params.node?.rowPinned,
      valueFormatter: (params) => {
        if (params.node?.rowPinned) return '';
        return params.value != null ? `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00';
      }
    },
    { 
      field: 'total', 
      headerName: 'Total', 
      width: 130,
      type: 'numericColumn',
      editable: false,
      valueGetter: (params: ValueGetterParams<ControlAccesoItem>) => {
        if (!params.data) return 0;
        if (params.node?.rowPinned) return params.data.total;
        return params.data.cantidad * params.data.precioUnitario;
      },
      valueFormatter: currencyFormatter,
      cellClass: (params) => params.node?.rowPinned ? 'font-black text-cyan-800 text-lg' : 'font-bold text-cyan-700'
    }
  ], []);

  const onCellValueChanged = useCallback((event: CellValueChangedEvent<ControlAccesoItem>) => {
    const updatedData = data.controlAcceso.items.map((item: ControlAccesoItem) => {
      if (item.id === event.data?.id) {
        return { ...event.data, total: event.data.cantidad * event.data.precioUnitario };
      }
      return item;
    });
    updateControlAcceso(updatedData);
  }, [data.controlAcceso.items, updateControlAcceso]);

  const pinnedBottomRowData = useMemo(() => [
    { id: 998, icono: '', categoria: '', componente: 'TOTAL', descripcion: '', cantidad: 0, precioUnitario: 0, total: subtotalControlAcceso },
  ], [subtotalControlAcceso]);

  const getRowStyle = useCallback((params: any) => {
    if (params.node.rowPinned) {
      if (params.data?.id === 999) return { backgroundColor: '#cffafe', fontWeight: '800', fontSize: '1.1rem' };
      return { backgroundColor: '#ecfeff', fontWeight: '600' };
    }
    return undefined;
  }, []);

  const onAddRow = useCallback(() => {
    const maxId = Math.max(...data.controlAcceso.items.map((item: ControlAccesoItem) => item.id), 0);
    const newItem: ControlAccesoItem = {
      id: maxId + 1,
      categoria: 'NUEVO',
      componente: 'Nuevo Item',
      descripcion: 'Descripción del nuevo item',
      cantidad: 1,
      precioUnitario: 0,
      total: 0,
      icono: '📦'
    };
    updateControlAcceso([...data.controlAcceso.items, newItem]);
  }, [data.controlAcceso.items, updateControlAcceso]);

  const onDeleteRows = useCallback((ids: number[]) => {
    const filteredItems = data.controlAcceso.items.filter((item: ControlAccesoItem) => !ids.includes(item.id));
    updateControlAcceso(filteredItems);
  }, [data.controlAcceso.items, updateControlAcceso]);

  return (
    <div className="py-12 px-6 bg-gradient-to-br from-cyan-50 to-sky-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-cyan-600 to-sky-500 bg-clip-text text-transparent">Control de Acceso</span> UniFi
          </h2>
          <p className="text-gray-500">Sistema profesional de control de acceso con lectores NFC/Bluetooth</p>
        </motion.div>

        {/* Kit Desglose */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-cyan-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-cyan-800 flex items-center gap-2">
              <Lock className="text-cyan-500" size={20} />
              Contenido del Kit UA-G3-SK-Pro (por cada puerta)
            </h3>
            <a href="https://store.ui.com/us/en/category/all-door-access/products/ua-g3-sk-pro" 
               target="_blank" rel="noopener noreferrer"
               className="text-sm text-cyan-600 hover:text-cyan-800 font-semibold flex items-center gap-1">
              Ver en Ubiquiti Store <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.controlAcceso.kitDesglose.map((item: any) => (
              <motion.a 
                key={item.id} 
                href={item.url || '#'} 
                target={item.url ? "_blank" : "_self"}
                rel="noopener noreferrer"
                whileHover={{ scale: item.url ? 1.03 : 1 }}
                className={`p-4 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl border border-cyan-100 block transition-all ${item.url ? 'hover:border-cyan-300 hover:shadow-lg cursor-pointer' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{item.icono}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">{item.cantidad}x</span>
                      <span className="font-bold text-gray-800 text-sm">{item.componente}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{item.descripcion}</p>
                    {item.url && (
                      <p className="text-[10px] text-cyan-600 mt-2 font-semibold flex items-center gap-1">
                        Ver en Ubiquiti Store <ArrowRight size={10} />
                      </p>
                    )}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quotation Table */}
        <CCTVGrid
          title="Cotización Control de Acceso"
          subtitle="3 puertas con sistema completo de entrada/salida"
          rowData={data.controlAcceso.items}
          columnDefs={columnDefs}
          onCellValueChanged={onCellValueChanged}
          onAddRow={onAddRow}
          onDeleteRows={onDeleteRows}
          onSave={saveData}
          enableAddRow={true}
          enableDeleteRow={true}
          enableSave={true}
          hasUnsavedChanges={hasUnsavedChanges}
          pinnedBottomRowData={pinnedBottomRowData}
          getRowStyle={getRowStyle}
          height={350}
        />

        {/* Total highlight */}
        <motion.div whileHover={{ scale: 1.01 }} className="p-8 bg-gradient-to-r from-cyan-600 to-sky-600 rounded-2xl shadow-xl text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-2">Inversión Total Control de Acceso</p>
          <p className="text-5xl font-black">${subtotalControlAcceso.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-sm opacity-70 mt-2">* Precios no incluyen IVA</p>
        </motion.div>

        {/* Important Notes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100">
          <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
            <Info className="text-amber-500" size={20} />
            Notas Importantes
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {data.controlAcceso.notas.map((nota: any) => (
              <div key={nota.id} className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                <div className="font-bold text-amber-800 mb-1">{nota.id}. {nota.titulo}</div>
                <p className="text-sm text-gray-700">{nota.contenido}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};


// ============================================================
// ANÁLISIS COMPARATIVO (Sistema Actual vs Propuesto) - Executive Style
// ============================================================
const AnalisisComparativo = ({ data, totalCamarasAnalogicas, totalCamarasIP, subtotalCotizacion }: any) => {
  const comparisons = [
    { 
      feature: 'Resolución de Video',
      current: '1080p (2 MP)',
      proposed: '4K Ultra HD (8 MP)',
      improvement: '4x',
      icon: '📺',
      impactArea: 'Seguridad'
    },
    { 
      feature: 'Días de Grabación',
      current: '15 días',
      proposed: '365+ días',
      improvement: '24x',
      icon: '💾',
      impactArea: 'Legal/Compliance'
    },
    { 
      feature: 'Almacenamiento',
      current: '~2TB (DVRs)',
      proposed: '144TB Enterprise',
      improvement: '72x',
      icon: '🗄️',
      impactArea: 'Operaciones'
    },
    { 
      feature: 'Inteligencia Artificial',
      current: 'No disponible',
      proposed: 'IA incluida (NeXT AI)',
      improvement: '∞',
      icon: '🤖',
      impactArea: 'Innovación'
    },
    { 
      feature: 'Reconocimiento Facial',
      current: 'No disponible',
      proposed: 'Incluido',
      improvement: 'Nuevo',
      icon: '👤',
      impactArea: 'Seguridad'
    },
    { 
      feature: 'Detección de Objetos',
      current: 'Solo movimiento básico',
      proposed: 'Personas, vehículos, animales',
      improvement: '+300%',
      icon: '🎯',
      impactArea: 'Seguridad'
    },
    { 
      feature: 'Acceso Remoto',
      current: 'Limitado (VPN)',
      proposed: 'Cloud + App móvil',
      improvement: '✓',
      icon: '📱',
      impactArea: 'Gerencia'
    },
    { 
      feature: 'Gestión Centralizada',
      current: '11 DVRs independientes',
      proposed: '1 ENVR unificado',
      improvement: '-91%',
      icon: '🎛️',
      impactArea: 'TI'
    },
  ];

  // Stats cards data
  const stats = [
    { label: 'Cámaras Actuales', value: totalCamarasAnalogicas, suffix: '', color: 'gray' },
    { label: 'DVRs Legacy', value: 11, suffix: '', color: 'red' },
    { label: 'Cámaras IP 4K', value: totalCamarasIP, suffix: '', color: 'indigo' },
    { label: 'Días Grabación', value: '365+', suffix: '', color: 'green' },
  ];

  return (
    <div className="py-12 px-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/30 mb-4">
            <span className="text-sm font-semibold text-indigo-300">🔍 ANÁLISIS COMPARATIVO</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            Arquitectura <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Comparativa</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Diferencias fundamentales entre el sistema analógico actual y la solución IP propuesta
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-all"
            >
              <div className={`text-3xl font-black bg-gradient-to-r ${
                stat.color === 'indigo' ? 'from-indigo-400 to-purple-400' :
                stat.color === 'green' ? 'from-green-400 to-emerald-400' :
                stat.color === 'red' ? 'from-red-400 to-orange-400' :
                'from-gray-400 to-slate-400'
              } bg-clip-text text-transparent`}>
                {stat.value}{stat.suffix}
              </div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Architecture Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current System - Analog */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="relative p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📼</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sistema Analógico</h3>
                <p className="text-sm text-slate-400">Infraestructura Actual</p>
              </div>
            </div>

            {/* Architecture Flow */}
            <div className="bg-black/30 rounded-xl p-4 mb-4">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">Diagrama de Conexión</div>
              <div className="flex flex-col items-center gap-2">
                {[
                  { icon: '🔀', label: 'Switch de Red', sub: '' },
                  { icon: '📹', label: 'DVR Local', sub: '11 unidades' },
                  { icon: '⚡', label: 'Cable Coaxial + Eléctrico', sub: '' },
                  { icon: '📷', label: 'Cámara Analógica', sub: '1080p' },
                ].map((item, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="w-0.5 h-4 bg-gradient-to-b from-red-500 to-orange-500 rounded-full" />}
                    <div className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
                      <span className="text-xl mr-2">{item.icon}</span>
                      <span className="text-sm text-slate-300 font-medium">{item.label}</span>
                      {item.sub && <span className="text-xs text-slate-500 ml-2">({item.sub})</span>}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Issues List */}
            <div className="space-y-3">
              {[
                { text: 'Cableado doble requerido', sub: 'Video + Eléctrico por cámara' },
                { text: 'Almacenamiento fragmentado', sub: '11 DVRs independientes' },
                { text: 'Escalabilidad limitada', sub: 'Máx. 16 cámaras por DVR' },
                { text: 'Búsqueda manual', sub: 'Horas de video para encontrar eventos' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                    <X size={14} className="text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{item.text}</div>
                    <div className="text-xs text-slate-400">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Proposed System - IP */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="relative p-6 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl border border-indigo-700 overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌐</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sistema IP + IA</h3>
                <p className="text-sm text-indigo-300">Solución Propuesta</p>
              </div>
            </div>

            {/* Architecture Flow */}
            <div className="bg-black/30 rounded-xl p-4 mb-4">
              <div className="text-xs text-indigo-400 uppercase tracking-wider mb-3 font-semibold">Diagrama de Conexión</div>
              <div className="flex flex-col items-center gap-2">
                {[
                  { icon: '💾', label: 'NVR Central', sub: '144TB' },
                  { icon: '⚡', label: 'Switch PoE', sub: 'Datos + Energía' },
                  { icon: '🔌', label: 'Cable UTP Cat6', sub: 'Un solo cable' },
                  { icon: '📷', label: 'Cámara IP 4K', sub: 'Con IA' },
                ].map((item, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="w-0.5 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />}
                    <div className="w-full px-4 py-2 bg-indigo-800/50 border border-indigo-600 rounded-lg text-center">
                      <span className="text-xl mr-2">{item.icon}</span>
                      <span className="text-sm text-white font-medium">{item.label}</span>
                      {item.sub && <span className="text-xs text-indigo-300 ml-2">({item.sub})</span>}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3">
              {[
                { text: 'Un solo cable por cámara', sub: 'PoE transmite datos y energía' },
                { text: 'Almacenamiento centralizado', sub: '1 ENVR con 144TB para todas las cámaras' },
                { text: 'Alta escalabilidad', sub: 'Hasta 70 cámaras 4K' },
                { text: 'Búsqueda inteligente con IA', sub: 'Por eventos, personas, lenguaje natural' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                    <Check size={14} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.text}</div>
                    <div className="text-xs text-indigo-200">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Investment Badge */}
            <div className="mt-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-center">
              <div className="text-2xl font-black text-white">${subtotalCotizacion.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-xs text-indigo-200">Inversión (sin IVA)</div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 bg-white/5 border-b border-white/10">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-indigo-400" size={20} />
              Comparativa Detallada de Características
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {comparisons.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="grid grid-cols-4 gap-4 px-6 py-4 transition-colors cursor-default"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <span className="font-medium text-white">{item.feature}</span>
                    <span className="block text-xs text-slate-500">{item.impactArea}</span>
                  </div>
                </div>
                <div className="flex items-center text-slate-400 text-sm">
                  {item.current}
                </div>
                <div className="flex items-center text-indigo-300 font-medium text-sm">
                  {item.proposed}
                </div>
                <div className="flex items-center justify-end">
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    {item.improvement}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Navigation Hint */}
        <div className="text-center text-slate-500 text-sm">
          ⬇️ Continúa a la sección de ROI para ver el análisis financiero
        </div>
      </div>
    </div>
  );
};

// ============================================================
// BENEFICIOS & ROI (Enhanced with Financial Metrics)
// ============================================================
const BeneficiosROI = ({ data, updateBeneficios, updateROI, totalAhorroAnual, subtotalCotizacion, subtotalControlAcceso }: any) => {
  const totalInversion = subtotalCotizacion + (subtotalControlAcceso || 0);
  const discountRate = 0.10; // 10% tasa de descuento
  const years = 5;
  
  // Cálculos financieros avanzados
  const paybackMonths = Math.ceil(totalInversion / (totalAhorroAnual / 12));
  const roiYear1 = (totalAhorroAnual / totalInversion) * 100;
  
  // VAN (Valor Actual Neto) a 5 años
  const calculateVAN = () => {
    let van = -totalInversion;
    for (let t = 1; t <= years; t++) {
      van += totalAhorroAnual / Math.pow(1 + discountRate, t);
    }
    return van;
  };
  const van = calculateVAN();
  
  // TIR aproximada (Newton-Raphson simplificado)
  const calculateTIR = () => {
    let tir = 0.1;
    for (let i = 0; i < 100; i++) {
      let npv = -totalInversion;
      let dnpv = 0;
      for (let t = 1; t <= years; t++) {
        npv += totalAhorroAnual / Math.pow(1 + tir, t);
        dnpv -= t * totalAhorroAnual / Math.pow(1 + tir, t + 1);
      }
      if (Math.abs(npv) < 0.01) break;
      tir = tir - npv / dnpv;
    }
    return tir * 100;
  };
  const tir = calculateTIR();
  
  // ROI acumulado por año
  const roiByYear = Array.from({ length: years }, (_, i) => ({
    year: i + 1,
    savings: totalAhorroAnual * (i + 1),
    netPosition: totalAhorroAnual * (i + 1) - totalInversion,
    roi: ((totalAhorroAnual * (i + 1) - totalInversion) / totalInversion) * 100
  }));

  const beneficiosColumnDefs = useMemo<ColDef<BeneficioItem>[]>(() => [
    { field: 'beneficio', headerName: 'Beneficio', flex: 2, editable: true },
    { field: 'impacto', headerName: 'Impacto', width: 100, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Crítico', 'Alto', 'Medio', 'Bajo'] },
      cellClass: (params) => {
        const colors: Record<string, string> = {
          'Crítico': 'text-red-600 font-bold',
          'Alto': 'text-orange-600 font-semibold',
          'Medio': 'text-yellow-600',
          'Bajo': 'text-gray-500'
        };
        return colors[params.value] || '';
      }
    },
    { field: 'ahorro', headerName: 'Ahorro', width: 120, type: 'numericColumn', editable: true, valueFormatter: currencyFormatter },
    { field: 'descripcion', headerName: 'Descripción', flex: 3, editable: true },
  ], []);

  const roiColumnDefs = useMemo<ColDef<ROIItem>[]>(() => [
    { field: 'concepto', headerName: 'Concepto', flex: 2, editable: true },
    { field: 'ahorroAnual', headerName: 'Ahorro Anual', width: 130, type: 'numericColumn', editable: true, valueFormatter: currencyFormatter, cellClass: 'font-semibold text-green-600' },
    { field: 'descripcion', headerName: 'Descripción', flex: 3, editable: true },
  ], []);

  const onBeneficioChange = useCallback((event: CellValueChangedEvent<BeneficioItem>) => {
    const updatedData = data.beneficios.map((item: BeneficioItem) => 
      item.id === event.data?.id ? { ...event.data } : item
    );
    updateBeneficios(updatedData);
  }, [data.beneficios, updateBeneficios]);

  const onROIChange = useCallback((event: CellValueChangedEvent<ROIItem>) => {
    const updatedData = data.roi.map((item: ROIItem) => 
      item.id === event.data?.id ? { ...event.data } : item
    );
    updateROI(updatedData);
  }, [data.roi, updateROI]);

  const roiPinnedRow = useMemo(() => [{ id: 999, concepto: 'TOTAL AHORRO ANUAL', ahorroAnual: totalAhorroAnual, descripcion: '' }], [totalAhorroAnual]);

  return (
    <div className="py-12 px-6 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Análisis de <span className="text-emerald-600">Retorno de Inversión</span>
          </h2>
          <p className="text-gray-500">Métricas financieras y proyección a 5 años</p>
        </motion.div>

        {/* Key Financial Metrics */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-white rounded-2xl shadow-lg border border-green-200">
            <Activity className="text-green-500 mb-2" size={24} />
            <div className="text-2xl font-black text-green-600">${totalAhorroAnual.toLocaleString()}</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Ahorro Anual</div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-5 bg-white rounded-2xl shadow-lg border border-blue-200">
            <TrendingUp className="text-blue-500 mb-2" size={24} />
            <div className="text-2xl font-black text-blue-600">{roiYear1.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">ROI Año 1</div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-5 bg-white rounded-2xl shadow-lg border border-amber-200">
            <Clock className="text-amber-500 mb-2" size={24} />
            <div className="text-2xl font-black text-amber-600">{paybackMonths} meses</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Payback</div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="p-5 bg-white rounded-2xl shadow-lg border border-purple-200">
            <DollarSign className="text-purple-500 mb-2" size={24} />
            <div className="text-2xl font-black text-purple-600">${van.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">VAN (5 años)</div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="p-5 bg-white rounded-2xl shadow-lg border border-indigo-200">
            <PieChart className="text-indigo-500 mb-2" size={24} />
            <div className="text-2xl font-black text-indigo-600">{tir.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">TIR</div>
          </motion.div>
        </div>

        {/* ROI Timeline Visual */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={20} />
            Proyección de ROI a 5 Años
          </h3>
          <div className="relative">
            {/* Timeline bar */}
            <div className="absolute top-6 left-0 right-0 h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (paybackMonths / 60) * 100)}%` }}
              />
            </div>
            
            {/* Year markers */}
            <div className="flex justify-between pt-12">
              {roiByYear.map((year, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-center p-3 rounded-xl ${year.netPosition >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}
                >
                  <div className="text-xs text-gray-500 font-semibold mb-1">Año {year.year}</div>
                  <div className={`text-lg font-black ${year.netPosition >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {year.netPosition >= 0 ? '+' : ''}{year.roi.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    ${year.netPosition.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Payback indicator */}
            <div 
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${Math.min(95, (paybackMonths / 60) * 100)}%` }}
            >
              <div className="w-0.5 h-4 bg-emerald-500"></div>
              <div className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                Recuperación: {paybackMonths}m
              </div>
            </div>
          </div>
        </motion.div>

        {/* Business Impact by Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
            <Building2 className="text-indigo-200" size={24} />
            Impacto por Área de Negocio
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { 
                area: 'Gerencia', 
                icon: '👔', 
                benefit: 'Dashboard centralizado', 
                description: 'Visibilidad en tiempo real de todas las instalaciones, decisiones basadas en datos',
                savings: 15000,
                color: 'from-blue-500/30 to-cyan-500/30'
              },
              { 
                area: 'Seguridad', 
                icon: '🛡️', 
                benefit: 'Detección IA automática', 
                description: 'Alertas proactivas, respuesta 80% más rápida a incidentes críticos',
                savings: 35000,
                color: 'from-red-500/30 to-orange-500/30'
              },
              { 
                area: 'RRHH', 
                icon: '👥', 
                benefit: 'Monitoreo instalaciones', 
                description: 'Investigaciones laborales eficientes con búsqueda inteligente de eventos',
                savings: 12000,
                color: 'from-green-500/30 to-emerald-500/30'
              },
              { 
                area: 'Operaciones', 
                icon: '⚙️', 
                benefit: 'Reducción 90% búsqueda', 
                description: 'Tiempo de revisión de eventos reducido de horas a minutos con IA',
                savings: 11000,
                color: 'from-purple-500/30 to-pink-500/30'
              },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`p-4 bg-gradient-to-br ${item.color} backdrop-blur-sm border border-white/20 rounded-xl cursor-default`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-bold text-lg">{item.area}</span>
                </div>
                <div className="text-sm font-semibold text-white/90 mb-2">{item.benefit}</div>
                <div className="text-xs text-white/70 mb-3 line-clamp-2">{item.description}</div>
                <div className="pt-2 border-t border-white/20">
                  <div className="text-lg font-black text-white">
                    ${item.savings.toLocaleString()}
                    <span className="text-xs font-normal text-white/60 ml-1">/año</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="text-sm text-white/70">Total Ahorro Estimado por Área</span>
            <span className="text-2xl font-black">$73,000<span className="text-sm font-normal text-white/70">/año</span></span>
          </div>
        </motion.div>

        {/* Tables */}
        <CCTVGrid title="Beneficios del Sistema" subtitle="Impactos y ahorros por categoría" rowData={data.beneficios} columnDefs={beneficiosColumnDefs} onCellValueChanged={onBeneficioChange} height={260} />
        <CCTVGrid title="Desglose de Ahorros Anuales" subtitle="Conceptos que contribuyen al ROI" rowData={data.roi} columnDefs={roiColumnDefs} onCellValueChanged={onROIChange} pinnedBottomRowData={roiPinnedRow} height={260} getRowStyle={(p: any) => p.node.rowPinned ? { backgroundColor: '#d1fae5', fontWeight: 'bold' } : undefined} />
      </div>
    </div>
  );
};

// ============================================================
// DECISIÓN FINAL (with Dual Approval and PDF Generation)
// ============================================================
const DecisionFinal = ({ data, totalAhorroAnual, subtotalCotizacion, subtotalControlAcceso, totalCamarasIP }: any) => {
  const [cctvApproved, setCctvApproved] = useState(false);
  const [controlApproved, setControlApproved] = useState(false);
  const [generatingCCTV, setGeneratingCCTV] = useState(false);
  const [generatingControl, setGeneratingControl] = useState(false);
  
  const totalInversionCompleta = subtotalCotizacion + (subtotalControlAcceso || 0);
  const roiYear1 = (totalAhorroAnual / totalInversionCompleta) * 100;
  const paybackMonths = Math.ceil(totalInversionCompleta / (totalAhorroAnual / 12));
  const currentDate = new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleApproveCCTV = useCallback(async () => {
    setGeneratingCCTV(true);
    
    // Calculations for metrics
    const totalCamarasAnalogicas = data.ubicaciones?.reduce((acc: number, u: any) => acc + (u.camarasAnalogicas || 0), 0) || 117;
    const reduccionCamaras = Math.round((1 - totalCamarasIP / totalCamarasAnalogicas) * 100);
    const mejoraDiasGrabacion = Math.round(365 / 15);

    // Hardware Showcase items
    const hardware = [
      { title: 'UVC G6 Bullet', tag: 'Cámara 4K IA', desc: 'Detección de largo alcance y visión nocturna ultra clara.' },
      { title: 'Protect ENVR', tag: 'Almacenamiento', desc: 'Grabación segura en espejo con 16 bahías de alta capacidad.' },
      { title: 'NeXT AI Key', tag: 'Procesamiento', desc: 'Búsqueda instantánea por lenguaje natural y reconocimiento facial.' },
    ];

    // Business Impact items
    const businessImpact = [
      { area: 'Gerencia', title: 'Control Ejecutivo Total', benefit: 'Dashboard unificado con acceso móvil seguro desde cualquier lugar del mundo.', metrics: 'Gestión remota de todas las sedes en una App.' },
      { area: 'Seguridad', title: 'Protección Inteligente', benefit: 'Identificación humana y vehicular inmediata con alertas críticas al celular.', metrics: 'Respuesta ante incidentes 80% más eficiente.' },
      { area: 'Legal', title: 'Evidencia Irrefutable', benefit: 'Video 4K disponible por meses para respaldo en auditorías y procesos legales.', metrics: 'Historial completo de más de 6 meses.' },
      { area: 'Operaciones', title: 'Optimización de Tiempos', benefit: 'Encuentre eventos específicos en segundos en lugar de horas de revisión manual.', metrics: 'Búsqueda inteligente por color, marca o persona.' },
    ];

    // Phased items mapping
    // Note: We'll split logically based on categories or names to match the UI visual
    const fase1 = [
      { componente: 'Cableado UTP + Switches PoE++ Empresariales', cantidad: 19, precioUnitario: 259.71 },
      { componente: 'Servidor UniFi Protect ENVR (16 bahías)', cantidad: 1, precioUnitario: 2498.75 },
      { componente: 'Discos Enterprise 24TB (Ultra Resistencia)', cantidad: 6, precioUnitario: 690.34 },
      { componente: 'Cámaras G6 Bullet Pro 4K (IA Multi-TOPS)', cantidad: 19, precioUnitario: 249.08 },
      { componente: 'Acelerador de Procesamiento NeXT AI Key', cantidad: 1, precioUnitario: 1389.00 },
    ];
    const fase2 = [
      { componente: 'Expansión de Almacenamiento Enterprise 24TB', cantidad: 10, precioUnitario: 690.34 },
      { componente: 'Cámaras G6 Bullet Pro 4K Adicionales', cantidad: 6, precioUnitario: 249.08 },
      { componente: 'Infraestructura de Red & Certificación Pts.', cantidad: 6, precioUnitario: 155.50 },
    ];

    // Prepare PDF data
    const pdfData: PDFData = {
      title: 'Propuesta Sistema CCTV IP + IA',
      subtitle: 'Sistema de Videovigilancia Inteligente 4K',
      date: new Date().toLocaleDateString('es-EC'),
      items: data.cotizacion.items.map((item: CotizacionItem) => ({
        componente: item.componente,
        descripcion: (item as any).descripcion || '',
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        total: item.cantidad * item.precioUnitario
      })),
      phasedItems: { fase1, fase2 },
      metrics: {
        reduccionCamaras,
        mejoraDiasGrabacion,
        resolucion: '4K',
        ia: 'PREDICTIVA'
      },
      hardware,
      ubicaciones: data.ubicaciones,
      businessImpact,
      subtotal: subtotalCotizacion,
      notas: data.cotizacion.notas || [],
      empresa: 'JEIVIAN Security'
    };
    
    // Generate PDF
    try {
      await generateCCTVPDF(pdfData);
      setCctvApproved(true);
      setGeneratingCCTV(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setGeneratingCCTV(false);
    }
  }, [data.cotizacion, data.ubicaciones, subtotalCotizacion, totalCamarasIP]);

  const handleApproveControl = useCallback(() => {
    setGeneratingControl(true);
    
    // Prepare PDF data
    const pdfData: PDFData = {
      title: 'Propuesta Control de Acceso',
      subtitle: 'Sistema UniFi Access Profesional',
      date: new Date().toLocaleDateString('es-EC'),
      items: data.controlAcceso.items.map((item: ControlAccesoItem) => ({
        componente: item.componente,
        descripcion: item.descripcion || '',
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        total: item.cantidad * item.precioUnitario
      })),
      subtotal: subtotalControlAcceso,
      notas: data.controlAcceso.notas || [],
      empresa: 'JEIVIAN Security'
    };
    
    // Generate PDF
    setTimeout(() => {
      generateControlAccesoPDF(pdfData);
      setControlApproved(true);
      setGeneratingControl(false);
    }, 1000);
  }, [data.controlAcceso, subtotalControlAcceso]);
  
  return (
    <div className="py-12 px-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Aprobación de Propuestas</h2>
          <p className="text-gray-500">Revise y apruebe cada sistema por separado</p>
          <p className="text-xs text-gray-400 mt-1">{currentDate}</p>
        </motion.div>

        {/* Approval Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* CCTV Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl shadow-lg border-2 transition-all ${
              cctvApproved 
                ? 'bg-green-50 border-green-300' 
                : 'bg-white border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  cctvApproved ? 'bg-green-200' : 'bg-indigo-100'
                }`}>
                  {cctvApproved ? <Check className="text-green-600" size={24} /> : <Camera className="text-indigo-600" size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Sistema CCTV IP + IA</h3>
                  <p className="text-sm text-gray-500">Videovigilancia Inteligente 4K</p>
                </div>
              </div>
              {cctvApproved && (
                <span className="px-3 py-1 bg-green-200 text-green-700 text-xs font-bold rounded-full">
                  APROBADO
                </span>
              )}
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ${subtotalCotizacion.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-400 mb-4">* Sin IVA</p>
            
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> {data.cotizacion.items.length} componentes</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> 25 Cámaras G6 Bullet 4K</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> ENVR + 144TB + AI-Key</div>
            </div>
            
            <motion.button 
              whileHover={{ scale: cctvApproved ? 1 : 1.02 }} 
              whileTap={{ scale: cctvApproved ? 1 : 0.98 }}
              onClick={handleApproveCCTV}
              disabled={cctvApproved || generatingCCTV}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                cctvApproved 
                  ? 'bg-green-100 text-green-600 cursor-default' 
                  : generatingCCTV 
                    ? 'bg-indigo-400 text-white cursor-wait'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
              }`}
            >
              {generatingCCTV ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generando PDF...
                </>
              ) : cctvApproved ? (
                <>
                  <Check size={18} /> PDF Descargado
                </>
              ) : (
                <>
                  <FileDown size={18} /> Aprobar y Generar PDF
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Control de Acceso Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl shadow-lg border-2 transition-all ${
              controlApproved 
                ? 'bg-green-50 border-green-300' 
                : 'bg-white border-gray-200 hover:border-cyan-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  controlApproved ? 'bg-green-200' : 'bg-cyan-100'
                }`}>
                  {controlApproved ? <Check className="text-green-600" size={24} /> : <Lock className="text-cyan-600" size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Control de Acceso</h3>
                  <p className="text-sm text-gray-500">UniFi Access Profesional</p>
                </div>
              </div>
              {controlApproved && (
                <span className="px-3 py-1 bg-green-200 text-green-700 text-xs font-bold rounded-full">
                  APROBADO
                </span>
              )}
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ${(subtotalControlAcceso || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-400 mb-4">* Sin IVA</p>
            
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span> {data.controlAcceso.items.length} componentes</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span> 3 Kits UA-G3-SK-Pro</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span> Cerraduras + Lectores NFC</div>
            </div>
            
            <motion.button 
              whileHover={{ scale: controlApproved ? 1 : 1.02 }} 
              whileTap={{ scale: controlApproved ? 1 : 0.98 }}
              onClick={handleApproveControl}
              disabled={controlApproved || generatingControl}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                controlApproved 
                  ? 'bg-green-100 text-green-600 cursor-default' 
                  : generatingControl 
                    ? 'bg-cyan-400 text-white cursor-wait'
                    : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg'
              }`}
            >
              {generatingControl ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generando PDF...
                </>
              ) : controlApproved ? (
                <>
                  <Check size={18} /> PDF Descargado
                </>
              ) : (
                <>
                  <FileDown size={18} /> Aprobar y Generar PDF
                </>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Total Investment Summary */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 p-8 rounded-2xl text-center"
        >
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Inversión Total (Ambos Sistemas)</p>
          <div className="text-5xl font-bold text-white mb-2">${totalInversionCompleta.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <p className="text-xs text-gray-500">* Precios no incluyen IVA</p>
          
          {/* Approval Status */}
          {(cctvApproved || controlApproved) && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-center gap-4">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  cctvApproved ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  CCTV: {cctvApproved ? '✓ Aprobado' : 'Pendiente'}
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  controlApproved ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  Acceso: {controlApproved ? '✓ Aprobado' : 'Pendiente'}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { value: `$${totalAhorroAnual.toLocaleString()}`, label: 'Ahorro Anual', color: 'text-green-600' },
            { value: `${roiYear1.toFixed(1)}%`, label: 'ROI Año 1', color: 'text-amber-600' },
            { value: `${paybackMonths} meses`, label: 'Payback', color: 'text-blue-600' },
            { value: 'IA', label: 'Incluida', color: 'text-purple-600' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white p-4 rounded-xl border border-gray-100 text-center">
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Payment Terms */}
        <div className="text-center text-gray-400 text-sm">
          <p className="font-semibold">Condiciones de Pago</p>
          <p>40% anticipo | 60% contra entrega</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('resumen');
  const {
    data, lastUpdated, updateInfraestructura, updateCotizacion, updateUbicaciones, updateEquipos, updateOpcion,
    updateComparativa, updateBeneficios, updateROI, updateControlAcceso, resetData, exportData,
    saveData, hasUnsavedChanges,
    totalInversionActual, totalAhorroAnual, subtotalCotizacion, ivaCotizacion, totalCotizacion, cotizacionPorCategoria,
    totalCamarasAnalogicas, totalCamarasIP, subtotalControlAcceso, ivaControlAcceso, totalControlAcceso
  } = useCCTVData();

  const renderContent = () => {
    switch (activeTab) {
      case 'resumen': return <ResumenEjecutivo data={data} totalInversionActual={totalInversionActual} totalCotizacion={totalCotizacion} totalCamarasIP={totalCamarasIP} />;
      case 'cotizacion': return <Cotizacion data={data} updateCotizacion={updateCotizacion} subtotalCotizacion={subtotalCotizacion} ivaCotizacion={ivaCotizacion} totalCotizacion={totalCotizacion} cotizacionPorCategoria={cotizacionPorCategoria} saveData={saveData} hasUnsavedChanges={hasUnsavedChanges} />;
      case 'control': return <ControlAcceso data={data} updateControlAcceso={updateControlAcceso} subtotalControlAcceso={subtotalControlAcceso} ivaControlAcceso={ivaControlAcceso} totalControlAcceso={totalControlAcceso} saveData={saveData} hasUnsavedChanges={hasUnsavedChanges} />;
      case 'ubicaciones': return <Ubicaciones data={data} updateUbicaciones={updateUbicaciones} totalCamarasAnalogicas={totalCamarasAnalogicas} totalCamarasIP={totalCamarasIP} />;
      case 'comparativa': return <AnalisisComparativo data={data} totalCamarasAnalogicas={totalCamarasAnalogicas} totalCamarasIP={totalCamarasIP} subtotalCotizacion={subtotalCotizacion} />;
      case 'beneficios': return <BeneficiosROI data={data} updateBeneficios={updateBeneficios} updateROI={updateROI} totalAhorroAnual={totalAhorroAnual} subtotalCotizacion={subtotalCotizacion} subtotalControlAcceso={subtotalControlAcceso} />;
      case 'decision': return <DecisionFinal data={data} totalAhorroAnual={totalAhorroAnual} subtotalCotizacion={subtotalCotizacion} subtotalControlAcceso={subtotalControlAcceso} totalCamarasIP={totalCamarasIP} />;
      default: return <ResumenEjecutivo data={data} totalInversionActual={totalInversionActual} totalCotizacion={totalCotizacion} totalCamarasIP={totalCamarasIP} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img 
                  src={`${BASE_URL}images/logo.png`} 
                  alt="JEIVIAN Logo" 
                  className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-lg font-black tracking-tight text-white leading-none">JEIVIAN</span>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none mt-1">Smart Security Solutions</span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}>
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button onClick={exportData} className="p-2.5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-colors" title="Exportar PDF"><FileDown size={20} /></button>
                <button onClick={resetData} className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors" title="Reiniciar Datos"><RotateCcw size={20} /></button>
              </div>
              <div className="h-6 w-px bg-white/10 mx-1"></div>
              <span className="text-[10px] font-mono text-slate-500 hidden md:block">{lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>

          <nav className="lg:hidden pb-4 flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white/5 text-slate-400 border border-white/5'
                }`}>
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-12 px-6 bg-slate-950 border-t border-white/5 text-center">
        <div className="mb-6 flex justify-center">
          <img src={`${BASE_URL}images/logo.png`} alt="JEIVIAN Logo" className="h-12 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
        </div>
        <p className="font-black text-white mb-2 tracking-widest uppercase text-sm">JEIVIAN Security Systems</p>
        <p className="text-slate-500 text-xs">Propuesta Tecnológica CCTV IP con IA | Enero 2026</p>
        <div className="mt-8 text-[10px] text-slate-600 uppercase tracking-[0.2em]">© 2026 CCGS - Jeivian Platform</div>
      </footer>
    </div>
  );
}
