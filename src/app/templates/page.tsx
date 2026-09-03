'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import OshunLogo from '@/components/ui/OshunLogo';
import { Sparkles, Eye, ArrowRight, CheckCircle2, Heart, ExternalLink, Filter, Layers } from 'lucide-react';
import { TEMPLATES_DATA } from '@/lib/templates-data';
import { TemplateDefinition } from '@/types';

export default function StandaloneTemplatesCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas las Colecciones (10 Plantillas)' },
    { id: 'boda', label: 'Bodas de Gala & Romance' },
    { id: 'xv', label: 'XV Años & Fiesta' },
    { id: 'graduacion', label: 'Graduaciones & Galas' },
    { id: 'empresarial', label: 'Empresarial & Corporativo' },
    { id: 'bautizo', label: 'Bautizos & Infantil' },
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES_DATA
      : TEMPLATES_DATA.filter(
          (t) =>
            t.category === selectedCategory ||
            (selectedCategory === 'boda' && t.tags?.some((tag) => tag.toLowerCase().includes('boda') || tag.toLowerCase().includes('gala')))
        );

  return (
    <div className="min-h-screen bg-[#F4EDE2] text-[#162E2D] flex flex-col selection:bg-[#4E8281] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D3B48C]/30 pb-6">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-widest text-[#D3B48C] block font-cinzel"
            >
              Colección Oficial • 10 Diseños Exclusivos
            </span>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#4E8281] mt-1"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Catálogo de Plantillas Dinámicas
            </h1>
            <p className="text-xs sm:text-sm text-[#778F8C] mt-1">
              Explora nuestros 10 estilos con layouts, componentes y animaciones totalmente diferenciados.
            </p>
          </div>

          <Link
            href="/events/new"
            className="px-5 py-2.5 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span>Crear Mi Evento</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#D3B48C]" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#4E8281] text-white shadow-md font-bold ring-2 ring-[#D3B48C]/50'
                  : 'bg-white text-[#778F8C] border border-[#D3B48C]/40 hover:text-[#162E2D] hover:bg-[#FAF6F0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid (10 Templates) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group rounded-3xl overflow-hidden bg-white border border-[#D3B48C]/40 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <Link
                href={`/templates/${template.id}`}
                className="block relative h-64 w-full overflow-hidden bg-[#EFE3D4] cursor-pointer"
              >
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {template.badge && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-[#D3B48C] text-[#0F2424] shadow-md flex items-center gap-1 font-cinzel">
                    <span>✦</span>
                    <span>{template.badge}</span>
                  </div>
                )}
              </Link>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {template.tags?.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF6F0] text-[#4E8281] border border-[#D3B48C]/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3
                    className="text-base font-bold text-[#162E2D]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {template.name}
                  </h3>

                  <p className="text-xs text-[#778F8C] line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D3B48C]/20 flex items-center justify-between">
                  <Link
                    href={`/templates/${template.id}`}
                    className="text-xs font-bold text-[#4E8281] hover:text-[#0F2424] flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Ver Prototipo En Vivo</span>
                  </Link>

                  <Link
                    href={`/events/new?template=${template.id}`}
                    className="px-3.5 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-[#D3B48C] hover:text-[#0F2424] text-[#162E2D] font-bold text-[11px] transition-all border border-[#D3B48C]/40 flex items-center gap-1"
                  >
                    <span>Usar</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
