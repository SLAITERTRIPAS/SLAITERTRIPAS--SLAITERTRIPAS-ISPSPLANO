import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "../../lib/utils";

const content = `# SIGEP – Sistema Integrado de Gestão de Processos

## 1. Enquadramento

O **SIGEP – Sistema Integrado de Gestão de Processos** é uma plataforma digital concebida para apoiar a **modernização, integração e transformação dos processos institucionais**, disponibilizando um ambiente único para gerir, acompanhar e controlar as principais atividades e procedimentos de uma instituição.

A plataforma foi concebida para ser **flexível, modular, segura e adaptável**, podendo ser implementada em diferentes instituições em Moçambique, independentemente da sua dimensão, estrutura ou área de atuação.

O SIGEP procura substituir processos fragmentados, baseados em documentos físicos, comunicações dispersas e procedimentos manuais, por **processos digitais estruturados, rastreáveis, transparentes e orientados para resultados**.

Mais do que informatizar tarefas, o SIGEP pretende **melhorar a forma como as instituições planeiam, executam, comunicam, controlam, avaliam e tomam decisões**.

---

# 2. Objetivo Geral

O objetivo geral do SIGEP é **disponibilizar uma plataforma integrada para a gestão, tramitação, planificação, execução, monitoria, documentação, comunicação e controlo dos processos institucionais**, garantindo maior eficiência, transparência, segurança, responsabilização e qualidade na prestação dos serviços.

O sistema procura assegurar que a informação institucional esteja **centralizada, organizada, disponível, atualizada e protegida**, permitindo que os responsáveis tenham acesso à informação necessária para acompanhar as operações e tomar decisões fundamentadas.

---

# 3. Objetivos Específicos

O SIGEP tem como principais objetivos:

1. **Digitalizar os processos institucionais**, reduzindo a dependência de procedimentos manuais e documentos físicos.

2. **Integrar diferentes áreas da instituição** numa plataforma única, evitando a dispersão da informação.

3. **Automatizar fluxos de trabalho**, reduzindo etapas desnecessárias e melhorando a velocidade de tramitação.

4. **Garantir a rastreabilidade dos processos**, permitindo identificar responsáveis, ações, datas, movimentações e decisões.

5. **Melhorar a transparência institucional**, proporcionando mecanismos de acompanhamento e controlo de acordo com os níveis de acesso definidos.

6. **Apoiar a planificação institucional**, permitindo transformar objetivos e planos em atividades concretas, responsáveis, metas e indicadores.

7. **Controlar a execução das atividades**, permitindo comparar o que foi planificado com aquilo que foi efetivamente realizado.

8. **Fortalecer a monitoria e avaliação**, disponibilizando indicadores e informações atualizadas sobre o desempenho institucional.

9. **Automatizar a produção de relatórios**, utilizando os dados efetivamente registados no sistema.

10. **Digitalizar e organizar processos individuais**, garantindo maior segurança, disponibilidade e controlo da informação.

11. **Modernizar a gestão patrimonial**, permitindo identificar, localizar, movimentar e acompanhar os bens institucionais durante o seu ciclo de vida.

12. **Facilitar a comunicação interna**, através de um sistema integrado de mensagens e partilha de informação.

13. **Reforçar a segurança da informação**, através de perfis, permissões, controlo de acesso e auditoria.

14. **Apoiar a tomada de decisão**, disponibilizando informação estruturada, indicadores, dashboards e relatórios.

---

# 4. Principais Áreas Funcionais

O SIGEP integra um conjunto de áreas funcionais interligadas, permitindo que a instituição tenha uma visão global dos seus processos.

## 4.1. Gestão de Processos

Permite gerir todo o ciclo de vida dos processos, desde a criação ou receção até à tramitação, análise, encaminhamento, despacho, aprovação, conclusão e arquivo.

Cada processo mantém o seu histórico, permitindo acompanhar o seu estado, responsáveis, documentos, decisões e movimentações.

## 4.2. Gestão de Planificação

Permite elaborar e acompanhar:

* Planos estratégicos;
* Planos anuais;
* Planos operacionais;
* Planos setoriais;
* Planos de atividades;
* Planos individuais;
* Programas e projetos institucionais.

Cada plano pode conter objetivos, atividades, responsáveis, metas, indicadores, prazos e resultados esperados.

## 4.3. Gestão e Controlo de Atividades

O SIGEP permite acompanhar o ciclo completo das atividades:

**Planificação → Programação → Execução → Monitoria → Avaliação → Relatório.**

Cada atividade pode possuir responsável, prazo, estado, meta, indicador, resultado esperado e evidências da execução.

O sistema permite identificar atividades concluídas, em execução, atrasadas, suspensas, canceladas ou não iniciadas.

## 4.4. Monitoria e Avaliação

A plataforma permite comparar continuamente o **planeado com o executado**, fornecendo indicadores sobre o nível de realização dos planos e atividades.

Os gestores podem acompanhar o desempenho por instituição, unidade, departamento, setor, responsável ou período.

## 4.5. Relatórios e Informação de Gestão

O SIGEP gera relatórios com base nos dados existentes na plataforma.

Isso permite produzir informação sobre:

* Execução dos planos;
* Execução das atividades;
* Cumprimento de metas;
* Processos concluídos e pendentes;
* Atividades atrasadas;
* Desempenho institucional;
* Indicadores de execução;
* Resultados alcançados;
* Situação patrimonial;
* Processos individuais;
* Outros indicadores configurados pela instituição.

Desta forma, os relatórios deixam de depender exclusivamente de consolidações manuais e passam a refletir os **dados efetivamente registados no sistema**.

## 4.6. Gestão Documental

Permite digitalizar, classificar, armazenar, consultar, encaminhar e arquivar documentos.

Os documentos podem ser associados a processos, atividades, planos, pessoas ou outras entidades institucionais.

## 4.7. Gestão de Processos Individuais Digitalizados

Permite criar **dossiês digitais individuais**, organizando documentos e informações relacionados com cada pessoa abrangida pela instituição.

O sistema mantém o histórico e controla o acesso às informações de acordo com as permissões atribuídas.

## 4.8. Gestão Patrimonial

Permite gerir o património institucional através de:

* Cadastro de bens;
* Inventário;
* Identificação dos bens;
* Localização;
* Responsável;
* Estado de conservação;
* Movimentação;
* Transferência;
* Manutenção;
* Conferência física;
* Ocorrências;
* Abate;
* Histórico patrimonial.

O SIGEP permite acompanhar o **ciclo de vida dos bens institucionais**, desde a sua incorporação até à sua retirada.

## 4.9. Comunicação Interna

O sistema possui um ambiente interno de comunicação que permite:

* Enviar e receber mensagens;
* Responder a mensagens;
* Criar conversas;
* Partilhar documentos;
* Associar mensagens a processos;
* Associar comunicações a atividades;
* Manter o histórico das interações.

Isso reduz a dependência de canais externos e mantém a comunicação institucional integrada com os processos.

## 4.10. Tramitação e Aprovação

O SIGEP permite configurar fluxos de tramitação de acordo com a estrutura da instituição.

Um processo pode ser encaminhado sucessivamente aos responsáveis competentes, mantendo o histórico de cada etapa.

## 4.11. Notificações e Alertas

A plataforma pode emitir alertas relacionados com:

* Novos processos;
* Novas mensagens;
* Tarefas atribuídas;
* Prazos;
* Processos pendentes;
* Atividades atrasadas;
* Solicitações de aprovação;
* Documentos recebidos;
* Outras ocorrências relevantes.

## 4.12. Gestão de Utilizadores e Permissões

O SIGEP permite administrar utilizadores, funções, cargos, unidades e níveis de acesso.

Cada utilizador pode ter permissões específicas para **consultar, criar, alterar, encaminhar, aprovar ou administrar informações**, de acordo com as suas responsabilidades.

---

# 5. Transparência e Rastreabilidade

A **transparência é um dos princípios estruturantes do SIGEP**.

A plataforma permite acompanhar o percurso dos processos e das atividades, respeitando sempre os níveis de confidencialidade e acesso definidos pela instituição.

O sistema pode registar:

* Utilizador responsável;
* Data e hora da operação;
* Movimentação do processo;
* Alterações efetuadas;
* Documentos associados;
* Encaminhamentos;
* Despachos;
* Aprovações;
* Decisões;
* Estado do processo;
* Histórico da atividade.

Assim, cada operação relevante pode ser **rastreada e auditada**.

O princípio é simples:

> **Toda operação relevante deve deixar um registo verificável no sistema.**

---

# 6. Segurança e Controlo

O SIGEP incorpora mecanismos destinados a proteger a informação institucional através de:

* Autenticação de utilizadores;
* Perfis de acesso;
* Permissões por função;
* Controlo de acesso à informação;
* Registo de atividades;
* Auditoria;
* Histórico de alterações;
* Proteção dos documentos;
* Gestão de sessões;
* Mecanismos de recuperação e continuidade, conforme a infraestrutura adotada.

A segurança é aplicada de forma integrada, garantindo que a transparência não comprometa a **confidencialidade das informações institucionais**.

---

# 7. Dashboards e Tomada de Decisão

O SIGEP disponibiliza **dashboards de gestão**, permitindo transformar dados operacionais em informação útil para os gestores.

Os responsáveis podem acompanhar indicadores como:

**Planificado | Programado | Em execução | Executado | Atrasado | Não executado**

Esta informação permite identificar rapidamente problemas, desvios e áreas que necessitam de intervenção.

O gestor deixa de depender apenas de informações dispersas ou relatórios produzidos posteriormente e passa a dispor de uma **visão estruturada da situação institucional**.

---

# 8. Qualidade que o SIGEP proporciona às instituições

A implementação do SIGEP contribui diretamente para elevar a **qualidade da gestão institucional**.

### 8.1. Maior eficiência

A digitalização e automatização reduzem tarefas repetitivas, circulação física de documentos e tempo gasto na localização de informações.

### 8.2. Maior transparência

Os processos passam a possuir histórico, responsáveis, movimentações e registos verificáveis.

### 8.3. Maior responsabilização

Cada utilizador atua dentro das suas competências e as operações relevantes podem ser associadas ao respetivo responsável.

### 8.4. Maior controlo

A instituição consegue acompanhar processos, atividades, prazos, planos, património e resultados de forma estruturada.

### 8.5. Melhor comunicação

A comunicação interna passa a estar integrada com os processos e atividades, reduzindo a dispersão da informação.

### 8.6. Melhor organização

Documentos, processos, atividades, planos e informações individuais passam a estar estruturados num ambiente centralizado.

### 8.7. Redução de perdas de informação

A digitalização e o arquivo estruturado reduzem os riscos associados à perda, extravio ou deterioração de documentos físicos.

### 8.8. Melhor capacidade de decisão

Os gestores passam a dispor de **indicadores, dashboards e relatórios baseados nos dados registados no sistema**.

### 8.9. Maior capacidade de monitoria

A instituição pode acompanhar continuamente aquilo que foi planeado, executado, atrasado ou não realizado.

### 8.10. Melhoria contínua

A informação produzida pelo SIGEP permite identificar problemas, analisar resultados e implementar medidas corretivas.

---

# 9. Impacto Institucional

O SIGEP contribui para uma mudança significativa na forma de funcionamento das instituições.

Em vez de:

**Documentos dispersos → processos manuais → informação fragmentada → comunicação informal → relatórios manuais → decisões tardias**

a instituição passa a trabalhar com:

**Processos digitais → informação centralizada → fluxos controlados → comunicação integrada → monitoria contínua → relatórios baseados em dados → decisões fundamentadas.**

Esta transformação aumenta a capacidade da instituição de **planejar, executar, controlar, avaliar e melhorar continuamente os seus serviços e processos**.

---

# 10. Visão do SIGEP

O SIGEP pretende constituir-se como um **ecossistema digital de gestão institucional**, capaz de integrar pessoas, processos, atividades, documentos, património, comunicação, informação e resultados num único ambiente.

O ciclo de gestão promovido pelo sistema pode ser representado por:

### **PLANIFICAR → PROGRAMAR → EXECUTAR → DOCUMENTAR → COMUNICAR → MONITORAR → AVALIAR → REPORTAR → CORRIGIR → MELHORAR**

Desta forma, o SIGEP não é apenas uma ferramenta de digitalização documental. É uma **plataforma de gestão orientada para processos, resultados, transparência e melhoria contínua**.

---

# 11. Conclusão

O **SIGEP – Sistema Integrado de Gestão de Processos** representa uma solução tecnológica destinada a apoiar a modernização das instituições em Moçambique, promovendo uma gestão mais **eficiente, transparente, organizada, segura, rastreável e orientada para resultados**.

A integração da **gestão de processos, planificação, atividades, execução, monitoria, avaliação, relatórios, documentação, processos individuais, património, comunicação, tramitação e auditoria** permite criar uma visão integrada da instituição e reduzir significativamente a fragmentação da informação e dos procedimentos.

O principal valor do SIGEP está na capacidade de transformar informação dispersa em **informação estruturada**, processos manuais em **processos digitais**, atividades isoladas em **atividades monitoráveis**, documentos físicos em **documentos acessíveis e rastreáveis**, e dados operacionais em **informação de gestão para apoiar decisões**.

Em síntese, o SIGEP procura criar instituições mais:

**EFICIENTES • TRANSPARENTES • ORGANIZADAS • RESPONSÁVEIS • SEGURAS • RASTREÁVEIS • ORIENTADAS PARA RESULTADOS**

### Princípio fundamental

> **“Planificar com clareza, executar com controlo, comunicar com segurança, acompanhar com transparência, comprovar com evidências e decidir com base em informação.”**
`;

