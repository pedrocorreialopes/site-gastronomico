# Receitas Saborosas

Site profissional, premium e otimizado para conversão do **Receitas Saborosas** — especialista em experiências gastronômicas com carne bovina, suína, aves, massas, sobremesas, sopas e caldos. Desenvolvido com foco em captar leads para o segmento de Gastronomia e Alimentação no Ceará (CE).

---

## 1. Visão Geral do Projeto

**Nome:** Receitas Saborosas  
**Segmento:** Gastronomia e Alimentação  
**Público-alvo:** Público em geral, 30 a 55 anos, poder aquisitivo médio-alto  
**Região de atendimento:** Fortaleza e Região Metropolitana, CE  
**Objetivo principal:** Captar leads e aumentar a frequência de potenciais clientes  

**Diferencial do site:**
- Design premium com identidade visual elegante (preto, dourado, vinho, branco)
- Tipografia sofisticada: Cormorant Garamond + Montserrat
- Copywriting persuasivo com gatilhos mentais (prova social, escassez, autoridade, reciprocidade, compromisso, urgência, garantia, antecipação de objeções)
- SEO avançado com schema.org (Organization, LocalBusiness, FAQPage, BreadcrumbList)
- Totalmente responsivo (Mobile First) e acessível (WCAG 2.1 AA)

---

## 2. Funcionalidades Implementadas

### 2.1 Estrutura de Páginas / Seções

| Seção | Conteúdo |
|-------|----------|
| **Home** | Hero com headline persuasiva, subheadline, CTAs, prova social resumida e diferenciais |
| **Sobre** | História, missão, visão, valores, equipe e autoridade |
| **Serviços** | Cards detalhados de carnes bovinas, suínas, aves, massas, sobremesas, sopas e caldos com preços |
| **Como Funciona** | Passo a passo estratégico + formulário de captura de leads |
| **Cases** | Cases de sucesso com números e indicadores reais |
| **Depoimentos** | Carrossel de depoimentos em texto + vídeo placeholder |
| **Blog/Recursos** | Artigos com filtro por categoria, busca e newsletter |
| **Contato** | Formulário, WhatsApp, telefone, endereço, mapa e FAQ |

### 2.2 Funcionalidades Interativas

- **Menu mobile** com animação suave e navegação scroll
- **Carrossel de depoimentos** com navegação, dots, autoplay e suporte a touch
- **Calculadora de orçamento** interativa com preços por pessoa, categoria e tipo de serviço
- **Filtro e busca de blog** por categoria e termo de pesquisa
- **FAQ accordion** com acessibilidade (aria-expanded)
- **Formulários de captura** integrados com Table API:
  - Leads (proposta em Como Funciona)
  - Contatos (formulário principal)
  - Newsletter (Blog/Footer)
- **Botão flutuante de WhatsApp** com mensagem pré-definida
- **Modal de vídeo** para depoimento
- **Toast notifications** para feedback ao usuário
- **AOS animations** para revelar elementos ao scroll
- **Lazy loading** de imagens para performance
- **Scroll spy** para destacar item de menu ativo

### 2.3 SEO & Acessibilidade

- HTML5 semântico com heading hierarchy (H1, H2, H3)
- Meta tags Open Graph e Twitter Cards
- Schema.org: Organization, LocalBusiness, BreadcrumbList, FAQPage
- Atributos ARIA (aria-label, aria-expanded, aria-controls)
- Skip to content link
- Foco visível para navegação por teclado
- Textos alternativos (alt) em imagens
- Suporte a `prefers-reduced-motion`

---

## 3. Estrutura de Pastas

```
receitas-saborosas/
├── index.html              # Página principal única (SPA visual)
├── css/
│   └── style.css          # Estilos personalizados e animações
├── js/
│   └── main.js            # JavaScript interativo principal
├── images/                # Pasta reservada para imagens locais (logo, og-image, etc.)
└── README.md              # Documentação do projeto
```

> **Nota:** As imagens atuais são carregadas de URLs externas (Unsplash) para demonstração. Recomenda-se substituir por fotos profissionais do time, produtos e ambiente antes do lançamento oficial.

---

## 4. Tecnologias Utilizadas

- **HTML5** semântico
- **Tailwind CSS** via CDN (estilização utilitária)
- **CSS3** personalizado (animações, gradientes, componentes premium)
- **JavaScript ES6+** modular e vanilla
- **Font Awesome** (ícones)
- **Google Fonts** (Cormorant Garamond + Montserrat)
- **AOS** (Animate On Scroll)

### Integrações via CDN (não requerem backend):
- WhatsApp API (link deep-link)
- Google Maps Embed (iframe)
- Table API RESTful do projeto para persistência de leads

---

## 5. Data Models / Tabelas

O projeto utiliza a Table API RESTful com as seguintes tabelas:

