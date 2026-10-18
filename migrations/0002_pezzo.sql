-- Pezzo Pizza: ementa, pedidos, stock, ponto, CRM e sugestões.

create table if not exists settings (
  id int primary key,
  name text not null,
  tagline text not null,
  address text not null,
  phones text not null,
  instagram text not null,
  facebook text not null,
  email text not null,
  lat double precision not null,
  lng double precision not null,
  geofence_m int not null,
  hours_label text not null,
  loyalty_every int not null,
  api_key text not null
);

create table if not exists categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  sort int not null
);

create table if not exists ingredients (
  id serial primary key,
  name text not null unique,
  unit text not null,
  stock_qty int not null,
  min_qty int not null,
  portion int not null default 0,
  extra_kz int not null default 0,
  cost_cents int not null default 0,
  active boolean not null default true
);

create table if not exists products (
  id serial primary key,
  category_id int not null references categories(id),
  name text not null,
  slug text not null unique,
  description text not null,
  price_kz int not null,
  active boolean not null default true,
  photo text not null default '',
  custom boolean not null default false,
  sort int not null default 0
);

create table if not exists recipes (
  id serial primary key,
  product_id int not null references products(id),
  ingredient_id int not null references ingredients(id),
  qty int not null,
  unique (product_id, ingredient_id)
);

create table if not exists zones (
  id serial primary key,
  name text not null,
  fee_kz int not null,
  eta_min int not null,
  sort int not null default 0
);

create table if not exists staff (
  id serial primary key,
  name text not null,
  role text not null,
  phone text not null,
  active boolean not null default true
);

