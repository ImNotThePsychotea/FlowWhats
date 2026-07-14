# WhatsFlow - SaaS de Automação do WhatsApp

## Visão Geral

WhatsFlow é uma plataforma SaaS completa para automação do WhatsApp Business, projetada para empresários e empresas que desejam automatizar seu atendimento ao cliente via WhatsApp.

## Funcionalidades Principais

- **[Autenticação JWT]**: Sistema de autenticação seguro com tokens JWT e refresh tokens
- **[WhatsApp Service]**: Integração completa com WhatsApp Business API
- **[Flow Builder]**: Construtor visual de fluxos de conversação
- **[Design System]**: Sistema de design consistente e reutilizável
- **[Mercado Pago]**: Integração para pagamentos e assinaturas
- **[Trial de 7 dias]**: Período de teste gratuito para novos usuários
- **[Deploy em Produção]**: Deploy configurado para Vercel (frontend) e Render (backend)
- **[Banco de Dados]**: Supabase como banco de dados principal

## Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** como bundler
- **Tailwind CSS** para styling
- **Radix UI** para componentes acessíveis
- **Zod** para validação de esquemas
- **React Hook Form** para gerenciamento de formulários
- **React Query** para estado do servidor
- **React Router DOM** para roteamento

### Backend
- **Node.js** com **TypeScript**
- **Express.js** como framework web
- **Prisma ORM** para ORM
- **Supabase** como banco de dados PostgreSQL
- **JWT** para autenticação
- **Bcryptjs** para hash de senhas
- **Zod** para validação de dados
- **Express Rate Limit** para rate limiting
- **Helmet** para segurança HTTP
- **CORS** para controle de origens
- **Winston** para logging
- **Winston Daily Rotate File** para rotação de logs

### Infraestrutura
- **Frontend**: Vercel
- **Backend**: Render
- **Banco de Dados**: Supabase (PostgreSQL)
- **Containerização**: Docker e Docker Compose

## Arquitetura

```
whatsflow/
├── backend/              # Backend Node.js/Express
│   ├── src/
│   │   ├── controllers/  # Controladores HTTP
│   │   ├── middleware/   # Middlewares customizados
│   │   ├── models/       # Modelos Prisma
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Lógica de negócio
│   │   ├── utils/        # Utilitários
│   │   ├── validators/   # Validadores Zod
│   │   └── utils/        # Utilitários
│   ├── prisma/           # Schema Prisma e migrations
│   ├── .env              # Variáveis de ambiente
│   ├── Dockerfile        # Dockerfile para produção
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/             # Frontend React/Vite
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilitários e configurações
│   │   ├── styles/       # Estilos globais
│   │   ├── utils/        # Utilitários gerais
│   │   ├── App.tsx       # Componente raiz
│   │   └── main.tsx      # Entry point
│   ├── public/           # Arquivos estáticos
│   ├── index.html        # HTML template
│   ├── vite.config.ts    # Configuração Vite
│   ├── package.json
│   └── tsconfig.json
│
├── infra/                # Infraestrutura como código
│   ├── docker/           # Configurações Docker
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── vercel/           # Configuração Vercel
│   └── render/           # Configuração Render
│
├── docs/                 # Documentação
│   ├── api.md            # Documentação da API
│   ├── architecture.md   # Arquitetura do sistema
│   ├── database.md       # Modelo de dados
│   ├── deployment.md     # Guia de deploy
│   └── security.md       # Guia de segurança
│
├── .gitignore
├── README.md
└── package.json          # Root package (se necessário)
```

## Modelo de Dados (Prisma Schema)

```
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  name          String
  role          Role     @default(USER)
  trialEndsAt   DateTime?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  whatsappAccounts WhatsAppAccount[]
  flows           Flow[]
  payments        Payment[]
}

enum Role {
  ADMIN
  USER
}

model WhatsAppAccount {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  phoneNumber String   @unique
  token       String
  isConnected Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  flows Flow[]
}

model Flow {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  whatsappAccountId String
  whatsappAccount WhatsAppAccount @relation(fields: [whatsappAccountId], references: [id])
  name        String
  description String?
  isActive    Boolean  Boolean @default(true)
  trigger Trigger?
  actions Action[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Trigger {
  id          String   @id @default(uuid())
  flowId      String
  flow        Flow     @relation(fields: [flowId], references: [id])
  type        TriggerType
  config      Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum TriggerType {
  KEYWORD
  TIME_BASED
  MESSAGE_RECEIVED
}

model Action {
  id          String   @id @default(uuid())
  flowId      String
  flow        Flow     @relation(fields: [flowId], references: [id])
  type        ActionType
  config      Json
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ActionType {
  SEND_MESSAGE
  SEND_MEDIA
  SET_ATTRIBUTE
  SEND_TO_OPERATOR
  EXTERNAL_WEBHOOK
}

model Payment {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  amount      Float
  status      PaymentStatus
  gateway     PaymentGateway
  gatewayId   String?
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum PaymentStatus {
  PENDING
  APPROVED
  REJECTED
  REFUNDED
}

enum PaymentGateway {
  MERCADO_PAGO
}
```