### 5.1 `leads`
Armazena capturas de leads do site.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | text | Identificador único |
| nome | text | Nome do lead |
| email | text | E-mail |
| telefone | text | WhatsApp/Telefone |
| tipo | text | Tipo de conversão (proposta, material, etc.) |
| origem | text | Origem da captura (hero, popup, como-funciona) |
| mensagem | rich_text | Observações |
| status | text | Status (novo, qualificado, convertido, descartado) |
| data_contato | datetime | Data preferida para contato |

### 5.2 `agendamentos`
Reservada para futura funcionalidade de agendamento online.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | text | Identificador único |
| nome | text | Nome do cliente |
| email | text | E-mail |
| telefone | text | Telefone |
| data | datetime | Data do agendamento |
| horario | text | Horário |
| pessoas | number | Número de pessoas |
| tipo_evento | text | Tipo de evento |
| observacoes | rich_text | Observações |

### 5.3 `newsletter`
Inscrições de newsletter e conteúdo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | text | Identificador único |
| nome | text | Nome do inscrito |
| email | text | E-mail |
| origem | text | Origem (blog, footer, popup) |
| tags | array | Tags de interesse |

### 5.4 `contatos`
Mensagens enviadas pelo formulário de contato.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | text | Identificador único |
| nome | text | Nome |
| email | text | E-mail |
| telefone | text | Telefone |
| assunto | text | Assunto |
| mensagem | rich_text | Mensagem |
| tipo | text | Tipo de contato |

---

## 6. APIs e Endpoints

### Table API (uso interno via JavaScript)

```
GET    tables/{table}              # Listar registros
GET    tables/{table}/{id}          # Buscar registro por ID
POST   tables/{table}              # Criar registro
PUT    tables/{table}/{id}          # Atualizar registro completo
PATCH  tables/{table}/{id}          # Atualização parcial
DELETE tables/{table}/{id}          # Remover registro (soft delete)
```

**Exemplo de uso no JavaScript:**
```javascript
const response = await fetch('tables/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(85) 99999-9999',
    tipo: 'proposta',
    origem: 'como-funciona',
    status: 'novo'
  })
});
```

---

## 7. URLs e Páginas

| Página | Caminho | Descrição |
|--------|---------|-----------|
| Home | `/index.html` | Página principal única com todas as seções |
| Seções âncora | `#home`, `#sobre`, `#servicos`, `#como-funciona`, `#cases`, `#depoimentos`, `#blog`, `#contato` | Navegação one-page |

---

## 8. Copywriting e CTAs

- **Headline principal:** "Transforme baixo movimento em resultados reais com Receitas Saborosas"
- **Subheadline:** "Especialistas em Receitas de vários pratos com carne bovina, suína, aves, massas, sobremesas, sopas e caldos etc. Comida saborosa, atendimento VIP, local agradável e familiar, música ambiente. Atendimento em CE."
- **CTA principal:** "Quero uma Proposta"
- **CTA secundário:** "Baixar Material"
- **Diferenciais:** Comida saborosa, atendimento VIP, ambiente familiar, música ambiente
- **Objeções antecipadas:** baixo movimento, dificuldade em se destacar, dependência de delivery apps, falta de reservas online

---

## 9. Identidade Visual

- **Cores:**
  - Preto `#0d0d0d` / `#1a1a1a`
  - Dourado `#c9a227` / `#e5c558`
  - Vinho `#722f37` / `#4a1c22`
  - Branco/Creme `#faf8f3`
  - Vermelho destaque `#c41e3a`
  - Amarelo destaque `#f4b41b`
- **Tipografia:** Cormorant Garamond (títulos) + Montserrat (corpo)
- **Logo:** Sigla "RS" em círculo dourado + nome em serif
- **Estilo:** Elegante, refinado, alto padrão, sensorial e acolhedor

---

## 10. Créditos

**Criado e desenvolvido por Pedro Correia Lopes Filho** — crédito exibido no rodapé do site.

---

## 11. Próximos Passos Recomendados

1. **Substituir imagens de placeholder** por fotos profissionais do restaurante, pratos, equipe e ambiente.
2. **Atualizar dados reais:** telefone, WhatsApp, e-mail, endereço e mapa do Google Business Profile.
3. **Configurar Google Business Profile** e manter NAP consistente (Nome, Endereço, Telefone).
4. **Implementar backend de automação de e-mail** para disparos de boas-vindas e nutrição de leads.
5. **Adicionar sistema de agendamento online** integrado com Google Calendar (usar tabela `agendamentos`).
6. **Implementar gateway de pagamento** para reservas, eventos ou delivery (Pix, cartão, boleto).
7. **Criar blog dinâmico** com CRUD completo de posts via Table API.
8. **Otimizar Core Web Vitals:** converter imagens para WebP/AVIF, adicionar preconnect, lazy loading avançado.
9. **Implementar analytics** para rastrear conversões (Meta Pixel, Google Analytics 4, etc.).
10. **Publicar o site** na aba **Publish** do Genspark para torná-lo acessível online.

---

## 12. Deploy

Para colocar o site no ar, acesse a **aba Publish** no editor do Genspark e clique em **Publicar**. A plataforma fará o deploy automático e fornecerá a URL pública do site.

---

*Última atualização: 31 de julho de 2026*
