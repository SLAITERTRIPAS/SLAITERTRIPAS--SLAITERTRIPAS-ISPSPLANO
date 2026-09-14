import React, { useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getProjetoCientificoSections } from "../../data/projetoCientificoData";

interface ProjetoCientificoViewProps {
  onBack: () => void;
}

const CapaContent = () => (
  <div className="flex flex-col items-center justify-center min-h-[500px] text-center font-serif p-12 border border-gray-200 shadow-sm bg-gray-50 rounded-lg">
    <h1 className="text-3xl font-bold mb-8 tracking-widest text-gray-800">INSTITUTO SUPERIOR POLITÉCNICO DE SONGO</h1>
    <div className="mt-16 mb-24">
      <h2 className="text-5xl font-extrabold uppercase tracking-widest text-blue-900">SIGEP</h2>
      <p className="text-2xl mt-6 italic text-gray-700">Sistema Integrado de Gestão de Processo</p>
    </div>
    <div className="mt-auto w-full text-center">
      <p className="text-xl font-semibold">Autor: [Nome do Autor]</p>
      <p className="text-lg mt-2 text-gray-600">Curso: [Nome do Curso]</p>
      <p className="text-lg mt-16 font-bold text-gray-800">Songo, 2026</p>
    </div>
  </div>
);

const FolhaRostoContent = () => (
  <div className="flex flex-col items-center justify-between min-h-[500px] text-center font-serif p-12 border border-gray-200 shadow-sm bg-gray-50 rounded-lg">
    <p className="text-xl font-bold text-gray-800">Autor: [Nome do Autor]</p>
    <div className="mt-16">
      <h2 className="text-4xl font-bold uppercase tracking-widest text-blue-900">SIGEP</h2>
      <p className="text-xl mt-4 italic text-gray-700">Sistema Integrado de Gestão de Processo</p>
    </div>
    <div className="mt-16 text-lg max-w-xl text-left border-l-4 border-blue-900 pl-6">
      <p className="text-gray-700">Projeto científico apresentado ao Instituto Superior Politécnico de Songo, como requisito para avaliação da disciplina de [Nome da Disciplina].</p>
      <p className="mt-8 font-bold text-gray-900">Orientador: [Nome do Orientador]</p>
    </div>
    <div className="mt-16 w-full text-center">
      <p className="text-lg font-bold text-gray-800">Songo, 2026</p>
    </div>
  </div>
);

export default function ProjetoCientificoView({ onBack }: ProjetoCientificoViewProps) {
  const sections = React.useMemo(() => getProjetoCientificoSections(), []);
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id);

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="flex items-center gap-4 p-6 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Projeto Científico SIGEP</h2>
      </div>

      <div className="flex flex-grow overflow-hidden">
        <div className="w-64 border-r border-gray-100 p-4 space-y-1 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                activeSectionId === section.id
                  ? "bg-blue-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        <div className="flex-grow overflow-y-auto p-12">
          <div className="max-w-3xl mx-auto">
            {activeSectionId === "capa" ? (
              <CapaContent />
            ) : activeSectionId === "folha-rosto" ? (
              <FolhaRostoContent />
            ) : (
              <>
                <h3 className="text-3xl font-black text-blue-900 mb-6 flex items-center gap-3">
                  <span className="p-2 bg-blue-100 rounded-lg text-blue-900"><BookOpen size={24}/></span>
                  {activeSection.title}
                </h3>
                {activeSectionId === "indice" ? (
                  <ul className="space-y-4">
                    {sections.map((section, index) => {
                      const resumoIndex = sections.findIndex(s => s.id === "resumo");
                      const pageNumber = index >= resumoIndex ? index - resumoIndex + 1 : null;
                      
                      return (
                        <li key={section.id} className="flex justify-between items-center border-b border-gray-100 py-3">
                          <button
                            onClick={() => setActiveSectionId(section.id)}
                            className="text-blue-900 font-bold hover:underline text-lg text-left"
                          >
                            {section.title}
                          </button>
                          {pageNumber !== null && (
                            <span className="text-gray-500 font-mono text-sm">Pág. {pageNumber}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-loose text-lg font-serif text-justify whitespace-pre-line">
                    {activeSection.content}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-100 text-center text-xs font-bold text-gray-400">
        Documentação Oficial SIGEP-ISPS © 2026
      </div>
    </div>
  );
}
