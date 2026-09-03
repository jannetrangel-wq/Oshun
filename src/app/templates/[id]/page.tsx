import React from 'react';
import { notFound } from 'next/navigation';
import { TEMPLATES_DATA } from '@/lib/templates-data';
import TemplatePrototypePreview from '@/components/templates/TemplatePrototypePreview';

export async function generateStaticParams() {
  return TEMPLATES_DATA.map((t) => ({
    id: t.id,
  }));
}

export default function StandaloneTemplatePreviewPage({ params }: { params: { id: string } }) {
  const template = TEMPLATES_DATA.find((t) => t.id === params.id) || TEMPLATES_DATA[0];

  if (!template) {
    notFound();
  }

  return <TemplatePrototypePreview template={template} />;
}
