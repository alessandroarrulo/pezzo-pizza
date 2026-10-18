# Prompt para o Grok Build: App de gestão da Pezzo Pizza (Luanda)

## 1. Contexto e objetivo
Constrói uma plataforma completa de gestão para a **Pezzo Pizza**, uma pizzaria de delivery em Luanda, Angola. O objetivo é mostrar como uma pizzaria pode ser gerida de forma moderna com o apoio de agentes de IA (Grok Bot) e dos seus conectores. A plataforma tem quatro aplicações que partilham o mesmo backend:

1. **App do Cliente** (PWA web + mobile): fazer encomendas e seguir o estafeta em tempo real.
2. **App do Funcionário** (mobile, Android primeiro): receber pedidos, confirmar ingredientes e quantidades, registar stock e picar o ponto (entrada/saída).
3. **App do Estafeta** (mobile): aceitar entregas e partilhar a localização GPS.
4. **Painel de Administração** (web, responsivo): relatórios, stock, assiduidade, CRM e promoções com IA.

Idioma da interface: **português (variante de Angola)**. Moeda: **Kwanza (Kz / AOA)**, formato `10.500 Kz`. Fuso horário: `Africa/Luanda`.

## 2. Dados do negócio
- Nome: Pezzo Pizza ("Mais sabor em cada fatia!", "O melhor delivery da cidade!", "Sabor que chega até si!")
- Morada: Rua Marien Ngouabi, Maianga, Luanda (próximo à Tudor)
- Horário: terça a domingo, 10h00 às 20h00 (fechado à segunda)
- Telefones / WhatsApp: +244 924 499 486 e +244 924 499 886 (ambos ativos; permitir vários números de contacto configuráveis pelo admin)
- Instagram: @pezzopizzaluanda · Facebook: Pezzo Pizza
- Email da administração: pocketpizza75@gmail.com
- Identidade visual: usa o logótipo anexo. Paleta: amarelo-laranja `#FFB300`, laranja `#FF8F00`, vermelho tomate `#D32F2F`, castanho-bordô `#6D0F0F`, branco. Tipografia arredondada e forte (ex.: Fredoka ou Baloo 2 nos títulos, Inter no texto). Estilo alegre, moderno e apetitoso.

## 3. Menu inicial (carregar como dados semente)
**Pocket Pizzas (individual)**
- Bela Casa: 5.000 Kz
- Aloha: 5.500 Kz
- Sweet: 6.000 Kz
- Pezzo: 6.000 Kz

**Pizzas (8 fatias)**
- Bela Casa: 10.500 Kz
- Aloha: 12.500 Kz
- Pezzo: 13.500 Kz
- Atum: 14.500 Kz
- O de Sempre: 15.000 Kz
- Amor Perfeito: 15.000 Kz
- Doce Vitá: 15.000 Kz
- 4 Estações: 16.000 Kz
- Mar: 16.000 Kz

**Hambúrgueres**
- Pezzo Burger: 4.500 Kz

**Magoga (sandes)**
- Magoga Normal / Tradicional: 2.000 Kz
- Magoga com Molho Barbecue: 2.500 Kz

**Cria a tua própria pizza**: o cliente escolhe a base e os ingredientes; cada ingrediente extra tem preço próprio.

O admin tem de poder criar, editar, desativar e pôr fotos em produtos, categorias (pizzas, pocket pizzas, hambúrgueres, sandes/magogas, bebidas, extras) e preços. Os ingredientes de cada receita ainda não são conhecidos: cria fichas técnicas vazias que o admin preenche.

## 4. Módulos e funcionalidades

