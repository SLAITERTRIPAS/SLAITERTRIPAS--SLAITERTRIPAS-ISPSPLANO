# MEMÓRIA DESCRITIVA - SIGEP / SIGEPI
## Sistema Integrado de Gestão de Processo e Planeamento Institucional

### FICHA TÉCNICA
* **TIPO DE PROJETO**: projeto de pesquisa
* **RESPONSÁVEL TÉCNICO**: Fransissi Tripalonga Vicente
* **E-MAIL**: ftripas@gmail.com
* **CONTACTO**: +258849547771 / 827520137
* **ESTATUTO**: Projeto de Pesquisa

---

### ÍNDICE
1. [Resumo Executivo](#1-resumo-executivo)
2. [Apresentação e Arquitetura do Sistema](#2-apresentação-e-arquitetura-do-sistema)
3. [Contexto Institucional e Operacional](#3-contexto-institucional-e-operacional)
4. [Público-Alvo e Níveis de Acesso (RBAC)](#4-público-alvo-e-níveis-de-acesso-rbac)
5. [Justificativa e Relevância do Projeto](#5-justificativa-e-relevância-do-projeto)
6. [Objetivos Estratégicos](#6-objetivos-estratégicos)
7. [Descrição Funcional Detalhada (Os 8 Blocos)](#7-descrição-funcional-detalhada-os-8-blocos)
8. [Metodologia de Desenvolvimento e Persistência](#8-metodologia-de-desenvolvimento-e-persistência)
9. [Indicadores de Desempenho (KPIs) e Monitoria](#9-indicadores-de-desempenho-kpis-e-monitoria)
10. [Matriz de Riscos e Estratégias de Mitigação](#10-matriz-de-riscos-e-estratégias-de-mitigação)
11. [Sustentabilidade, Manutenção e Atualização](#11-sustentabilidade-manutenção-e-atualização)
12. [Cronograma de Implantação e Marcos Críticos](#12-cronograma-de-implantação-e-marcos-críticos)
13. [Estrutura Orçamental e ROI](#13-estrutura-orçamental-e-roi)
14. [Anexos e Documentação Complementar](#14-anexos-e-documentação-complementar)
15. [Check-list de Prontidão Institucional](#15-check-list-de-prontidão-institucional)

---

### 1. RESUMO EXECUTIVO
O **SIGEP (Sistema Integrado de Gestão de Processo / SIGEPI)** é a plataforma tecnológica de referência para a governação digital, modernização administrativa e integração de processos nas Instituições de Ensino Superior (IES) em Moçambique. Projetado para unificar sob um único ecossistema reativo a totalidade das operações institucionais, o sistema abrange desde a gestão de recursos humanos e património até à execução orçamental (PESOE) e à emissão oficial de documentação. A arquitetura da plataforma está estruturada em **8 Blocos Funcionais Coesos**, garantindo rastreabilidade ponta-a-ponta, conformidade com o SISTAFE e eliminação total da tramitação em papel.

### 2. APRESENTAÇÃO E ARQUITETURA DO SISTEMA
O SIGEP foi concebido sob o paradigma da **Governação Digital Reativa**. A aplicação integra um motor de sincronização em tempo real (baseado em Firebase Firestore e React 18+), permitindo que qualquer atualização efetuada nos serviços centrais seja instantaneamente refletida nos órgãos de direção e nos dashboards estatísticos. 
* **Arquitetura de 8 Blocos**: Separação modular rigorosa cobrindo Apresentação, Órgãos de Gestão, Planeamento, Serviços Centrais, Ferramentas de Sistema, Documentos Oficiais, Relatórios e Módulos Gerais.
* **Segurança e Auditoria**: Controlo de acessos baseado em papéis (RBAC), assinaturas digitais avançadas e registo imutável de todas as operações.

### 3. CONTEXTO INSTITUCIONAL E OPERACIONAL
As Instituições de Ensino Superior debatem-se historicamente com a fragmentação de dados entre departamentos de recursos humanos, património, contabilidade e secretarias pedagógicas. O SIGEP atua como o sistema nervoso central da instituição, interligando a Direção Nacional de Ensino Superior (DNES), os órgãos de gestão (DICOSSER), as unidades orgânicas e os parceiros externos (UGEA / Fornecedores).

### 4. PÚBLICO-ALVO E NÍVEIS DE ACESSO (RBAC)
* **Administradores Centrais (DNES)**: Supervisão global do sistema, gestão de parâmetros institucionais, auditoria e migração de dados.
* **Órgãos de Gestão (DICOSSER / Diretores)**: Acesso a dashboards executivos, aprovação de despachos, planos de atividade e monitoria estratégica.
* **Técnicos Administrativos & RH**: Operação diária dos módulos de pessoal, remunerações, assistência médica, formação e inventário.
* **Gestores UGEA & Fornecedores**: Gestão de concursos, registo de fornecedores, requisições internas e economato.

### 5. JUSTIFICATIVA E RELEVÂNCIA DO PROJETO
A adoção do SIGEP responde à necessidade premente de modernização e conformidade legal na administração pública superior, mitigando riscos patrimoniais e humanos através de registos imutáveis e verificação por QR Code, assegurando alinhamento com o SISTAFE.

### 6. OBJETIVOS ESTRATÉGICOS
* **Integração Total**: Unificação de 8 blocos funcionais numa única base de dados reativa.
* **Celeridade**: Redução do tempo de tramitação documental e emissão automática de guias e fichas.
* **Transparência**: Rastreio permanente de processos, despachos e inventário patrimonial.

### 7. DESCRIÇÃO FUNCIONAL DETALHADA (OS 8 BLOCOS)
1. **Bloco 1 (Apresentação e Autenticação)**: Gestão de credenciais, alteração de palavra-passe, ecrã de boas-vindas, ecrãs de transição e seleção de setores institucionais.
2. **Bloco 2 (Órgãos de Gestão)**: Dashboards para Diretores, visão geral da DICOSSER, Conselhos, Órgãos Centrais e DPEP.
3. **Bloco 3 (Planeamento Estratégico - PESOE)**: Quadros 1.1, 1.2, 1.3, Ações Orçamentais, Recursos Financeiros, Planos de Atividade e Balanços.
4. **Bloco 4 (Serviços Centrais e Operacionais)**: Recursos Humanos (pessoal, remunerações, assistência médica, formação, assistência social), Património (bens móveis, imóveis, veículos, equipamentos), UGEA (fornecedores), Economato, Transportes, Espaços Físicos e Expediente.
5. **Bloco 5 (Sistema Avançado e Ferramentas)**: Caixa de mensagens, centro de notificações, bloco de assinaturas digitais, matrizes de decisão, workflow de requisições, diagnóstico inteligente, calendário de encontros e arquivo.
6. **Bloco 6 (Emissão de Documentos Oficiais)**: Cartões de assistência médica, fichas de inventário e locação, notas do dia, propostas, ordens de serviço, guias de transferência e apresentação, justificações de falta.
7. **Bloco 7 (Relatórios e Estatísticas)**: Relatórios consolidados, estatísticas de recursos humanos e operacionais, e visualizadores analíticos avançados.
8. **Bloco 8 (Módulos Gerais e Projeto Teórico)**: Efetivo escolar, docentes, graduados, disciplinas, funcionários, espaços físicos, fornecedores, eventos, planos individuais e a presente Memória Descritiva.

### 8. METODOLOGIA DE DESENVOLVIMENTO E PERSISTÊNCIA
O desenvolvimento baseou-se em React 18+ com TypeScript, Tailwind CSS e Firebase Firestore para sincronização em tempo real. **Nenhuma informação existente na base de dados (Firestore) pode ser perdida** durante atualizações ou remixes, garantindo migração segura e persistência intacta.

### 9. INDICADORES DE DESEMPENHO (KPIS) E MONITORIA
* **Integridade de Dados**: 100% (sincronização em tempo real sem perda de pacotes).
* **Celeridade UGEA**: -80% no tempo médio de tramitação.
* **Adoção PESOE**: 98% de adesão departamental.
* **Auditoria**: 0 inconsistências reportadas pelo diagnóstico inteligente.

### 10. MATRIZ DE RISCOS E ESTRATÉGIAS DE MITIGAÇÃO
* **Resistência à Mudança (Alto)**: Mitigada através de formação prática e suporte por super-utilizadores.
* **Falhas de Conectividade (Médio)**: Mitigada com cache local e modo offline resiliente.
* **Quebra de Confidencialidade (Crítico)**: Mitigada com RBAC estrito e encriptação ponta-a-ponta.

### 11. SUSTENTABILIDADE, MANUTENÇÃO E ATUALIZAÇÃO
Atualizações automáticas via Cloud e rede descentralizada de formadores locais garantem a autonomia operacional contínua.

### 12. CRONOGRAMA DE IMPLANTAÇÃO
* **Fase 1 (Mês 1-2)**: Configuração de infraestrutura e migração de dados.
* **Fase 2 (Mês 3-4)**: Treino operacional e ativação dos 8 blocos.
* **Fase 3 (Mês 5+)**: Auditoria global e Go-Live definitivo.

### 13. ESTRUTURA ORÇAMENTAL E ROI
Investimento em capital tecnológico com retorno imediato através da eliminação de desperdícios com papel e duplicação de processos.

### 14. ANEXOS E DOCUMENTAÇÃO COMPLEMENTAR
Manuais técnicos, guias de operação dos 8 blocos, relatórios de diagnóstico e certificados de homologação institucional.

### 15. CHECK-LIST DE PRONTIDÃO INSTITUCIONAL
Validação da migração de dados, configuração de papéis RBAC, regras de segurança Firestore, homologação de relatórios e ativação do diagnóstico inteligente.