export default function SobreSistemaView() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-red-600 tracking-tight">
        SIGEP – Sistema Integrado de Gestão de Processos
      </h1>
      <div
        className={cn(
          "markdown-body p-8 bg-white rounded-3xl shadow-sm border border-gray-100 transition-all duration-300",
          !isExpanded && "max-h-[600px] overflow-hidden"
        )}
      >
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                {...props}
                className="text-3xl font-black text-red-600 border-l-4 border-red-200 hover:border-red-600 hover:bg-red-50 pl-4 py-2 my-6 transition-all duration-300 cursor-pointer"
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                className="text-2xl font-bold text-red-600 border-l-4 border-red-200 hover:border-red-600 hover:bg-red-50 pl-4 py-2 my-4 transition-all duration-300 cursor-pointer"
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                {...props}
                className="text-xl font-bold text-red-600 border-l-4 border-red-100 hover:border-red-600 hover:bg-red-50 pl-3 py-1 my-3 transition-all duration-300 cursor-pointer"
              />
            ),
          }}
        >
          {content.replace("# SIGEP – Sistema Integrado de Gestão de Processos", "")}
        </ReactMarkdown>
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 pl-4"
      >
        {isExpanded ? "Ver menos" : "Ver mais"}
      </button>
    </div>
  );
}