### 4.1 Fichas técnicas e confirmação de ingredientes (núcleo da app)
- Cada produto tem uma **ficha técnica**: lista de ingredientes com quantidade e unidade (g, ml, unidade, fatia) por tamanho.
- Quando entra um pedido, o funcionário abre o cartão do pedido na cozinha e vê a receita com uma **checklist**: confirma cada ingrediente e a quantidade usada (pode ajustar se usou mais ou menos e indicar o motivo, ex.: "pedido sem cebola").
- Ao concluir, o stock é **abatido automaticamente** com as quantidades confirmadas.
- Estados do pedido: Recebido → Em preparação → Pronto → Saiu para entrega → Entregue (ou Cancelado), cada um com hora e funcionário.
- Vista de cozinha (tipo KDS) em ecrã grande ou tablet, com temporizador por pedido e alerta sonoro para novos pedidos.

### 4.2 Encomendas multicanal
- **WhatsApp (canal principal em Angola)**: integração com a WhatsApp Business Platform (Cloud API) com catálogo e um assistente que recebe o pedido, confirma itens, morada e pagamento, e cria o pedido no sistema. Os pedidos manuais recebidos por WhatsApp também podem ser introduzidos pelo funcionário em segundos.
- **App/PWA do cliente**: link na bio do Instagram e no WhatsApp; menu com fotos, carrinho, "cria a tua pizza", favoritos, repetir último pedido.
- **Instagram**: botão "Encomendar" e link na bio a abrir a PWA; opcionalmente receber pedidos por DM via Instagram Messaging API.
- **Telefone/balcão**: o funcionário regista o pedido rapidamente.
- Todos os canais caem numa **fila única de pedidos**, com o canal de origem identificado.
- Morada com pin no mapa e ponto de referência (muito usado em Luanda, ex.: "próximo à Tudor").
- Pagamentos: dinheiro na entrega, TPA/cartão na entrega, Multicaixa Express e transferência bancária (com upload do comprovativo). Estrutura preparada para adicionar um gateway de pagamento online mais tarde.
- Taxa de entrega configurável por zona/distância e tempo estimado de entrega.

### 4.3 Tracking do estafeta
- App do estafeta envia a localização GPS enquanto tem uma entrega ativa.
- O cliente recebe um **link de tracking** (por WhatsApp/SMS e na app) com mapa em tempo real, estado do pedido e tempo estimado, sem precisar de conta.
- O estafeta confirma a entrega (foto ou código de 4 dígitos dado pelo cliente) e regista o pagamento recebido.
- Admin vê todos os estafetas no mapa.

### 4.4 Stock
- Registo de entradas (compras/fornecedores, com custo), saídas automáticas (pedidos) e saídas manuais (desperdício, quebra, consumo interno) com motivo.
- Contagem física periódica pelo funcionário com comparação entre stock teórico e real.
- Alertas de stock mínimo por ingrediente (notificação ao admin e sugestão de compra).
- Relatórios: stock atual, movimentos por período, desperdício, custo por produto (food cost) e margem.

### 4.5 Assiduidade (picar o ponto)
- Na app do funcionário, um botão grande "Entrar" / "Sair" (e pausas).
- Regista hora, **geolocalização** e valida que está dentro de um raio configurável da pizzaria (geofence, ex.: 100 m). Opcional: selfie no momento do registo.
- Funciona sem internet (guarda a hora do dispositivo e a localização e sincroniza depois, com marcação "registado offline").
- Relatórios para o admin: horas trabalhadas por funcionário, atrasos, faltas, horas extra, exportação para Excel/PDF.

### 4.6 CRM de clientes
- Ficha de cliente criada automaticamente a partir do número de WhatsApp/telefone: nome, moradas, aniversário, preferências, alergias, canal preferido.
- Histórico de pedidos, valor total gasto, ticket médio, frequência, produto favorito, último pedido.
- Segmentos automáticos: novos, frequentes, VIP, em risco (sem pedir há X dias), inativos.
- Programa de fidelização simples (ex.: pontos ou "a 10.ª pizza é oferta").
- Consentimento (opt-in) para receber promoções e opção de sair a qualquer momento.

