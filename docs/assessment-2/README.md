# Assessment 2 – Requisitos e Casos de Uso (CMS)

Equipa G04, MEEC. EIS 2026/27, FEUP. Versão de 29/09/2026.

Ficheiros desta pasta:

- `README.md`: este documento (requisitos, casos de uso, pesquisa e layout das páginas)
- `use-case-diagram.drawio`: diagrama de casos de uso (abrir em [app.diagrams.net](https://app.diagrams.net))
- `wireframes.drawio`: wireframes de referência das páginas Login, Home, Courier e Admin
- `esbocos/`: fotografias dos esboços em papel (por acrescentar)

## Enquadramento

O Assessment 2 é a fase inicial do projeto de grupo do Courier Management System (CMS): definir requisitos, casos de uso e layout das páginas antes de programar. Este documento cobre as três partes pedidas: 1.1 requisitos e casos de uso, 1.2.1 pesquisa de sistemas reais e 1.2.2 esboços das páginas.

Os nomes técnicos ficam em inglês, como no enunciado do Sprint 1 e no relatório final.

## 1.1 Requisitos de negócio

O CMS tem 27 requisitos funcionais distribuídos pelos cinco atores e 10 não funcionais. Os marcados com (extra) vão além do enunciado e são propostas do grupo.

### Requisitos funcionais

| ID | Ator | Requisito (o sistema deve…) |
| --- | --- | --- |
| RF01 | Visitor | Mostrar uma página inicial com métricas públicas e destaques do serviço |
| RF02 | Visitor | Permitir o registo de novos utilizadores com escolha de papel (Client, Courier ou Staff); Courier e Staff ficam pendentes até serem validados |
| RF03 | Visitor | Mostrar a página da equipa com nome, número de estudante, email, curso e número do grupo |
| RF04 | Todos | Permitir login e logout e redirecionar cada utilizador para a página do seu papel |
| RF05 | Todos | Permitir editar os dados pessoais (nome, email, telefone, NIF) |
| RF06 | Client | Permitir registar produtos com descrição, categoria, peso (kg) e volume (m³) |
| RF07 | Client | Permitir criar uma encomenda com um ou mais produtos e coordenadas GPS de origem e destino |
| RF08 | Client | Mostrar um mapa Leaflet/OpenStreetMap no formulário de encomenda com os marcadores de origem e destino |
| RF09 | Client | Mostrar o estado atual das encomendas ativas |
| RF10 | Client | Mostrar o histórico de encomendas concluídas |
| RF11 | Courier | Permitir registar veículos com matrícula, modelo, tipo, capacidade e documentos de seguro e inspeção |
| RF12 | Courier | Permitir selecionar o veículo ativo para uma encomenda |
| RF13 | Courier | Impedir a atribuição de uma encomenda a um veículo sem capacidade de peso ou volume suficiente |
| RF14 | Courier | Limitar o estafeta a uma encomenda ativa de cada vez, exceto quando consolida várias numa rota |
| RF15 | Courier | Permitir consolidar várias encomendas ativas numa única rota |
| RF16 | Courier | Permitir mudar o estado só pela ordem Initiated → In Progress → Completed/Cancelled |
| RF17 | Courier | Exigir uma prova de entrega (assinatura em Canvas ou foto) ao concluir uma encomenda |
| RF18 | Courier | Devolver uma encomenda cancelada à lista de encomendas disponíveis e incrementar o número de tentativas |
| RF19 | Courier | Mostrar a encomenda ativa num mapa Leaflet/OpenStreetMap |
| RF20 | Courier | Mostrar a lista de encomendas concluídas |
| RF21 | Staff | Listar contas de estafetas pendentes e permitir aprová-las ou rejeitá-las |
| RF22 | Staff | Listar veículos pendentes e permitir aprová-los depois de verificar seguro e inspeção |
| RF23 | Staff | Mostrar alertas visuais quando um documento de veículo expira ou é atualizado |
| RF24 | Staff | Impedir o uso de veículos não aprovados ou com documentos expirados |
| RF25 | Admin | Listar membros do staff pendentes e permitir aprová-los |
| RF26 | Admin | Mostrar um dashboard com KPIs: nº de clientes, estafetas, staff e encomendas/rotas por estado |
| RF27 | Admin | (extra) Mostrar gráficos de evolução das entregas e taxa de cancelamento |

### Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF01 | Frontend em HTML5, CSS3 e JavaScript, sem frameworks obrigatórios |
| RNF02 | Design responsivo, utilizável em computador e telemóvel |
| RNF03 | Hierarquia visual profissional e navegação consistente entre todas as páginas |
| RNF04 | Validação em JavaScript: campos obrigatórios vazios bloqueiam o envio e mostram erro |
| RNF05 | Validação numérica de coordenadas: latitude entre -90 e 90, longitude entre -180 e 180 |
| RNF06 | Mapas com a biblioteca Leaflet.js e mosaicos OpenStreetMap |
| RNF07 | Funcionar nas versões atuais do Chrome, Safari e Firefox |
| RNF08 | Controlo de versões em Git/GitHub com o repositório EIS_2627-G04_MEEC e commits de todos os membros |
| RNF09 | Palavras-passe guardadas apenas como hash (password_hash) |
| RNF10 | Dados de teste incluídos no protótipo para demonstrar cada página |

## 1.1 Atores e casos de uso

O sistema tem cinco atores principais e 28 casos de uso. Client, Courier, Staff e Admin herdam de um ator abstrato User, que concentra Login, Logout e Edit personal information. O diagrama está em `use-case-diagram.drawio`.

### Atores

| Ator | Descrição |
| --- | --- |
| Visitor | Qualquer pessoa sem sessão iniciada |
| User | Ator abstrato: qualquer utilizador autenticado |
| Client | Pede entregas, regista produtos e acompanha encomendas |
| Courier | Estafeta; gere veículos e executa entregas |
| Staff | Backoffice; valida estafetas e veículos |
| Admin | Valida staff e consulta o dashboard de KPIs |

### Casos de uso

| ID | Caso de uso | Ator | Requisitos |
| --- | --- | --- | --- |
| UC01 | View home page | Visitor | RF01 |
| UC02 | Register | Visitor | RF02 |
| UC03 | View team page | Visitor | RF03 |
| UC04 | Login | User | RF04 |
| UC05 | Logout | User | RF04 |
| UC06 | Edit personal information | User | RF05 |
| UC07 | Register product | Client | RF06 |
| UC08 | Create order | Client | RF07 |
| UC09 | Set origin/destination (GPS + map) | Client | RF07, RF08 |
| UC10 | View active order status | Client | RF09 |
| UC11 | View order history | Client | RF10 |
| UC12 | Register vehicle | Courier | RF11 |
| UC13 | Upload insurance & inspection docs | Courier | RF11 |
| UC14 | Select vehicle for order | Courier | RF12, RF13 |
| UC15 | Accept order | Courier | RF14 |
| UC16 | Consolidate orders into route | Courier | RF15 |
| UC17 | Update order status | Courier | RF16 |
| UC18 | Submit proof of delivery (e-POD) | Courier | RF17 |
| UC19 | Draw signature (Canvas) | Courier | RF17 |
| UC20 | Upload delivery photo | Courier | RF17 |
| UC21 | Cancel delivery | Courier | RF18 |
| UC22 | View active order on map | Courier | RF19 |
| UC23 | View completed orders | Courier | RF20 |
| UC24 | Validate courier account | Staff | RF21 |
| UC25 | Approve vehicle | Staff | RF22, RF24 |
| UC26 | Receive document alert | Staff | RF23 |
| UC27 | Validate staff account | Admin | RF25 |
| UC28 | View KPI dashboard | Admin | RF26, RF27 |

### Relações entre casos de uso

| Relação | Origem → Destino | Significado |
| --- | --- | --- |
| include | Create order → Set origin/destination | Toda a encomenda tem origem e destino |
| include | Register vehicle → Upload insurance & inspection docs | Um veículo só fica registado com os documentos |
| include | Update order status → Submit proof of delivery | Obrigatório ao passar para Completed |
| extend | Consolidate orders into route → Accept order | Só quando o estafeta junta várias encomendas |
| extend | Cancel delivery → Update order status | Só quando a entrega não se concretiza |
| extend | Receive document alert → Approve vehicle | Só quando um documento expira ou é atualizado |
| generalização | Draw signature / Upload delivery photo → Submit proof of delivery | Duas formas de fazer o e-POD |
| generalização | Client, Courier, Staff, Admin → User | Os quatro papéis são utilizadores autenticados |

Regra das setas: no include a seta parte do caso base; no extend parte do caso opcional.

## 1.2.1 Pesquisa de sistemas reais

Os três sistemas analisados seguem o mesmo padrão: um dashboard web para quem gere, uma app para o estafeta e uma página de seguimento para o cliente, sempre com mapa e prova de entrega por foto ou assinatura. O CMS pode copiar esta divisão e simplificá-la para um protótipo estático.

| Sistema | O que faz | Ideia a adotar no CMS |
| --- | --- | --- |
| [Onfleet](https://www.getapp.com/transportation-logistics-software/a/onfleet/) | Gestão de entregas last-mile com dashboard de despacho, apps para estafetas e seguimento em tempo real para o cliente | Mapa central no painel com destinos e estafetas; alertas e notificações; separar claramente a vista de quem gere da vista do estafeta |
| [Shipday](https://www.shipday.com/features/proof-of-delivery) | Despacho automático, seguimento ao vivo e prova de entrega com foto, assinatura e hora | e-POD com foto ou assinatura e registo da hora; histórico de entregas fácil de consultar; estados sequenciais visíveis para o estafeta |
| [Track-POD](https://www.track-pod.com/route-planning-software) | Planeamento de rotas tendo em conta o tipo de veículo, a carga e os horários | Verificar peso e volume da encomenda contra a capacidade do veículo; juntar várias paragens numa rota |

O que vale a pena levar para as páginas do CMS:

- **Página do Courier:** lista de estados em passos (Initiated → In Progress → Completed), mapa em destaque e botão grande para a prova de entrega.
- **Página do Client:** estado atual da encomenda bem visível no topo, com o histórico por baixo.
- **Staff e Admin:** cartões de KPI no topo, tabelas com filtros e cores para alertas (vermelho = expirado, amarelo = a expirar).

Pesquisa feita em 29/09/2026 a partir das páginas públicas e de sites de avaliação destes produtos.

## 1.2.2 Esboços das páginas

Todas as páginas partilham o mesmo esqueleto: barra de navegação no topo (logo, menu, login ou nome do utilizador) e rodapé com o link para a página da equipa. Os wireframes de referência estão em `wireframes.drawio`; o enunciado pede que os esboços sejam desenhados à mão, em papel (fotografias em `esbocos/`).

| Página | Zonas do layout (de cima para baixo) |
| --- | --- |
| Login / Register | Cartão centrado com separadores Login e Register; campos username e password; no registo, nome, email, telefone, NIF e escolha do papel; mensagens de erro por baixo de cada campo |
| Home | Banner com título e botão "Criar conta"; 4 cartões de métricas (entregas feitas, estafetas ativos, clientes, taxa de sucesso); 3 blocos de destaques do serviço |
| Client | Menu lateral (Nova encomenda, Produtos, Encomendas ativas, Histórico); formulário com lat/long de origem e destino ao lado do mapa Leaflet; tabela de encomendas com etiqueta de estado |
| Courier | Seletor do veículo ativo no topo; mapa grande com a encomenda ativa; barra de estados em passos com os botões seguintes; zona de e-POD (Canvas de assinatura ou upload de foto); lista de concluídas |
| Página de objeto (estafeta ou cliente) | Cabeçalho com nome, papel e estado da conta; dados pessoais; tabela de veículos (estafeta) ou de encomendas (cliente) |
| Staff | Cartões com contagem de pendentes e alertas; tabela de estafetas pendentes; tabela de veículos com datas de seguro e inspeção coloridas; botões Aprovar e Rejeitar |
| Admin / Dashboard | Linha de cartões KPI (clientes, estafetas, staff, encomendas por estado); gráfico de barras de encomendas por estado; gráfico de linha de entregas por semana; tabela de staff pendente |
| Team | Grelha de cartões, um por membro: nome, número de estudante, email institucional, curso e número do grupo |