## Segurança Implementada

### Autenticação
- **JWT**: Tokens de acesso com expiração curta (15 minutos)
- **Refresh Tokens**: Para renovação de acesso sem reclogin
- **Hash de Senhas**: Bcrypt com salt factor de 12
- **Validação de Dados**: Zod para validação rigorosa de entrada
- **Rate Limiting**: Limitação de taxa por IP e usuário
- **Helmet**: Cabeçalhos de segurança HTTP
- **CORS**: Configuração restrita de origens permitidas
- **Sanitização**: Sanitização de entradas para prevenir XSS e injection

### Criptografia
- **Variáveis de Ambiente**: Armazenadas em .env (não versionadas)
- **Tokens WhatsApp**: Criptografados em repouso usando variáveis de ambiente
- **HTTPS**: Forçado em todas as conexões em produção

### Auditoria e Logs
- **Winston**: Sistema de logging estruturado
- **Rotacionamento Diário**: Logs rotacionados diariamente
- **Níveis de Log**: error, warn, info, debug, verbose
- **Rastreabilidade**: Todos os acessos críticos são logados

### Controle de Acesso
- **RBAC**: Controle de acesso baseado em papéis (ADMIN/USER)
- **Proteção de Rotas**: Middleware de autenticação e autorização
- **Validação de Sessão**: Verificação de tokens em rotas protegidas
- **Limitação de Tentativas**: Bloqueio após tentativas falhas de login

## Variáveis de Ambiente

### Backend (.env)
```
# Variáveis de Ambiente – Backend (.env)
```
URL#=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
JWT_SECRET=your_super_secret_jwt_key_here_minimo_32_caracteres
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here_minimo_32_caracteres
PORT=3000
NODE_ENV=development
BCRYPT_SALT_ROUNDS=12
FRONTEND_URL=http://localhost:5173
```
# Variáveis de Ambiente – Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```
## Variáveis de Ambiente – WhatsApp Service
```
WHATSAPP_API_URL=https://graph.facebook.com/v17.0
WHATSAPP_TOKEN=your_whatsapp_business_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```
## Variáveis de Ambiente – Mercado Pago
```
MERCADO_PAGO_ACCESS_TOKEN=your_mp_access_token
MERCADO_PAGO_PUBLIC_KEY=your_mp_public_key
```

## Instalação e Configuração