### 4.7 Promoções e IA (integração com Grok Bot / agentes)
- Expor uma **API REST segura + webhooks** (eventos: novo pedido, pedido entregue, stock baixo, cliente inativo) para que agentes de IA externos possam ler dados e propor ações.
- O agente analisa o consumo e sugere: promoções para clientes inativos, combos com base no que se vende junto, campanhas em dias fracos, produtos a promover quando há excesso de stock, mensagens de aniversário.
- O admin vê as sugestões num painel "Sugestões da IA", edita e **aprova antes de enviar**. Nada é enviado automaticamente sem aprovação.
- Envio por WhatsApp (modelos aprovados pela Meta) e, opcionalmente, notificações push na app; agendamento de campanhas e métricas (enviadas, lidas, pedidos gerados, receita gerada).
- Gestão de cupões e códigos promocionais com validade e limites.

### 4.8 Painel de administração
- Dashboard do dia: vendas, nº de pedidos, ticket médio, pedidos por canal, produtos mais vendidos, tempo médio de preparação e entrega, funcionários presentes, alertas de stock.
- Relatórios por período com gráficos e exportação Excel/PDF.
- Gestão de utilizadores e perfis: Administrador, Gerente, Cozinha/Balcão, Estafeta, Cliente, com permissões por perfil.
- Registo de auditoria (quem alterou o quê e quando).

## 5. Funcionamento offline (obrigatório)
- Arquitetura **offline-first** nas apps do funcionário e do estafeta: base de dados local no dispositivo (ex.: SQLite), todas as ações funcionam sem internet.
- Fila de sincronização: quando a ligação volta, envia automaticamente todos os dados (pedidos, confirmações de ingredientes, stock, picagens de ponto, localizações) para o servidor e descarrega as atualizações (menu, preços, receitas).
- Resolução de conflitos (ex.: última alteração ganha, com registo; para stock, somar movimentos em vez de sobrescrever).
- Indicador claro na interface: "Online", "Offline: X registos por sincronizar", "Sincronizado às 14:32".
- Otimizado para rede móvel fraca e telemóveis Android de gama média: imagens comprimidas e pouco consumo de dados.

## 6. UI/UX
- Interface moderna, limpa e divertida, alinhada com a marca (amarelo/laranja/vermelho), botões grandes e fáceis de tocar com as mãos ocupadas na cozinha.
- Para motivar o uso pelos funcionários: ecrãs com poucos passos, feedback visual e sonoro, pequenas conquistas (ex.: "50 pedidos sem erro esta semana"), ranking amigável opcional e resumo do turno.
- Para a administração: dashboards claros, cartões com números grandes e gráficos simples.
- Modo escuro opcional para a cozinha.
- Acessível: contraste alto, texto legível, ícones com legenda.

## 7. Stack técnica sugerida (podes propor melhor)
- Mobile: React Native (Expo) ou Flutter, com base de dados local e sincronização.
- Cliente: PWA (Next.js) instalável a partir do link do Instagram/WhatsApp.
- Backend: Node.js ou Supabase (PostgreSQL, autenticação, armazenamento, realtime para tracking e fila de pedidos).
- Mapas: Google Maps ou Mapbox.
- Notificações: push (FCM) e WhatsApp Business Cloud API.
- Segurança: autenticação por perfil, HTTPS, senhas encriptadas, chaves de API em variáveis de ambiente (nunca no código), backups diários.

## 8. Entregáveis
1. Modelo de dados (entidades e relações) e arquitetura antes de começar a programar.
2. As quatro aplicações funcionais com os dados semente do menu acima.
3. Utilizadores de demonstração para cada perfil.
4. Documentação de instalação, configuração (WhatsApp, mapas, geofence) e da API para os agentes de IA.
5. Plano por fases: **Fase 1 (MVP)** pedidos + fichas técnicas + stock + ponto + offline; **Fase 2** tracking + CRM + PWA do cliente; **Fase 3** integração WhatsApp completa + promoções com IA + fidelização.

Anexos: logótipo, preçário e captura do perfil de Instagram (@pezzopizzaluanda).