create table if not exists customers (
  id serial primary key,
  name text not null,
  phone text not null unique,
  birthday date,
  notes text not null default '',
  allergies text not null default '',
  channel text not null default 'whatsapp',
  opt_in boolean not null default true,
  points int not null default 0,
  pizzas_count int not null default 0,
  address text not null default '',
  landmark text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists coupons (
  id serial primary key,
  code text not null unique,
  label text not null,
  kind text not null,
  value_kz int not null,
  expires_at timestamptz,
  max_uses int not null,
  used int not null default 0,
  active boolean not null default true
);

create table if not exists orders (
  id serial primary key,
  code text not null unique,
  token text not null unique,
  client_ref text unique,
  customer_id int references customers(id),
  customer_name text not null,
  phone text not null,
  channel text not null,
  status text not null,
  payment text not null,
  paid boolean not null default false,
  proof text not null default '',
  address text not null default '',
  landmark text not null default '',
  zone_id int,
  zone_name text not null default '',
  lat double precision not null default 0,
  lng double precision not null default 0,
  delivery_kz int not null default 0,
  subtotal_kz int not null default 0,
  discount_kz int not null default 0,
  total_kz int not null default 0,
  notes text not null default '',
  coupon text not null default '',
  allergy text not null default '',
  courier_id int,
  delivery_code text not null,
  stock_applied boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_phone_idx on orders (phone);

create table if not exists order_items (
  id serial primary key,
  order_id int not null references orders(id),
  product_id int not null,
  name text not null,
  qty int not null,
  unit_kz int not null,
  notes text not null default '',
  extras text not null default ''
);

create table if not exists order_checks (
  id serial primary key,
  order_id int not null references orders(id),
  order_item_id int not null,
  ingredient_id int not null,
  item_name text not null,
  name text not null,
  unit text not null,
  expected_qty int not null,
  actual_qty int not null,
  reason text not null default ''
);

create table if not exists order_events (
  id serial primary key,
  order_id int not null references orders(id),
  status text not null,
  actor text not null,
  at timestamptz not null default now()
);

create table if not exists stock_moves (
  id serial primary key,
  ingredient_id int not null references ingredients(id),
  kind text not null,
  qty int not null,
  cost_kz int not null default 0,
  reason text not null default '',
  actor text not null default '',
  order_id int,
  at timestamptz not null default now()
);

create table if not exists punches (
  id serial primary key,
  staff_id int not null references staff(id),
  kind text not null,
  lat double precision not null,
  lng double precision not null,
  inside boolean not null,
  offline boolean not null default false,
  actor text not null default '',
  at timestamptz not null default now()
);

create table if not exists pings (
  id serial primary key,
  staff_id int not null,
  order_id int not null,
  lat double precision not null,
  lng double precision not null,
  simulated boolean not null default false,
  at timestamptz not null default now()
);

create table if not exists suggestions (
  id serial primary key,
  kind text not null,
  title text not null,
  body text not null,
  audience text not null,
  message text not null,
  status text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id serial primary key,
  type text not null,
  payload text not null,
  at timestamptz not null default now()
);

create table if not exists audit (
  id serial primary key,
  actor text not null,
  action text not null,
  detail text not null,
  at timestamptz not null default now()
);

insert into settings (id, name, tagline, address, phones, instagram, facebook, email, lat, lng, geofence_m, hours_label, loyalty_every, api_key)
values (
  1,
  'Pezzo Pizza',
  'Mais sabor em cada fatia!',
  'Rua Marien Ngouabi, Maianga, Luanda (próximo à Tudor)',
  '+244 924 499 486|+244 924 499 886',
  '@pezzopizzaluanda',
  'Pezzo Pizza',
  'pocketpizza75@gmail.com',
  -8.8264,
  13.2342,
  100,
  'Terça a domingo, 10h00–20h00 · fechado à segunda',
  10,
  'pezzo_demo_luanda_2026'
) on conflict (id) do nothing;

insert into categories (id, name, slug, sort) values
  (1, 'Pocket Pizzas', 'pocket', 1),
  (2, 'Pizzas', 'pizzas', 2),
  (3, 'Hambúrgueres', 'burgers', 3),
  (4, 'Magogas', 'magogas', 4),
  (5, 'Bebidas', 'bebidas', 5)
on conflict (id) do nothing;

insert into ingredients (id, name, unit, stock_qty, min_qty, portion, extra_kz, cost_cents) values
  (1, 'Massa', 'g', 12000, 3000, 280, 0, 200),
  (2, 'Molho de tomate', 'g', 8000, 1500, 90, 0, 100),
  (3, 'Mozzarella', 'g', 6400, 2000, 80, 500, 800),
  (4, 'Fiambre', 'g', 2200, 800, 70, 400, 700),
  (5, 'Ananás', 'g', 1600, 500, 70, 400, 400),
  (6, 'Atum', 'g', 280, 600, 80, 700, 900),
  (7, 'Cebola', 'g', 2800, 400, 40, 200, 150),
  (8, 'Azeitona', 'g', 900, 250, 30, 300, 600),
  (9, 'Pimento', 'g', 1100, 300, 40, 300, 350),
  (10, 'Chouriço', 'g', 1400, 400, 60, 500, 750),
  (11, 'Frango', 'g', 1800, 500, 80, 600, 700),
  (12, 'Milho', 'g', 1200, 300, 50, 300, 250),
  (13, 'Camarão', 'g', 220, 500, 70, 900, 1500),
  (14, 'Bacon', 'g', 700, 250, 40, 600, 900),
  (15, 'Cogumelos', 'g', 600, 200, 40, 400, 500),
  (16, 'Chocolate', 'g', 900, 200, 60, 500, 600),
  (17, 'Banana', 'unidade', 24, 6, 1, 300, 20000),
  (18, 'Leite condensado', 'ml', 1000, 200, 30, 400, 400),
  (19, 'Pão', 'unidade', 36, 12, 1, 0, 25000),
  (20, 'Carne de hambúrguer', 'unidade', 22, 8, 1, 0, 120000),
  (21, 'Alface', 'g', 700, 150, 25, 0, 200),
  (22, 'Molho barbecue', 'ml', 650, 150, 25, 300, 350),
  (23, 'Orégãos', 'g', 180, 40, 2, 0, 400),
  (24, 'Óleo', 'ml', 4000, 800, 0, 0, 150),
  (25, 'Ovo', 'unidade', 48, 16, 1, 200, 8000),
  (26, 'Água 500 ml', 'unidade', 40, 12, 1, 0, 15000),
  (27, 'Refrigerante', 'unidade', 30, 10, 1, 0, 25000),
  (28, 'Sumol', 'unidade', 24, 8, 1, 0, 30000),
  (29, 'Cerveja', 'unidade', 20, 8, 1, 0, 35000)
on conflict (id) do nothing;

insert into products (id, category_id, name, slug, description, price_kz, photo, custom, sort) values
  (1, 1, 'Bela Casa', 'pocket-bela', 'Individual. Molho, mozzarella, fiambre e orégãos — a de casa.', 5000, '/menu/bela.jpg', false, 1),
  (2, 1, 'Aloha', 'pocket-aloha', 'Individual. Fiambre, ananás e mozzarella.', 5500, '/menu/aloha.jpg', false, 2),
  (3, 1, 'Sweet', 'pocket-sweet', 'Individual. Frango, milho doce e mozzarella.', 6000, '/menu/doce.jpg', false, 3),
  (4, 1, 'Pezzo', 'pocket-pezzo', 'Individual. Chouriço, pimento, azeitona e mozzarella.', 6000, '/menu/pezzo.jpg', false, 4),
  (5, 2, 'Bela Casa', 'pizza-bela', '8 fatias. Molho, mozzarella, fiambre e orégãos.', 10500, '/menu/bela.jpg', false, 1),
  (6, 2, 'Aloha', 'pizza-aloha', '8 fatias. Fiambre, ananás e mozzarella.', 12500, '/menu/aloha.jpg', false, 2),
  (7, 2, 'Pezzo', 'pizza-pezzo', '8 fatias. A assinatura: chouriço, pimento e azeitona.', 13500, '/menu/pezzo.jpg', false, 3),
  (8, 2, 'Atum', 'pizza-atum', '8 fatias. Atum, cebola roxa, azeitona e orégãos.', 14500, '/menu/atum.jpg', false, 4),
  (9, 2, 'O de Sempre', 'pizza-sempre', '8 fatias. Mozzarella generosa e fiambre. Sem surpresas.', 15000, '/menu/bela.jpg', false, 5),
  (10, 2, 'Amor Perfeito', 'pizza-amor', '8 fatias. Frango, milho e mozzarella cremosa.', 15000, '/menu/aloha.jpg', false, 6),
  (11, 2, 'Doce Vitá', 'pizza-doce', '8 fatias doces. Chocolate, banana e leite condensado.', 15000, '/menu/doce.jpg', false, 7),
  (12, 2, '4 Estações', 'pizza-estacoes', '8 fatias em quatro cantos: fiambre, pimento, cogumelos e azeitona.', 16000, '/menu/estacoes.jpg', false, 8),
  (13, 2, 'Mar', 'pizza-mar', '8 fatias. Camarão, atum e orégãos.', 16000, '/menu/mar.jpg', false, 9),
  (14, 3, 'Pezzo Burger', 'burger', 'Hambúrguer, queijo, alface e molho da casa.', 4500, '/menu/burger.jpg', false, 1),
  (15, 4, 'Magoga normal', 'magoga', 'Pão crocante, ovo, fiambre e salada.', 2000, '/menu/magoga.jpg', false, 1),
  (16, 4, 'Magoga com barbecue', 'magoga-bbq', 'A magoga tradicional com molho barbecue.', 2500, '/menu/magoga.jpg', false, 2),
  (17, 2, 'Cria a tua pizza', 'cria-a-tua', 'Base com molho e mozzarella. Junta os ingredientes que quiseres.', 7500, '/menu/pezzo.jpg', true, 20),
  (18, 5, 'Água 500 ml', 'agua', 'Água sem gás, bem fresca.', 300, '', false, 1),
  (19, 5, 'Refrigerante', 'refri', 'Lata ou garrafa, conforme o stock do dia.', 500, '', false, 2),
  (20, 5, 'Sumol', 'sumol', 'Sumol gelado.', 600, '', false, 3),
  (21, 5, 'Cerveja', 'cerveja', 'Cerveja gelada.', 700, '', false, 4)
on conflict (id) do nothing;

insert into recipes (product_id, ingredient_id, qty) values
  (1, 1, 150), (1, 2, 45), (1, 3, 70), (1, 4, 45), (1, 23, 1),
  (2, 1, 150), (2, 2, 45), (2, 3, 65), (2, 4, 40), (2, 5, 40),
  (3, 1, 150), (3, 2, 40), (3, 3, 60), (3, 11, 50), (3, 12, 30),
  (4, 1, 150), (4, 2, 45), (4, 3, 65), (4, 10, 40), (4, 9, 25), (4, 8, 15),
  (5, 1, 280), (5, 2, 90), (5, 3, 120), (5, 4, 80), (5, 23, 2),
  (6, 1, 280), (6, 2, 90), (6, 3, 110), (6, 4, 70), (6, 5, 80),
  (7, 1, 280), (7, 2, 90), (7, 3, 120), (7, 10, 70), (7, 9, 40), (7, 8, 25),
  (8, 1, 280), (8, 2, 90), (8, 3, 110), (8, 6, 90), (8, 7, 40), (8, 8, 20), (8, 23, 2),
  (9, 1, 280), (9, 2, 80), (9, 3, 160), (9, 4, 70),
  (10, 1, 280), (10, 2, 70), (10, 3, 120), (10, 11, 90), (10, 12, 50),
  (11, 1, 260), (11, 16, 80), (11, 17, 2), (11, 18, 40),
  (12, 1, 280), (12, 2, 90), (12, 3, 120), (12, 4, 40), (12, 9, 30), (12, 15, 30), (12, 8, 20),
  (13, 1, 280), (13, 2, 90), (13, 3, 100), (13, 13, 70), (13, 6, 50), (13, 23, 2),
  (14, 19, 1), (14, 20, 1), (14, 3, 30), (14, 21, 25), (14, 2, 15),
  (15, 19, 1), (15, 25, 1), (15, 4, 40), (15, 21, 15),
  (16, 19, 1), (16, 25, 1), (16, 4, 40), (16, 22, 25),
  (17, 1, 280), (17, 2, 90), (17, 3, 100),
  (18, 26, 1), (19, 27, 1), (20, 28, 1), (21, 29, 1)
on conflict (product_id, ingredient_id) do nothing;

insert into zones (id, name, fee_kz, eta_min, sort) values
  (1, 'Levantamento na loja', 0, 15, 1),
  (2, 'Maianga', 500, 25, 2),
  (3, 'Ingombota / Baixa', 800, 30, 3),
  (4, 'Samba / Maculusso', 1000, 35, 4),
  (5, 'Kilamba', 1500, 45, 5),
  (6, 'Talatona', 2000, 50, 6),
  (7, 'Viana', 1800, 45, 7)
on conflict (id) do nothing;

insert into staff (id, name, role, phone) values
  (1, 'Ana Tavares', 'admin', '+244923000001'),
  (2, 'Miguel Sousa', 'gerente', '+244923000002'),
  (3, 'Carla Kapingana', 'cozinha', '+244923000003'),
  (4, 'João Muongo', 'estafeta', '+244923000004'),
  (5, 'Sílvia Domingos', 'estafeta', '+244923000005')
on conflict (id) do nothing;

insert into customers (id, name, phone, birthday, notes, allergies, channel, opt_in, points, pizzas_count, address, landmark, created_at) values
  (1, 'Edna Duran', '+244923100001', null, 'Pede quase sempre a Bela Casa.', '', 'whatsapp', true, 4200, 16, 'Maianga', 'Próximo à Tudor', now() - interval '120 days'),
  (2, 'Orlogar Silva', '+244923100002', null, 'Vem do Instagram.', '', 'instagram', true, 1100, 6, 'Samba', 'Perto da rotunda', now() - interval '80 days'),
  (3, 'Marta Kapingana', '+244923100003', (now() at time zone 'Africa/Luanda')::date + 1, 'A 10.ª pizza está quase.', 'Camarão', 'whatsapp', true, 1680, 9, 'Rua Marien Ngouabi, Maianga', 'Próximo à Tudor', now() - interval '60 days'),
  (4, 'Pedro Muongo', '+244922100004', null, 'Deixou de pedir. Vale a pena um toque.', '', 'telefone', true, 200, 2, 'Viana', 'Depois da paragem', now() - interval '200 days'),
  (5, 'Aisha Neto', '+244923100005', null, 'Primeira encomenda pela app.', '', 'app', true, 66, 1, 'Ingombota', 'Em frente à igreja', now() - interval '2 days'),
  (6, 'Paulo Gomes', '+244924100006', null, 'Liga na hora do almoço.', '', 'telefone', false, 0, 0, 'Samba', 'Junto ao quiosque azul', now() - interval '1 day')
on conflict (id) do nothing;

insert into coupons (id, code, label, kind, value_kz, expires_at, max_uses, used, active) values
  (1, 'PEZZO10', '10% na conta', 'percent', 10, now() + interval '60 days', 200, 4, true),
  (2, 'MAGOGA500', '500 Kz na magoga', 'fixo', 500, now() + interval '30 days', 80, 1, true),
  (3, 'ANIV', '20% de aniversário', 'percent', 20, now() + interval '90 days', 50, 0, true),
  (4, 'MAIANGA', 'Entrega grátis no Maianga', 'entrega', 0, now() + interval '20 days', 40, 2, true)
on conflict (id) do nothing;

insert into orders (
  id, code, token, client_ref, customer_id, customer_name, phone, channel, status, payment, paid,
  address, landmark, zone_id, zone_name, lat, lng, delivery_kz, subtotal_kz, discount_kz, total_kz,
  notes, coupon, allergy, courier_id, delivery_code, stock_applied, created_at
) values
  (1, 'PP-2401', 't-ed-2401', 'seed-1', 1, 'Edna Duran', '+244923100001', 'whatsapp', 'entregue', 'dinheiro', true,
    'Maianga', 'Próximo à Tudor', 2, 'Maianga', -8.8302, 13.2401, 500, 11000, 0, 11500,
    '', '', '', 4, '1842', true, now() - interval '3 hours'),
  (2, 'PP-2402', 't-ai-2402', 'seed-2', 5, 'Aisha Neto', '+244923100005', 'app', 'preparacao', 'multicaixa', false,
    'Ingombota, Rua da Missão', 'Em frente à igreja', 3, 'Ingombota / Baixa', -8.8145, 13.2355, 800, 5800, 0, 6600,
    'Sem cebola, se tiver.', '', '', null, '2204', false, now() - interval '28 minutes'),
  (3, 'PP-2403', 't-pa-2403', 'seed-3', 6, 'Paulo Gomes', '+244924100006', 'telefone', 'recebido', 'dinheiro', false,
    'Samba', 'Junto ao quiosque azul', 4, 'Samba / Maculusso', -8.849, 13.228, 1000, 2500, 0, 3500,
    'Para levar molho à parte.', '', '', null, '3391', false, now() - interval '10 minutes'),
  (4, 'PP-2404', 'demo-quente', 'seed-4', 3, 'Marta Kapingana', '+244923100003', 'instagram', 'entrega', 'multicaixa', false,
    'Rua Marien Ngouabi, Maianga', 'Próximo à Tudor', 2, 'Maianga', -8.8382, 13.2485, 500, 16000, 0, 16500,
    '', '', 'Camarão', 4, '4821', true, now() - interval '18 minutes'),
  (5, 'PP-2405', 't-or-2405', 'seed-5', 2, 'Orlogar Silva', '+244923100002', 'balcao', 'pronto', 'tpa', false,
    'Levantamento na loja', 'Balcão', 1, 'Levantamento na loja', -8.8264, 13.2342, 0, 4500, 0, 4500,
    '', '', '', null, '5550', true, now() - interval '35 minutes'),
  (6, 'PP-2398', 't-ed-2398', 'seed-6', 1, 'Edna Duran', '+244923100001', 'whatsapp', 'entregue', 'transferencia', true,
    'Maianga', 'Próximo à Tudor', 2, 'Maianga', -8.8302, 13.2401, 500, 13500, 0, 14000,
    'Comprovativo já visto.', '', '', 5, '6712', true, now() - interval '1 day'),
  (7, 'PP-2390', 't-pe-2390', 'seed-7', 4, 'Pedro Muongo', '+244922100004', 'telefone', 'entregue', 'dinheiro', true,
    'Viana', 'Depois da paragem', 7, 'Viana', -8.9, 13.31, 1800, 14500, 0, 16300,
    '', '', '', 4, '9090', true, now() - interval '40 days'),
  (8, 'PP-2394', 't-ma-2394', 'seed-8', 3, 'Marta Kapingana', '+244923100003', 'whatsapp', 'entregue', 'dinheiro', true,
    'Rua Marien Ngouabi, Maianga', 'Próximo à Tudor', 2, 'Maianga', -8.8382, 13.2485, 500, 6000, 0, 6500,
    '', '', 'Camarão', 5, '4141', true, now() - interval '6 days'),
  (9, 'PP-2396', 't-ed-2396', 'seed-9', 1, 'Edna Duran', '+244923100001', 'balcao', 'entregue', 'dinheiro', true,
    'Levantamento na loja', 'Balcão', 1, 'Levantamento na loja', -8.8264, 13.2342, 0, 11000, 0, 11000,
    '', '', '', null, '1212', true, now() - interval '5 hours'),
  (10, 'PP-2388', 't-or-2388', 'seed-10', 2, 'Orlogar Silva', '+244923100002', 'instagram', 'entregue', 'tpa', true,
    'Samba', 'Perto da rotunda', 4, 'Samba / Maculusso', -8.849, 13.228, 1000, 15000, 0, 16000,
    '', '', '', 5, '8088', true, now() - interval '16 days')
on conflict (id) do nothing;

insert into order_items (id, order_id, product_id, name, qty, unit_kz, notes, extras) values
  (1, 1, 5, 'Bela Casa', 1, 10500, '', ''),
  (2, 1, 19, 'Refrigerante', 1, 500, '', ''),
  (3, 2, 2, 'Aloha', 1, 5500, 'Sem cebola, se tiver.', ''),
  (4, 2, 18, 'Água 500 ml', 1, 300, '', ''),
  (5, 3, 16, 'Magoga com barbecue', 1, 2500, 'Molho à parte.', ''),
  (6, 4, 13, 'Mar', 1, 16000, '', ''),
  (7, 5, 14, 'Pezzo Burger', 1, 4500, '', ''),
  (8, 6, 7, 'Pezzo', 1, 13500, '', ''),
  (9, 7, 8, 'Atum', 1, 14500, '', ''),
  (10, 8, 4, 'Pezzo', 1, 6000, '', ''),
  (11, 9, 1, 'Bela Casa', 1, 5000, '', ''),
  (12, 9, 3, 'Sweet', 1, 6000, '', ''),
  (13, 10, 10, 'Amor Perfeito', 1, 15000, '', '')
on conflict (id) do nothing;

insert into order_checks (order_id, order_item_id, ingredient_id, item_name, name, unit, expected_qty, actual_qty, reason) values
  (2, 3, 1, 'Aloha', 'Massa', 'g', 150, 150, ''),
  (2, 3, 2, 'Aloha', 'Molho de tomate', 'g', 45, 45, ''),
  (2, 3, 3, 'Aloha', 'Mozzarella', 'g', 65, 65, ''),
  (2, 3, 4, 'Aloha', 'Fiambre', 'g', 40, 40, ''),
  (2, 3, 5, 'Aloha', 'Ananás', 'g', 40, 40, ''),
  (2, 4, 26, 'Água 500 ml', 'Água 500 ml', 'unidade', 1, 1, ''),
  (3, 5, 19, 'Magoga com barbecue', 'Pão', 'unidade', 1, 1, ''),
  (3, 5, 25, 'Magoga com barbecue', 'Ovo', 'unidade', 1, 1, ''),
  (3, 5, 4, 'Magoga com barbecue', 'Fiambre', 'g', 40, 40, ''),
  (3, 5, 22, 'Magoga com barbecue', 'Molho barbecue', 'ml', 25, 25, '');

insert into order_events (order_id, status, actor, at) values
  (1, 'recebido', 'WhatsApp', now() - interval '3 hours 20 minutes'),
  (1, 'preparacao', 'Carla Kapingana', now() - interval '3 hours 10 minutes'),
  (1, 'pronto', 'Carla Kapingana', now() - interval '2 hours 50 minutes'),
  (1, 'entrega', 'João Muongo', now() - interval '2 hours 40 minutes'),
  (1, 'entregue', 'João Muongo', now() - interval '2 hours 10 minutes'),
  (2, 'recebido', 'App', now() - interval '28 minutes'),
  (2, 'preparacao', 'Carla Kapingana', now() - interval '20 minutes'),
  (3, 'recebido', 'Miguel Sousa', now() - interval '10 minutes'),
  (4, 'recebido', 'Instagram', now() - interval '40 minutes'),
  (4, 'preparacao', 'Carla Kapingana', now() - interval '34 minutes'),
  (4, 'pronto', 'Carla Kapingana', now() - interval '22 minutes'),
  (4, 'entrega', 'João Muongo', now() - interval '18 minutes'),
  (5, 'recebido', 'Balcão', now() - interval '50 minutes'),
  (5, 'preparacao', 'Carla Kapingana', now() - interval '45 minutes'),
  (5, 'pronto', 'Carla Kapingana', now() - interval '35 minutes'),
  (6, 'entregue', 'Sílvia Domingos', now() - interval '1 day'),
  (7, 'entregue', 'João Muongo', now() - interval '40 days'),
  (8, 'entregue', 'Sílvia Domingos', now() - interval '6 days'),
  (9, 'entregue', 'Carla Kapingana', now() - interval '5 hours'),
  (10, 'entregue', 'Sílvia Domingos', now() - interval '16 days');

insert into pings (staff_id, order_id, lat, lng, simulated, at) values
  (4, 4, -8.8324, 13.2412, true, now() - interval '1 minute');

insert into punches (staff_id, kind, lat, lng, inside, offline, actor, at) values
  (1, 'entrada', -8.8264, 13.2342, true, false, 'Ana Tavares', now() - interval '3 hours'),
  (2, 'entrada', -8.8264, 13.2342, true, false, 'Miguel Sousa', now() - interval '150 minutes'),
  (3, 'entrada', -8.8264, 13.2342, true, false, 'Carla Kapingana', now() - interval '170 minutes'),
  (4, 'entrada', -8.8264, 13.2342, true, false, 'João Muongo', now() - interval '160 minutes');

insert into stock_moves (ingredient_id, kind, qty, cost_kz, reason, actor, at) values
  (3, 'entrada', 2000, 16000, 'Compra no mercado do Kinaxixi', 'Miguel Sousa', now() - interval '2 days'),
  (5, 'quebra', -180, 0, 'Ananás maduro demais', 'Carla Kapingana', now() - interval '1 day');

insert into suggestions (kind, title, body, audience, message, status, source) values
  (
    'em risco',
    'O Orlogar está a arrefecer',
    'O último pedido do Orlogar Silva foi há mais de duas semanas, quase sempre pelo Instagram. Um toque com a Amor Perfeito costuma trazê-lo de volta.',
    'Orlogar Silva',
    'Olá Orlogar, a Pezzo sente a tua falta. Hoje a Amor Perfeito sai com 10% — é só responder a esta mensagem. Até já!',
    'pendente',
    'equipa'
  ),
  (
    'stock',
    'Camarão e atum no limite',
    'O camarão e o atum estão abaixo do mínimo. Ou se compra hoje, ou a pizza Mar sai da montra até chegar mercadoria.',
    'Cozinha e gestão',
    '',
    'pendente',
    'equipa'
  ),
  (
    'aniversario',
    'Amanhã é o dia da Marta',
    'A Marta faz anos amanhã, tem alergia a camarão e está na 9.ª pizza. A 10.ª já é oferta — combina com uma mensagem, sem Mar.',
    'Marta Kapingana',
    'Marta, amanhã é o teu dia e a Pezzo oferece a próxima pizza (a 10.ª). Sem camarão, como gostas. Muitos anos!',
    'pendente',
    'equipa'
  ),
  (
    'dia_fraco',
    'Terça da Pocket',
    'Segunda a loja fecha e terça costuma arrancar devagar. Uma Pocket + refrigerante a um preço redondo enche a cozinha no almoço.',
    'Clientes com opt-in',
    'Terça da Pocket na Pezzo: individual + refrigerante por 5.500 Kz, só amanhã das 11h às 15h. Queres que reserve?',
    'pendente',
    'equipa'
  );

insert into events (type, payload) values
  ('order.created', '{"code":"PP-2403","canal":"telefone"}'),
  ('order.delivered', '{"code":"PP-2401"}'),
  ('stock.low', '{"ingrediente":"Atum"}'),
  ('stock.low', '{"ingrediente":"Camarão"}');

insert into audit (actor, action, detail) values
  ('Sistema', 'arranque', 'Ementa, fichas e equipa de demonstração carregadas.');

select setval('categories_id_seq', (select max(id) from categories));
select setval('ingredients_id_seq', (select max(id) from ingredients));
select setval('products_id_seq', (select max(id) from products));
select setval('zones_id_seq', (select max(id) from zones));
select setval('staff_id_seq', (select max(id) from staff));
select setval('customers_id_seq', (select max(id) from customers));
select setval('coupons_id_seq', (select max(id) from coupons));
select setval('orders_id_seq', (select max(id) from orders));
select setval('order_items_id_seq', (select max(id) from order_items));