### Pré-requisitos
- Node.js >= 18
- npm ou yarn ou pnpm
- Conta no Supabase (banco PostgreSQL)
- Conta no WhatsApp Business API
- Conta no Mercado Pago (para pagamentos)
- Conta no Vercel (para deploy do frontend)
- Conta no Render (para deploy do backend)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <repository-url>
cd whatsflow
```

2. **Configure o Backend**
```bash
cd backend
cp .env.example .env
# Edite o .env com suas variáveis de ambiente
npm install
npx prisma migrate dev --name init
npm run dev
```

3. **Configure o Frontend**
```bash
cd ../frontend
cp .env.example .env
# Edite o .env com suas variáveis de ambiente
npm install
npm run dev
```

4. **Configure o Banco de Dados**
   - Crie um projeto no Supabase
   - Copie a URL de conexão e a chave anon
   - Atualize o arquivo `.env` do backend com essas informações
   - Execute as migrações do Prisma: `npx prisma migrate deploy`

5. **Configure o WhatsApp Business**
   - Configure uma conta no WhatsApp Business API (via Meta Business Suite ou provedor oficial)
   - Obtenha o token de acesso e o Phone Number ID
   - Atualize o arquivo `.env` do backend com essas credenciais

6. **Configure o Mercado Pago**
   - Crie uma conta no Mercado Pago Developers
   - Gere as credenciais de acesso (Access Token e Public Key)
   - Atualize o arquivo `.env` do backend com essas credenciais

### Deploy em Produção

#### Backend (Render)
1. Crie um novo serviço no Render
2. Conecte seu repositório Git
3. Configure o Dockerfile já incluso no projeto
4. Defina as variáveis de ambiente no painel do Render
5. Deploy automático a cada push no branch principal

#### Frontend (Vercel)
1. Importe seu projeto no Vercel
2. Vercel detectará automaticamente que é um projeto Vite
3. Defina as variáveis de ambiente no painel da Vercel
4. Deploy automático a cada push no branch principal

#### Banco de Dados (Supabase)
1. Crie um novo projeto no Supabase
2. Execute o schema SQL gerado pelo Prisma ou use `npx prisma db push`
3. Configure as políticas de segurança (RLS) conforme necessário

### Estrutura de Diretórios Docker

```
whatsflow/
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile
└── ...
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - ./src:/app/src
      - ./prisma:/app/prisma
    depends_on:
      - db
  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=whatsflow
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/refresh` - Renovar token de acesso
- `POST /api/auth/logout` - Logout (invalida refresh token)

### Usuários
- `GET /api/users/me` - Obter dados do usuário logado
- `PUT /api/users/me` - Atualizar dados do usuário
- `GET /api/users` - Listar usuários (admin apenas)

### Contas WhatsApp
- `POST /api/whatsapp-accounts` - Conectar nova conta WhatsApp
- `GET /api/whatsapp-accounts` - Listar contas do usuário
- `GET /api/whatsapp-accounts/:id` - Obter detalhes da conta
- `PUT /api/whatsapp-accounts/:id` - Atualizar conta
- `DELETE /api/whatsapp-accounts/:id` - Desconectar conta
- `POST /api/whatsapp-accounts/:id/send-message` - Enviar mensagem manual

### Fluxos (Flow Builder)
- `POST /api/flows` - Criar novo fluxo
- `GET /api/flows` - Listar fluxos do usuário
- `GET /api/flows/:id` - Obter detalhes do fluxo
- `PUT /api/flows/:id` - Atualizar fluxo
- `DELETE /api/flows/:id` - Deletar fluxo
- `POST /api/flows/:id/activate` - Ativar fluxo
- `POST /api/flows/:id/deactivate` - Desativar fluxo

### Pagamentos
- `POST /api/payments/create-preference` - Criar preferência de pagamento (Mercado Pago)
- `GET /api/payments/:id` - Obter detalhes do pagamento
- `GET /api/payments` - Listar pagamentos do usuário
- `POST /api/payments/webhook` - Webhook do Mercado Pago (endpoint público)

## Guia de Segurança

### 1. Autenticação e Autorização
- Todas as rotas exceto `/api/auth/*` exigem autenticação via JWT
- Senhas são armazenadas usando bcrypt com custo de 12
- Tokens JWT exparam em 15 minutos
- Refresh tokens são armazenados em cookies HttpOnly, Secure e SameSite=Strict
- Implementação de rate limiting (100 requisições/hora por IP)
- Headers de segurança via Helmet (XSS protection, CSP, etc.)

### 2. Proteção de Dados
- Todas as variáveis de ambiente sensíveis são armazenadas em .env (não versionado)
- Tokens do WhatsApp Business são criptografados antes de serem armazenados no banco
- Dados pessoais são protegidos conforme LGPD
- Logs não contêm informações sensíveis (tokens, senhas, etc.)

### 3. Validação de Entrada
- Todas as entradas são validadas usando Zod
- Sanitização de inputs para prevenir XSS e injection
- Validação de tipos e formatos em todas as APIs
- Prevenção contra CSRF através de tokens em formulários e headers em APIs

### 4. Auditoria e Logging
- Todas as ações críticas são logadas (login, logout, criação/modificação de fluxos, pagamentos)
- Logs estruturados com níveis apropriados (error, warn, info, debug)
- Rotação automática de logs diários
- Retenção configurável de logs (padrão: 30 dias)

### 5. Proteção de Dados em Trânsito
- Força uso de HTTPS em todas as conexões em produção
- Habilita HSTS (HTTP Strict Transport Security)
- Configurações seguras de cookies (Secure, HttpOnly, SameSite)

## Fluxo de Trabalho - Flow Builder

### Conceitos-Chave
- **Fluxo**: Sequência de automação acionada por um gatilho
- **Gatilho (Trigger)**: Evento que inicia o fluxo (palavra-chave, horário, mensagem recebida)
- **Ação (Action)**: Etapa executada após o gatilho (enviar mensagem, enviar mídia, definir atributo, etc.)

### Tipos de Gatilhos Suportados
1. **Palavra-Chave**: Quando uma mensagem contem uma palavra específica
2. **Baseado em Tempo**: Executado em horários específicos ou intervalos
3. **Mensagem Recebida**: Quando qualquer mensagem é recebida (filtros opcionais)

### Tipos de Ações Suportadas
1. **Enviar Mensagem**: Texto, emoji, formatação básica
2. **Enviar Mídia**: Imagens, vídeos, documentos, áudio
3. **Definir Atributo**: Armazena informações do contato para uso posterior
4. **Encaminhar para Operador**: Transfere a conversa para um atendente humano
5. **Webhook Externo**: Envia dados para um endpoint externo (integrações)

### Exemplo de Fluxo de Boas-Vindas
1. **Gatilho**: Mensagem recebida contendo "oi" ou "olá"
2. **Ação 1**: Enviar mensagem de boas-vindas
3. **Ação 2**: Definir atributo "visitou" como true
5. **Ação 3**: Aguardar 24 horas
6. **Ação 4**: Enviar lembrete sobre produtos/serviços

## Plano de Testes

### Testes Unitários
- Validadores Zod para cada endpoint
- Funções auxiliares de utilitários
- Serviços de negócio isolados
- Middlewares de autenticação e validação

### Testes de Integração
- Fluxos completos de autenticação (login → acesso a recursos protegidos)
- Criação e gerenciamento de fluxos
- Integração com WhatsApp (mocked)
- Processamento de pagamentos (mocked)

### Testes End-to-End (E2E)
- Fluxo completo de onboarding do usuário
- Criação de fluxo via interface e teste via WhatsApp simulado
- Processo de assinatura e pagamento
- Teste de limites de taxa e bloqueio por tentativas

### Testes de Segurança
- Testes de injeção SQL
- Testes de XSS
- Testes de CSRF
- Testes de força bruta em autenticação
- Verificação de headers de segurança
- Análise de dependências vulneráveis

## Roteiro de Desenvolvimento

### Fase 1: Fundação (Semanas 1-2)
- [x] Estrutura do projeto e documentação
- [x] Configuração do banco de dados (Prisma + Supabase)
- [x] Autenticação JWT com refresh tokens
- [x] Middlewares de segurança (helmet, cors, rate limit)
- [x] Logging estruturado com Winston
- [x] Validação de dados com Zod

### Fase 2: Core Functionality (Semanas 3-4)
- [x] CRUD de usuários
- [x] Integração básica com WhatsApp API (envio de mensagens)
- [x] Modelo de dados para contas WhatsApp
- [x] Endpoints para gerenciamento de contas WhatsApp

### Fase 3: Flow Builder (Semanas 5-6)
- [ ] Modelo de dados para fluxos, gatilhos e ações
- [ ] CRUD de fluxos
- [ ] Interface básica do Flow Builder
- [ ] Gatilhos básicos (palavra-chave, mensagem recebida)
- [ ] Ações básicas (enviar mensagem, enviar mídia)

### Fase 4: Pagamentos e Assinaturas (Semanas 7-8)
- [ ] Integração com Mercado Pago
- [ ] Modelo de pagamento e assinaturas
- [ ] Sistema de trial de 7 dias
- [ ] Webhooks para confirmação de pagamento
- [ ] Controle de acesso baseado em assinatura

### Fase 5: Interface do Usuário (Semanas 9-10)
- [ ] Dashboard principal
- [ ] Página de conexão WhatsApp
- [ ] Construtor visual de fluxos (drag-and-drop)
- [ ] Visualizador de métricas e analytics
- [ ] Página de configurações e perfil

### Fase 6: Testes e Qualidade (Semana 11)
- [ ] Testes unitários e de integração
- [ ] Testes end-to-end com Cypress
- [ ] Auditoría de segurança
- [ ] Otimização de performance
- [ ] Testes de usabilidade

### Fase 7: Deploy e Documentação (Semana 12)
- [ ] Configuração do CI/CD
- [ ] Deploy em produção (Vercel + Render + Supabase)
- [ ] Documentação completa da API
- [ ] Guia de instalação e configuração
- [ ] Manual do usuário final

## Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faça commit de suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

Para suporte, abra uma issue neste repositório ou entre em contato através do email: support@whatsflow.com

---

*WhatsFlow - Automatize seu atendimento no WhatsApp com qualidade empresarial*