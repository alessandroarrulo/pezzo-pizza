import { f as meters, o as diaChave, p as normPhone } from "./format-C5Rj_BD_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service.server-Cn8oBB9z.js
var _0002_pezzo_default = "-- Pezzo Pizza: ementa, pedidos, stock, ponto, CRM e sugestões.\n\ncreate table if not exists settings (\n  id int primary key,\n  name text not null,\n  tagline text not null,\n  address text not null,\n  phones text not null,\n  instagram text not null,\n  facebook text not null,\n  email text not null,\n  lat double precision not null,\n  lng double precision not null,\n  geofence_m int not null,\n  hours_label text not null,\n  loyalty_every int not null,\n  api_key text not null\n);\n\ncreate table if not exists categories (\n  id serial primary key,\n  name text not null,\n  slug text not null unique,\n  sort int not null\n);\n\ncreate table if not exists ingredients (\n  id serial primary key,\n  name text not null unique,\n  unit text not null,\n  stock_qty int not null,\n  min_qty int not null,\n  portion int not null default 0,\n  extra_kz int not null default 0,\n  cost_cents int not null default 0,\n  active boolean not null default true\n);\n\ncreate table if not exists products (\n  id serial primary key,\n  category_id int not null references categories(id),\n  name text not null,\n  slug text not null unique,\n  description text not null,\n  price_kz int not null,\n  active boolean not null default true,\n  photo text not null default '',\n  custom boolean not null default false,\n  sort int not null default 0\n);\n\ncreate table if not exists recipes (\n  id serial primary key,\n  product_id int not null references products(id),\n  ingredient_id int not null references ingredients(id),\n  qty int not null,\n  unique (product_id, ingredient_id)\n);\n\ncreate table if not exists zones (\n  id serial primary key,\n  name text not null,\n  fee_kz int not null,\n  eta_min int not null,\n  sort int not null default 0\n);\n\ncreate table if not exists staff (\n  id serial primary key,\n  name text not null,\n  role text not null,\n  phone text not null,\n  active boolean not null default true\n);\n\ncreate table if not exists customers (\n  id serial primary key,\n  name text not null,\n  phone text not null unique,\n  birthday date,\n  notes text not null default '',\n  allergies text not null default '',\n  channel text not null default 'whatsapp',\n  opt_in boolean not null default true,\n  points int not null default 0,\n  pizzas_count int not null default 0,\n  address text not null default '',\n  landmark text not null default '',\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists coupons (\n  id serial primary key,\n  code text not null unique,\n  label text not null,\n  kind text not null,\n  value_kz int not null,\n  expires_at timestamptz,\n  max_uses int not null,\n  used int not null default 0,\n  active boolean not null default true\n);\n\ncreate table if not exists orders (\n  id serial primary key,\n  code text not null unique,\n  token text not null unique,\n  client_ref text unique,\n  customer_id int references customers(id),\n  customer_name text not null,\n  phone text not null,\n  channel text not null,\n  status text not null,\n  payment text not null,\n  paid boolean not null default false,\n  proof text not null default '',\n  address text not null default '',\n  landmark text not null default '',\n  zone_id int,\n  zone_name text not null default '',\n  lat double precision not null default 0,\n  lng double precision not null default 0,\n  delivery_kz int not null default 0,\n  subtotal_kz int not null default 0,\n  discount_kz int not null default 0,\n  total_kz int not null default 0,\n  notes text not null default '',\n  coupon text not null default '',\n  allergy text not null default '',\n  courier_id int,\n  delivery_code text not null,\n  stock_applied boolean not null default false,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate index if not exists orders_status_idx on orders (status);\ncreate index if not exists orders_phone_idx on orders (phone);\n\ncreate table if not exists order_items (\n  id serial primary key,\n  order_id int not null references orders(id),\n  product_id int not null,\n  name text not null,\n  qty int not null,\n  unit_kz int not null,\n  notes text not null default '',\n  extras text not null default ''\n);\n\ncreate table if not exists order_checks (\n  id serial primary key,\n  order_id int not null references orders(id),\n  order_item_id int not null,\n  ingredient_id int not null,\n  item_name text not null,\n  name text not null,\n  unit text not null,\n  expected_qty int not null,\n  actual_qty int not null,\n  reason text not null default ''\n);\n\ncreate table if not exists order_events (\n  id serial primary key,\n  order_id int not null references orders(id),\n  status text not null,\n  actor text not null,\n  at timestamptz not null default now()\n);\n\ncreate table if not exists stock_moves (\n  id serial primary key,\n  ingredient_id int not null references ingredients(id),\n  kind text not null,\n  qty int not null,\n  cost_kz int not null default 0,\n  reason text not null default '',\n  actor text not null default '',\n  order_id int,\n  at timestamptz not null default now()\n);\n\ncreate table if not exists punches (\n  id serial primary key,\n  staff_id int not null references staff(id),\n  kind text not null,\n  lat double precision not null,\n  lng double precision not null,\n  inside boolean not null,\n  offline boolean not null default false,\n  actor text not null default '',\n  at timestamptz not null default now()\n);\n\ncreate table if not exists pings (\n  id serial primary key,\n  staff_id int not null,\n  order_id int not null,\n  lat double precision not null,\n  lng double precision not null,\n  simulated boolean not null default false,\n  at timestamptz not null default now()\n);\n\ncreate table if not exists suggestions (\n  id serial primary key,\n  kind text not null,\n  title text not null,\n  body text not null,\n  audience text not null,\n  message text not null,\n  status text not null,\n  source text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists events (\n  id serial primary key,\n  type text not null,\n  payload text not null,\n  at timestamptz not null default now()\n);\n\ncreate table if not exists audit (\n  id serial primary key,\n  actor text not null,\n  action text not null,\n  detail text not null,\n  at timestamptz not null default now()\n);\n\ninsert into settings (id, name, tagline, address, phones, instagram, facebook, email, lat, lng, geofence_m, hours_label, loyalty_every, api_key)\nvalues (\n  1,\n  'Pezzo Pizza',\n  'Mais sabor em cada fatia!',\n  'Rua Marien Ngouabi, Maianga, Luanda (próximo à Tudor)',\n  '+244 924 499 486|+244 924 499 886',\n  '@pezzopizzaluanda',\n  'Pezzo Pizza',\n  'pocketpizza75@gmail.com',\n  -8.8264,\n  13.2342,\n  100,\n  'Terça a domingo, 10h00–20h00 · fechado à segunda',\n  10,\n  'pezzo_demo_luanda_2026'\n) on conflict (id) do nothing;\n\ninsert into categories (id, name, slug, sort) values\n  (1, 'Pocket Pizzas', 'pocket', 1),\n  (2, 'Pizzas', 'pizzas', 2),\n  (3, 'Hambúrgueres', 'burgers', 3),\n  (4, 'Magogas', 'magogas', 4),\n  (5, 'Bebidas', 'bebidas', 5)\non conflict (id) do nothing;\n\ninsert into ingredients (id, name, unit, stock_qty, min_qty, portion, extra_kz, cost_cents) values\n  (1, 'Massa', 'g', 12000, 3000, 280, 0, 200),\n  (2, 'Molho de tomate', 'g', 8000, 1500, 90, 0, 100),\n  (3, 'Mozzarella', 'g', 6400, 2000, 80, 500, 800),\n  (4, 'Fiambre', 'g', 2200, 800, 70, 400, 700),\n  (5, 'Ananás', 'g', 1600, 500, 70, 400, 400),\n  (6, 'Atum', 'g', 280, 600, 80, 700, 900),\n  (7, 'Cebola', 'g', 2800, 400, 40, 200, 150),\n  (8, 'Azeitona', 'g', 900, 250, 30, 300, 600),\n  (9, 'Pimento', 'g', 1100, 300, 40, 300, 350),\n  (10, 'Chouriço', 'g', 1400, 400, 60, 500, 750),\n  (11, 'Frango', 'g', 1800, 500, 80, 600, 700),\n  (12, 'Milho', 'g', 1200, 300, 50, 300, 250),\n  (13, 'Camarão', 'g', 220, 500, 70, 900, 1500),\n  (14, 'Bacon', 'g', 700, 250, 40, 600, 900),\n  (15, 'Cogumelos', 'g', 600, 200, 40, 400, 500),\n  (16, 'Chocolate', 'g', 900, 200, 60, 500, 600),\n  (17, 'Banana', 'unidade', 24, 6, 1, 300, 20000),\n  (18, 'Leite condensado', 'ml', 1000, 200, 30, 400, 400),\n  (19, 'Pão', 'unidade', 36, 12, 1, 0, 25000),\n  (20, 'Carne de hambúrguer', 'unidade', 22, 8, 1, 0, 120000),\n  (21, 'Alface', 'g', 700, 150, 25, 0, 200),\n  (22, 'Molho barbecue', 'ml', 650, 150, 25, 300, 350),\n  (23, 'Orégãos', 'g', 180, 40, 2, 0, 400),\n  (24, 'Óleo', 'ml', 4000, 800, 0, 0, 150),\n  (25, 'Ovo', 'unidade', 48, 16, 1, 200, 8000),\n  (26, 'Água 500 ml', 'unidade', 40, 12, 1, 0, 15000),\n  (27, 'Refrigerante', 'unidade', 30, 10, 1, 0, 25000),\n  (28, 'Sumol', 'unidade', 24, 8, 1, 0, 30000),\n  (29, 'Cerveja', 'unidade', 20, 8, 1, 0, 35000)\non conflict (id) do nothing;\n\ninsert into products (id, category_id, name, slug, description, price_kz, photo, custom, sort) values\n  (1, 1, 'Bela Casa', 'pocket-bela', 'Individual. Molho, mozzarella, fiambre e orégãos — a de casa.', 5000, '/menu/bela.jpg', false, 1),\n  (2, 1, 'Aloha', 'pocket-aloha', 'Individual. Fiambre, ananás e mozzarella.', 5500, '/menu/aloha.jpg', false, 2),\n  (3, 1, 'Sweet', 'pocket-sweet', 'Individual. Frango, milho doce e mozzarella.', 6000, '/menu/doce.jpg', false, 3),\n  (4, 1, 'Pezzo', 'pocket-pezzo', 'Individual. Chouriço, pimento, azeitona e mozzarella.', 6000, '/menu/pezzo.jpg', false, 4),\n  (5, 2, 'Bela Casa', 'pizza-bela', '8 fatias. Molho, mozzarella, fiambre e orégãos.', 10500, '/menu/bela.jpg', false, 1),\n  (6, 2, 'Aloha', 'pizza-aloha', '8 fatias. Fiambre, ananás e mozzarella.', 12500, '/menu/aloha.jpg', false, 2),\n  (7, 2, 'Pezzo', 'pizza-pezzo', '8 fatias. A assinatura: chouriço, pimento e azeitona.', 13500, '/menu/pezzo.jpg', false, 3),\n  (8, 2, 'Atum', 'pizza-atum', '8 fatias. Atum, cebola roxa, azeitona e orégãos.', 14500, '/menu/atum.jpg', false, 4),\n  (9, 2, 'O de Sempre', 'pizza-sempre', '8 fatias. Mozzarella generosa e fiambre. Sem surpresas.', 15000, '/menu/bela.jpg', false, 5),\n  (10, 2, 'Amor Perfeito', 'pizza-amor', '8 fatias. Frango, milho e mozzarella cremosa.', 15000, '/menu/aloha.jpg', false, 6),\n  (11, 2, 'Doce Vitá', 'pizza-doce', '8 fatias doces. Chocolate, banana e leite condensado.', 15000, '/menu/doce.jpg', false, 7),\n  (12, 2, '4 Estações', 'pizza-estacoes', '8 fatias em quatro cantos: fiambre, pimento, cogumelos e azeitona.', 16000, '/menu/estacoes.jpg', false, 8),\n  (13, 2, 'Mar', 'pizza-mar', '8 fatias. Camarão, atum e orégãos.', 16000, '/menu/mar.jpg', false, 9),\n  (14, 3, 'Pezzo Burger', 'burger', 'Hambúrguer, queijo, alface e molho da casa.', 4500, '/menu/burger.jpg', false, 1),\n  (15, 4, 'Magoga normal', 'magoga', 'Pão crocante, ovo, fiambre e salada.', 2000, '/menu/magoga.jpg', false, 1),\n  (16, 4, 'Magoga com barbecue', 'magoga-bbq', 'A magoga tradicional com molho barbecue.', 2500, '/menu/magoga.jpg', false, 2),\n  (17, 2, 'Cria a tua pizza', 'cria-a-tua', 'Base com molho e mozzarella. Junta os ingredientes que quiseres.', 7500, '/menu/pezzo.jpg', true, 20),\n  (18, 5, 'Água 500 ml', 'agua', 'Água sem gás, bem fresca.', 300, '', false, 1),\n  (19, 5, 'Refrigerante', 'refri', 'Lata ou garrafa, conforme o stock do dia.', 500, '', false, 2),\n  (20, 5, 'Sumol', 'sumol', 'Sumol gelado.', 600, '', false, 3),\n  (21, 5, 'Cerveja', 'cerveja', 'Cerveja gelada.', 700, '', false, 4)\non conflict (id) do nothing;\n\ninsert into recipes (product_id, ingredient_id, qty) values\n  (1, 1, 150), (1, 2, 45), (1, 3, 70), (1, 4, 45), (1, 23, 1),\n  (2, 1, 150), (2, 2, 45), (2, 3, 65), (2, 4, 40), (2, 5, 40),\n  (3, 1, 150), (3, 2, 40), (3, 3, 60), (3, 11, 50), (3, 12, 30),\n  (4, 1, 150), (4, 2, 45), (4, 3, 65), (4, 10, 40), (4, 9, 25), (4, 8, 15),\n  (5, 1, 280), (5, 2, 90), (5, 3, 120), (5, 4, 80), (5, 23, 2),\n  (6, 1, 280), (6, 2, 90), (6, 3, 110), (6, 4, 70), (6, 5, 80),\n  (7, 1, 280), (7, 2, 90), (7, 3, 120), (7, 10, 70), (7, 9, 40), (7, 8, 25),\n  (8, 1, 280), (8, 2, 90), (8, 3, 110), (8, 6, 90), (8, 7, 40), (8, 8, 20), (8, 23, 2),\n  (9, 1, 280), (9, 2, 80), (9, 3, 160), (9, 4, 70),\n  (10, 1, 280), (10, 2, 70), (10, 3, 120), (10, 11, 90), (10, 12, 50),\n  (11, 1, 260), (11, 16, 80), (11, 17, 2), (11, 18, 40),\n  (12, 1, 280), (12, 2, 90), (12, 3, 120), (12, 4, 40), (12, 9, 30), (12, 15, 30), (12, 8, 20),\n  (13, 1, 280), (13, 2, 90), (13, 3, 100), (13, 13, 70), (13, 6, 50), (13, 23, 2),\n  (14, 19, 1), (14, 20, 1), (14, 3, 30), (14, 21, 25), (14, 2, 15),\n  (15, 19, 1), (15, 25, 1), (15, 4, 40), (15, 21, 15),\n  (16, 19, 1), (16, 25, 1), (16, 4, 40), (16, 22, 25),\n  (17, 1, 280), (17, 2, 90), (17, 3, 100),\n  (18, 26, 1), (19, 27, 1), (20, 28, 1), (21, 29, 1)\non conflict (product_id, ingredient_id) do nothing;\n\ninsert into zones (id, name, fee_kz, eta_min, sort) values\n  (1, 'Levantamento na loja', 0, 15, 1),\n  (2, 'Maianga', 500, 25, 2),\n  (3, 'Ingombota / Baixa', 800, 30, 3),\n  (4, 'Samba / Maculusso', 1000, 35, 4),\n  (5, 'Kilamba', 1500, 45, 5),\n  (6, 'Talatona', 2000, 50, 6),\n  (7, 'Viana', 1800, 45, 7)\non conflict (id) do nothing;\n\ninsert into staff (id, name, role, phone) values\n  (1, 'Ana Tavares', 'admin', '+244923000001'),\n  (2, 'Miguel Sousa', 'gerente', '+244923000002'),\n  (3, 'Carla Kapingana', 'cozinha', '+244923000003'),\n  (4, 'João Muongo', 'estafeta', '+244923000004'),\n  (5, 'Sílvia Domingos', 'estafeta', '+244923000005')\non conflict (id) do nothing;\n\ninsert into customers (id, name, phone, birthday, notes, allergies, channel, opt_in, points, pizzas_count, address, landmark, created_at) values\n  (1, 'Edna Duran', '+244923100001', null, 'Pede quase sempre a Bela Casa.', '', 'whatsapp', true, 4200, 16, 'Maianga', 'Próximo à Tudor', now() - interval '120 days'),\n  (2, 'Orlogar Silva', '+244923100002', null, 'Vem do Instagram.', '', 'instagram', true, 1100, 6, 'Samba', 'Perto da rotunda', now() - interval '80 days'),\n  (3, 'Marta Kapingana', '+244923100003', (now() at time zone 'Africa/Luanda')::date + 1, 'A 10.ª pizza está quase.', 'Camarão', 'whatsapp', true, 1680, 9, 'Rua Marien Ngouabi, Maianga', 'Próximo à Tudor', now() - interval '60 days'),\n  (4, 'Pedro Muongo', '+244922100004', null, 'Deixou de pedir. Vale a pena um toque.', '', 'telefone', true, 200, 2, 'Viana', 'Depois da paragem', now() - interval '200 days'),\n  (5, 'Aisha Neto', '+244923100005', null, 'Primeira encomenda pela app.', '', 'app', true, 66, 1, 'Ingombota', 'Em frente à igreja', now() - interval '2 days'),\n  (6, 'Paulo Gomes', '+244924100006', null, 'Liga na hora do almoço.', '', 'telefone', false, 0, 0, 'Samba', 'Junto ao quiosque azul', now() - interval '1 day')\non conflict (id) do nothing;\n\ninsert into coupons (id, code, label, kind, value_kz, expires_at, max_uses, used, active) values\n  (1, 'PEZZO10', '10% na conta', 'percent', 10, now() + interval '60 days', 200, 4, true),\n  (2, 'MAGOGA500', '500 Kz na magoga', 'fixo', 500, now() + interval '30 days', 80, 1, true),\n  (3, 'ANIV', '20% de aniversário', 'percent', 20, now() + interval '90 days', 50, 0, true),\n  (4, 'MAIANGA', 'Entrega grátis no Maianga', 'entrega', 0, now() + interval '20 days', 40, 2, true)\non conflict (id) do nothing;\n\ninsert into orders (\n  id, code, token, client_ref, customer_id, customer_name, phone, channel, status, payment, paid,\n  address, landmark, zone_id, zone_name, lat, lng, delivery_kz, subtotal_kz, discount_kz, total_kz,\n  notes, coupon, allergy, courier_id, delivery_code, stock_applied, created_at\n) values\n  (1, 'PP-2401', 't-ed-2401', 'seed-1', 1, 'Edna Duran', '+244923100001', 'whatsapp', 'entregue', 'dinheiro', true,\n    'Maianga', 'Próximo à Tudor', 2, 'Maianga', -8.8302, 13.2401, 500, 11000, 0, 11500,\n    '', '', '', 4, '1842', true, now() - interval '3 hours'),\n  (2, 'PP-2402', 't-ai-2402', 'seed-2', 5, 'Aisha Neto', '+244923100005', 'app', 'preparacao', 'multicaixa', false,\n    'Ingombota, Rua da Missão', 'Em frente à igreja', 3, 'Ingombota / Baixa', -8.8145, 13.2355, 800, 5800, 0, 6600,\n    'Sem cebola, se tiver.', '', '', null, '2204', false, now() - interval '28 minutes'),\n  (3, 'PP-2403', 't-pa-2403', 'seed-3', 6, 'Paulo Gomes', '+244924100006', 'telefone', 'recebido', 'dinheiro', false,\n    'Samba', 'Junto ao quiosque azul', 4, 'Samba / Maculusso', -8.849, 13.228, 1000, 2500, 0, 3500,\n    'Para levar molho à parte.', '', '', null, '3391', false, now() - interval '10 minutes'),\n  (4, 'PP-2404', 'demo-quente', 'seed-4', 3, 'Marta Kapingana', '+244923100003', 'instagram', 'entrega', 'multicaixa', false,\n    'Rua Marien Ngouabi, Maianga', 'Próximo à Tudor', 2, 'Maianga', -8.8382, 13.2485, 500, 16000, 0, 16500,\n    '', '', 'Camarão', 4, '4821', true, now() - interval '18 minutes'),\n  (5, 'PP-2405', 't-or-2405', 'seed-5', 2, 'Orlogar Silva', '+244923100002', 'balcao', 'pronto', 'tpa', false,\n    'Levantamento na loja', 'Balcão', 1, 'Levantamento na loja', -8.8264, 13.2342, 0, 4500, 0, 4500,\n    '', '', '', null, '5550', true, now() - interval '35 minutes'),\n  (6, 'PP-2398', 't-ed-2398', 'seed-6', 1, 'Edna Duran', '+244923100001', 'whatsapp', 'entregue', 'transferencia', true,\n    'Maianga', 'Próximo à Tudor', 2, 'Maianga', -8.8302, 13.2401, 500, 13500, 0, 14000,\n    'Comprovativo já visto.', '', '', 5, '6712', true, now() - interval '1 day'),\n  (7, 'PP-2390', 't-pe-2390', 'seed-7', 4, 'Pedro Muongo', '+244922100004', 'telefone', 'entregue', 'dinheiro', true,\n    'Viana', 'Depois da paragem', 7, 'Viana', -8.9, 13.31, 1800, 14500, 0, 16300,\n    '', '', '', 4, '9090', true, now() - interval '40 days'),\n  (8, 'PP-2394', 't-ma-2394', 'seed-8', 3, 'Marta Kapingana', '+244923100003', 'whatsapp', 'entregue', 'dinheiro', true,\n    'Rua Marien Ngouabi, Maianga', 'Próximo à Tudor', 2, 'Maianga', -8.8382, 13.2485, 500, 6000, 0, 6500,\n    '', '', 'Camarão', 5, '4141', true, now() - interval '6 days'),\n  (9, 'PP-2396', 't-ed-2396', 'seed-9', 1, 'Edna Duran', '+244923100001', 'balcao', 'entregue', 'dinheiro', true,\n    'Levantamento na loja', 'Balcão', 1, 'Levantamento na loja', -8.8264, 13.2342, 0, 11000, 0, 11000,\n    '', '', '', null, '1212', true, now() - interval '5 hours'),\n  (10, 'PP-2388', 't-or-2388', 'seed-10', 2, 'Orlogar Silva', '+244923100002', 'instagram', 'entregue', 'tpa', true,\n    'Samba', 'Perto da rotunda', 4, 'Samba / Maculusso', -8.849, 13.228, 1000, 15000, 0, 16000,\n    '', '', '', 5, '8088', true, now() - interval '16 days')\non conflict (id) do nothing;\n\ninsert into order_items (id, order_id, product_id, name, qty, unit_kz, notes, extras) values\n  (1, 1, 5, 'Bela Casa', 1, 10500, '', ''),\n  (2, 1, 19, 'Refrigerante', 1, 500, '', ''),\n  (3, 2, 2, 'Aloha', 1, 5500, 'Sem cebola, se tiver.', ''),\n  (4, 2, 18, 'Água 500 ml', 1, 300, '', ''),\n  (5, 3, 16, 'Magoga com barbecue', 1, 2500, 'Molho à parte.', ''),\n  (6, 4, 13, 'Mar', 1, 16000, '', ''),\n  (7, 5, 14, 'Pezzo Burger', 1, 4500, '', ''),\n  (8, 6, 7, 'Pezzo', 1, 13500, '', ''),\n  (9, 7, 8, 'Atum', 1, 14500, '', ''),\n  (10, 8, 4, 'Pezzo', 1, 6000, '', ''),\n  (11, 9, 1, 'Bela Casa', 1, 5000, '', ''),\n  (12, 9, 3, 'Sweet', 1, 6000, '', ''),\n  (13, 10, 10, 'Amor Perfeito', 1, 15000, '', '')\non conflict (id) do nothing;\n\ninsert into order_checks (order_id, order_item_id, ingredient_id, item_name, name, unit, expected_qty, actual_qty, reason) values\n  (2, 3, 1, 'Aloha', 'Massa', 'g', 150, 150, ''),\n  (2, 3, 2, 'Aloha', 'Molho de tomate', 'g', 45, 45, ''),\n  (2, 3, 3, 'Aloha', 'Mozzarella', 'g', 65, 65, ''),\n  (2, 3, 4, 'Aloha', 'Fiambre', 'g', 40, 40, ''),\n  (2, 3, 5, 'Aloha', 'Ananás', 'g', 40, 40, ''),\n  (2, 4, 26, 'Água 500 ml', 'Água 500 ml', 'unidade', 1, 1, ''),\n  (3, 5, 19, 'Magoga com barbecue', 'Pão', 'unidade', 1, 1, ''),\n  (3, 5, 25, 'Magoga com barbecue', 'Ovo', 'unidade', 1, 1, ''),\n  (3, 5, 4, 'Magoga com barbecue', 'Fiambre', 'g', 40, 40, ''),\n  (3, 5, 22, 'Magoga com barbecue', 'Molho barbecue', 'ml', 25, 25, '');\n\ninsert into order_events (order_id, status, actor, at) values\n  (1, 'recebido', 'WhatsApp', now() - interval '3 hours 20 minutes'),\n  (1, 'preparacao', 'Carla Kapingana', now() - interval '3 hours 10 minutes'),\n  (1, 'pronto', 'Carla Kapingana', now() - interval '2 hours 50 minutes'),\n  (1, 'entrega', 'João Muongo', now() - interval '2 hours 40 minutes'),\n  (1, 'entregue', 'João Muongo', now() - interval '2 hours 10 minutes'),\n  (2, 'recebido', 'App', now() - interval '28 minutes'),\n  (2, 'preparacao', 'Carla Kapingana', now() - interval '20 minutes'),\n  (3, 'recebido', 'Miguel Sousa', now() - interval '10 minutes'),\n  (4, 'recebido', 'Instagram', now() - interval '40 minutes'),\n  (4, 'preparacao', 'Carla Kapingana', now() - interval '34 minutes'),\n  (4, 'pronto', 'Carla Kapingana', now() - interval '22 minutes'),\n  (4, 'entrega', 'João Muongo', now() - interval '18 minutes'),\n  (5, 'recebido', 'Balcão', now() - interval '50 minutes'),\n  (5, 'preparacao', 'Carla Kapingana', now() - interval '45 minutes'),\n  (5, 'pronto', 'Carla Kapingana', now() - interval '35 minutes'),\n  (6, 'entregue', 'Sílvia Domingos', now() - interval '1 day'),\n  (7, 'entregue', 'João Muongo', now() - interval '40 days'),\n  (8, 'entregue', 'Sílvia Domingos', now() - interval '6 days'),\n  (9, 'entregue', 'Carla Kapingana', now() - interval '5 hours'),\n  (10, 'entregue', 'Sílvia Domingos', now() - interval '16 days');\n\ninsert into pings (staff_id, order_id, lat, lng, simulated, at) values\n  (4, 4, -8.8324, 13.2412, true, now() - interval '1 minute');\n\ninsert into punches (staff_id, kind, lat, lng, inside, offline, actor, at) values\n  (1, 'entrada', -8.8264, 13.2342, true, false, 'Ana Tavares', now() - interval '3 hours'),\n  (2, 'entrada', -8.8264, 13.2342, true, false, 'Miguel Sousa', now() - interval '150 minutes'),\n  (3, 'entrada', -8.8264, 13.2342, true, false, 'Carla Kapingana', now() - interval '170 minutes'),\n  (4, 'entrada', -8.8264, 13.2342, true, false, 'João Muongo', now() - interval '160 minutes');\n\ninsert into stock_moves (ingredient_id, kind, qty, cost_kz, reason, actor, at) values\n  (3, 'entrada', 2000, 16000, 'Compra no mercado do Kinaxixi', 'Miguel Sousa', now() - interval '2 days'),\n  (5, 'quebra', -180, 0, 'Ananás maduro demais', 'Carla Kapingana', now() - interval '1 day');\n\ninsert into suggestions (kind, title, body, audience, message, status, source) values\n  (\n    'em risco',\n    'O Orlogar está a arrefecer',\n    'O último pedido do Orlogar Silva foi há mais de duas semanas, quase sempre pelo Instagram. Um toque com a Amor Perfeito costuma trazê-lo de volta.',\n    'Orlogar Silva',\n    'Olá Orlogar, a Pezzo sente a tua falta. Hoje a Amor Perfeito sai com 10% — é só responder a esta mensagem. Até já!',\n    'pendente',\n    'equipa'\n  ),\n  (\n    'stock',\n    'Camarão e atum no limite',\n    'O camarão e o atum estão abaixo do mínimo. Ou se compra hoje, ou a pizza Mar sai da montra até chegar mercadoria.',\n    'Cozinha e gestão',\n    '',\n    'pendente',\n    'equipa'\n  ),\n  (\n    'aniversario',\n    'Amanhã é o dia da Marta',\n    'A Marta faz anos amanhã, tem alergia a camarão e está na 9.ª pizza. A 10.ª já é oferta — combina com uma mensagem, sem Mar.',\n    'Marta Kapingana',\n    'Marta, amanhã é o teu dia e a Pezzo oferece a próxima pizza (a 10.ª). Sem camarão, como gostas. Muitos anos!',\n    'pendente',\n    'equipa'\n  ),\n  (\n    'dia_fraco',\n    'Terça da Pocket',\n    'Segunda a loja fecha e terça costuma arrancar devagar. Uma Pocket + refrigerante a um preço redondo enche a cozinha no almoço.',\n    'Clientes com opt-in',\n    'Terça da Pocket na Pezzo: individual + refrigerante por 5.500 Kz, só amanhã das 11h às 15h. Queres que reserve?',\n    'pendente',\n    'equipa'\n  );\n\ninsert into events (type, payload) values\n  ('order.created', '{\"code\":\"PP-2403\",\"canal\":\"telefone\"}'),\n  ('order.delivered', '{\"code\":\"PP-2401\"}'),\n  ('stock.low', '{\"ingrediente\":\"Atum\"}'),\n  ('stock.low', '{\"ingrediente\":\"Camarão\"}');\n\ninsert into audit (actor, action, detail) values\n  ('Sistema', 'arranque', 'Ementa, fichas e equipa de demonstração carregadas.');\n\nselect setval('categories_id_seq', (select max(id) from categories));\nselect setval('ingredients_id_seq', (select max(id) from ingredients));\nselect setval('products_id_seq', (select max(id) from products));\nselect setval('zones_id_seq', (select max(id) from zones));\nselect setval('staff_id_seq', (select max(id) from staff));\nselect setval('customers_id_seq', (select max(id) from customers));\nselect setval('coupons_id_seq', (select max(id) from coupons));\nselect setval('orders_id_seq', (select max(id) from orders));\nselect setval('order_items_id_seq', (select max(id) from order_items));\n";
var _0003_custos_default = "-- Preços de compra de Luanda (Outubro 2026) e fichas técnicas alinhadas\n-- à análise de custos da Pezzo. Unidades: g, ml ou unidade.\n-- cost_cents é o custo em cêntimos de kwanza por 1 unidade de stock.\n\nupdate ingredients set cost_cents = 1700 where id = 3;   -- mozzarella 17.000 Kz/kg → 1.700 cêntimos/g\nupdate ingredients set cost_cents = 600  where id = 11;  -- peito de frango 6.000 Kz/kg\nupdate ingredients set cost_cents = 150  where id = 2;   -- molho de tomate 1.500 Kz/kg\n\ninsert into ingredients (name, unit, stock_qty, min_qty, portion, extra_kz, cost_cents)\nselect 'Coxa de frango', 'g', 4000, 800, 130, 0, 350\nwhere not exists (select 1 from ingredients where name = 'Coxa de frango');\n\ninsert into ingredients (name, unit, stock_qty, min_qty, portion, extra_kz, cost_cents)\nselect 'Base de pizza', 'unidade', 36, 10, 1, 0, 80000\nwhere not exists (select 1 from ingredients where name = 'Base de pizza');\n\n-- Pocket: a massa continua por grama. 450 Kz por base de 150 g → 3 Kz/g.\nupdate ingredients set cost_cents = 300 where id = 1;\n\n-- Pão da magoga e do burger: 450 Kz, como na ficha (\"pão / massa, baixo custo\").\nupdate ingredients set cost_cents = 45000 where id = 19;\n\n\n-- Pocket: massa de 150 g (~450 Kz) + queijo ~80 g, como na ficha.\nupdate recipes set qty = 80 where product_id between 1 and 4 and ingredient_id = 3;\n\n-- Pizza 8 fatias e a base \"cria a tua\": uma base de 800 Kz no lugar da massa por grama.\n-- Queijo médio 200 g; premium (Doce Vitá, 4 Estações, Mar) 220 g.\ndelete from recipes\nwhere ingredient_id = 1\n  and product_id in (select id from products where category_id = 2);\n\ninsert into recipes (product_id, ingredient_id, qty)\nselect p.id, b.id, 1\nfrom products p\njoin ingredients b on b.name = 'Base de pizza'\nwhere p.category_id = 2\non conflict (product_id, ingredient_id) do update set qty = 1;\n\nupdate recipes set qty = 200 where product_id in (5, 6, 7, 8, 9, 10) and ingredient_id = 3;\nupdate recipes set qty = 220 where product_id in (11, 12, 13) and ingredient_id = 3;\n\n-- O pão da magoga custa pouco; os \"outros\" da ficha (ovo, fiambre, salada, molhos)\n-- é que fazem o resto. Tira o fiambre para a ficha não duplicar esse custo.\ndelete from recipes where product_id in (15, 16) and ingredient_id = 4;\n\n-- Magoga: 130 g de coxa + salada e molhos. Burger: 110 g de peito.\ninsert into recipes (product_id, ingredient_id, qty)\nselect p.id, i.id, 130\nfrom products p\njoin ingredients i on i.name = 'Coxa de frango'\nwhere p.id in (15, 16)\non conflict (product_id, ingredient_id) do update set qty = 130;\n\ninsert into recipes (product_id, ingredient_id, qty)\nselect 14, i.id, 110\nfrom ingredients i where i.name = 'Frango'\non conflict (product_id, ingredient_id) do update set qty = 110;\n\n-- Hambúrguer deixa de usar a unidade genérica de carne (custo irreal).\ndelete from recipes where product_id = 14 and ingredient_id = 20;\n";
var _0004_fotos_default = "-- Fotos reais da casa (Outubro 2026), uma por sabor.\n\nupdate products set photo = '/menu/real/bela.jpg' where slug in ('pocket-bela', 'pizza-bela', 'pizza-sempre');\nupdate products set photo = '/menu/real/aloha.jpg' where slug in ('pocket-aloha', 'pizza-aloha');\nupdate products set photo = '/menu/real/pezzo.jpg' where slug in ('pocket-pezzo', 'pizza-pezzo', 'cria-a-tua');\nupdate products set photo = '/menu/real/frango.jpg' where slug in ('pocket-sweet', 'pizza-amor');\nupdate products set photo = '/menu/real/estacoes.jpg' where slug = 'pizza-estacoes';\nupdate products set photo = '/menu/real/mar.jpg' where slug = 'pizza-mar';\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("@electric-sql/pglite");
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_pezzo.sql": _0002_pezzo_default,
			"/migrations/0003_custos.sql": _0003_custos_default,
			"/migrations/0004_fotos.sql": _0004_fotos_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
function num(v) {
	if (typeof v === "number") return Number.isFinite(v) ? v : 0;
	if (typeof v === "bigint") return Number(v);
	if (typeof v === "string" && v.trim() !== "") {
		const n = Number(v);
		return Number.isFinite(n) ? n : 0;
	}
	return 0;
}
function str(v) {
	return v == null ? "" : String(v);
}
function bool(v) {
	return v === true || v === "t" || v === "true" || v === 1;
}
var CHANNELS = [
	"app",
	"whatsapp",
	"instagram",
	"telefone",
	"balcao"
];
var PAYMENTS = [
	"dinheiro",
	"tpa",
	"multicaixa",
	"transferencia"
];
var STATUSES = [
	"recebido",
	"preparacao",
	"pronto",
	"entrega",
	"entregue",
	"cancelado"
];
var ORDER_SELECT = `
select
  o.id, o.code, o.token, o.status, o.channel, o.customer_name, o.phone,
  o.total_kz, o.subtotal_kz, o.discount_kz, o.delivery_kz, o.payment, o.paid,
  o.address, o.landmark, o.zone_name, o.allergy, o.notes, o.courier_id,
  coalesce(st.name, '') as courier_name, o.delivery_code,
  to_char(o.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
  o.lat, o.lng, o.stock_applied,
  coalesce((
    select string_agg(oi.qty::text || '× ' || oi.name, ', ' order by oi.id)
    from order_items oi where oi.order_id = o.id
  ), '') as item_summary
from orders o
left join staff st on st.id = o.courier_id
`;
function mapOrder(r) {
	const status = str(r.status);
	const channel = str(r.channel);
	const payment = str(r.payment);
	return {
		id: num(r.id),
		code: str(r.code),
		token: str(r.token),
		status: STATUSES.includes(status) ? status : "recebido",
		channel: CHANNELS.includes(channel) ? channel : "app",
		customerName: str(r.customer_name),
		phone: str(r.phone),
		totalKz: num(r.total_kz),
		subtotalKz: num(r.subtotal_kz),
		discountKz: num(r.discount_kz),
		deliveryKz: num(r.delivery_kz),
		payment: PAYMENTS.includes(payment) ? payment : "dinheiro",
		paid: bool(r.paid),
		address: str(r.address),
		landmark: str(r.landmark),
		zoneName: str(r.zone_name),
		allergy: str(r.allergy),
		notes: str(r.notes),
		courierId: r.courier_id == null ? null : num(r.courier_id),
		courierName: str(r.courier_name),
		deliveryCode: str(r.delivery_code),
		createdAt: str(r.created_at),
		lat: num(r.lat),
		lng: num(r.lng),
		itemSummary: str(r.item_summary),
		stockApplied: bool(r.stock_applied)
	};
}
async function settingsOf(db) {
	const r = (await db`select * from settings where id = 1`)[0];
	if (!r) throw new Error("A loja ainda não está configurada.");
	return {
		name: str(r.name),
		tagline: str(r.tagline),
		address: str(r.address),
		phones: str(r.phones).split("|").map((p) => p.trim()).filter(Boolean),
		instagram: str(r.instagram),
		facebook: str(r.facebook),
		email: str(r.email),
		lat: num(r.lat),
		lng: num(r.lng),
		geofenceM: num(r.geofence_m),
		hoursLabel: str(r.hours_label),
		loyaltyEvery: num(r.loyalty_every) || 10,
		apiKey: str(r.api_key)
	};
}
async function loadIngs(db) {
	return (await db`select * from ingredients order by name`).map((r) => ({
		id: num(r.id),
		name: str(r.name),
		unit: str(r.unit),
		stock: num(r.stock_qty),
		min: num(r.min_qty),
		portion: num(r.portion),
		extraKz: num(r.extra_kz),
		costCents: num(r.cost_cents),
		active: bool(r.active)
	}));
}
async function loadProducts(db) {
	return (await db`
    select p.*, c.name as category, c.slug as category_slug
    from products p join categories c on c.id = p.category_id
    order by c.sort, p.sort, p.name
  `).map((r) => ({
		id: num(r.id),
		categoryId: num(r.category_id),
		category: str(r.category),
		categorySlug: str(r.category_slug),
		name: str(r.name),
		slug: str(r.slug),
		description: str(r.description),
		priceKz: num(r.price_kz),
		active: bool(r.active),
		photo: str(r.photo),
		custom: bool(r.custom)
	}));
}
async function loadZones(db) {
	return (await db`select * from zones order by sort, id`).map((r) => ({
		id: num(r.id),
		name: str(r.name),
		feeKz: num(r.fee_kz),
		etaMin: num(r.eta_min)
	}));
}
async function loadCoupons(db) {
	return (await db`
    select id, code, label, kind, value_kz, max_uses, used, active,
      case when expires_at is null then null
        else to_char(expires_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') end as expires
    from coupons order by id
  `).map((r) => ({
		id: num(r.id),
		code: str(r.code),
		label: str(r.label),
		kind: str(r.kind),
		value: num(r.value_kz),
		expires: r.expires == null ? null : str(r.expires),
		maxUses: num(r.max_uses),
		used: num(r.used),
		active: bool(r.active)
	}));
}
async function audit(db, actor, action, detail) {
	await db`insert into audit (actor, action, detail) values (${actor.slice(0, 80)}, ${action}, ${detail.slice(0, 400)})`;
}
async function logEvent(db, type, payload) {
	await db`insert into events (type, payload) values (${type}, ${JSON.stringify(payload)})`;
}
function cleanOrder(input, strict) {
	const channel = input.channel;
	const payment = input.payment;
	if (!CHANNELS.includes(channel)) throw new Error("Canal de pedido desconhecido.");
	if (!PAYMENTS.includes(payment)) throw new Error("Forma de pagamento desconhecida.");
	const name = input.customerName.trim();
	const phone = normPhone(input.phone.trim());
	if (name.length < 2) throw new Error("Indica o nome de quem recebe.");
	if (phone.replace(/\D/g, "").length < 9) throw new Error("Indica um telefone válido, com o 9 de Angola.");
	if (!input.items?.length) throw new Error("O pedido está vazio.");
	if (input.items.length > 30) throw new Error("Demasiados itens neste pedido.");
	if (strict && input.zoneId !== 1) {
		if (input.address.trim().length < 4) throw new Error("Indica a morada da entrega.");
		if (input.landmark.trim().length < 3) throw new Error("Em Luanda o ponto de referência ajuda. Ex.: próximo à Tudor.");
	}
	return {
		...input,
		customerName: name.slice(0, 80),
		phone,
		address: input.address.trim().slice(0, 180),
		landmark: input.landmark.trim().slice(0, 120),
		notes: (input.notes ?? "").trim().slice(0, 280),
		proof: (input.proof ?? "").trim().slice(0, 80),
		coupon: (input.coupon ?? "").trim().toUpperCase().slice(0, 20),
		actor: (input.actor || "Cliente").slice(0, 80),
		clientRef: (input.clientRef || crypto.randomUUID()).slice(0, 64),
		items: input.items.map((item) => ({
			productId: Number(item.productId),
			qty: Number(item.qty),
			notes: (item.notes ?? "").slice(0, 160),
			extras: (item.extras ?? []).map(Number).filter((n) => Number.isFinite(n))
		}))
	};
}
function priceCart(input, products, ings, zones, coupons, pizzasCount) {
	const zone = zones.find((z) => z.id === input.zoneId);
	if (!zone) throw new Error("Escolhe a zona de entrega.");
	const enriched = input.items.map((item) => {
		const product = products.find((p) => p.id === item.productId);
		if (!product || !product.active) throw new Error("Um produto já não está na ementa.");
		if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 20) throw new Error("Quantidade inválida.");
		const extraNames = [];
		const extraIds = [];
		let extra = 0;
		for (const id of item.extras ?? []) {
			const ing = ings.find((i) => i.id === id && i.extraKz > 0);
			if (!ing) continue;
			extra += ing.extraKz;
			extraNames.push(ing.name);
			extraIds.push(ing.id);
		}
		return {
			product,
			qty: item.qty,
			unit: product.priceKz + extra,
			extraNames,
			extraIds,
			notes: item.notes ?? ""
		};
	});
	const subtotal = enriched.reduce((s, l) => s + l.unit * l.qty, 0);
	const pizzaUnits = [];
	for (const line of enriched) if (line.product.categorySlug === "pizzas" || line.product.categorySlug === "pocket") for (let i = 0; i < line.qty; i += 1) pizzaUnits.push(line.product.priceKz);
	const freePizzas = Math.floor((pizzasCount % 10 + pizzaUnits.length) / 10);
	const cheapest = [...pizzaUnits].sort((a, b) => a - b);
	let discount = 0;
	for (let i = 0; i < freePizzas && i < cheapest.length; i += 1) discount += cheapest[i];
	let delivery = zone.feeKz;
	let couponLabel = "";
	if (input.coupon) {
		const coupon = coupons.find((c) => c.code === input.coupon);
		if (!coupon || !coupon.active) throw new Error("Cupão inválido.");
		if (coupon.expires && new Date(coupon.expires).getTime() < Date.now()) throw new Error("Este cupão já expirou.");
		if (coupon.used >= coupon.maxUses) throw new Error("Este cupão já atingiu o limite.");
		if (coupon.kind === "percent") {
			discount += Math.round(subtotal * coupon.value / 100);
			couponLabel = `${coupon.code} · ${coupon.value}%`;
		} else if (coupon.kind === "fixo") {
			discount += coupon.value;
			couponLabel = `${coupon.code} · ${coupon.label}`;
		} else if (coupon.kind === "entrega") {
			delivery = 0;
			couponLabel = `${coupon.code} · entrega grátis`;
		}
	}
	discount = Math.min(discount, subtotal);
	const total = subtotal - discount + delivery;
	const every = 10;
	const before = pizzasCount % every;
	const loyaltyNote = freePizzas > 0 ? freePizzas === 1 ? "A 10.ª pizza é por nossa conta." : `${freePizzas} pizzas saem por nossa conta (fidelização).` : pizzaUnits.length > 0 ? `Faltam ${every - (before + pizzaUnits.length) % every || every} pizzas para a oferta.` : "";
	return {
		lines: enriched.map((l) => ({
			name: l.extraNames.length ? `${l.product.name} + ${l.extraNames.join(", ")}` : l.product.name,
			qty: l.qty,
			unitKz: l.unit,
			lineKz: l.unit * l.qty
		})),
		subtotalKz: subtotal,
		discountKz: discount,
		deliveryKz: delivery,
		totalKz: total,
		freePizzas,
		couponLabel,
		loyaltyNote,
		etaMin: zone.etaMin + 12,
		zoneName: zone.name,
		enriched
	};
}
async function ensureRealPhotos(db) {
	await db`update products set photo = '/menu/real/bela.jpg' where slug in ('pocket-bela', 'pizza-bela', 'pizza-sempre') and photo <> '/menu/real/bela.jpg'`;
	await db`update products set photo = '/menu/real/aloha.jpg' where slug in ('pocket-aloha', 'pizza-aloha') and photo <> '/menu/real/aloha.jpg'`;
	await db`update products set photo = '/menu/real/pezzo.jpg' where slug in ('pocket-pezzo', 'pizza-pezzo', 'cria-a-tua') and photo <> '/menu/real/pezzo.jpg'`;
	await db`update products set photo = '/menu/real/frango.jpg' where slug in ('pocket-sweet', 'pizza-amor') and photo <> '/menu/real/frango.jpg'`;
	await db`update products set photo = '/menu/real/estacoes.jpg' where slug = 'pizza-estacoes' and photo <> '/menu/real/estacoes.jpg'`;
	await db`update products set photo = '/menu/real/mar.jpg' where slug = 'pizza-mar' and photo <> '/menu/real/mar.jpg'`;
}
async function fetchMenu() {
	const db = await getSql();
	await ensureRealPhotos(db);
	const { apiKey: _apiKey, ...settings } = await settingsOf(db);
	const categories = (await db`select * from categories order by sort`).map((r) => ({
		id: num(r.id),
		name: str(r.name),
		slug: str(r.slug),
		sort: num(r.sort)
	}));
	const products = await loadProducts(db);
	const ings = await loadIngs(db);
	const zones = await loadZones(db);
	return {
		settings,
		categories,
		products,
		toppings: ings.filter((i) => i.extraKz > 0 && i.active).map((i) => ({
			id: i.id,
			name: i.name,
			unit: i.unit,
			portion: i.portion,
			extraKz: i.extraKz
		})),
		zones
	};
}
async function fetchHome() {
	const menu = await fetchMenu();
	const open = await (await getSql()).query(`${ORDER_SELECT} where o.status in ('recebido','preparacao','pronto','entrega') order by o.id desc limit 12`);
	return {
		...menu,
		live: open.map(mapOrder).map((o) => ({
			code: o.code,
			status: o.status,
			itemSummary: o.itemSummary,
			channel: o.channel
		}))
	};
}
async function pizzasOf(db, phone) {
	const rows = await db`select pizzas_count from customers where phone = ${phone}`;
	return rows[0] ? num(rows[0].pizzas_count) : 0;
}
async function quoteOrder(raw) {
	const db = await getSql();
	const input = cleanOrder(raw, false);
	const [products, ings, zones, coupons] = await Promise.all([
		loadProducts(db),
		loadIngs(db),
		loadZones(db),
		loadCoupons(db)
	]);
	const priced = priceCart(input, products, ings, zones, coupons, await pizzasOf(db, input.phone));
	return {
		lines: priced.lines,
		subtotalKz: priced.subtotalKz,
		discountKz: priced.discountKz,
		deliveryKz: priced.deliveryKz,
		totalKz: priced.totalKz,
		freePizzas: priced.freePizzas,
		couponLabel: priced.couponLabel,
		loyaltyNote: priced.loyaltyNote,
		etaMin: priced.etaMin
	};
}
async function createOrder(raw) {
	const db = await getSql();
	const input = cleanOrder(raw, true);
	const existing = await db`
    select token, code from orders where client_ref = ${input.clientRef}
  `;
	if (existing[0]) return {
		token: str(existing[0].token),
		code: str(existing[0].code),
		replayed: true
	};
	const [products, ings, zones, coupons, shop] = await Promise.all([
		loadProducts(db),
		loadIngs(db),
		loadZones(db),
		loadCoupons(db),
		settingsOf(db)
	]);
	const found = await db`select * from customers where phone = ${input.phone}`;
	const pizzas = found[0] ? num(found[0].pizzas_count) : 0;
	const allergy = found[0] ? str(found[0].allergies) : "";
	const priced = priceCart(input, products, ings, zones, coupons, pizzas);
	const zone = zones.find((z) => z.id === input.zoneId);
	const lat = zone.feeKz === 0 ? shop.lat : shop.lat + .01 + (zone.id - 2) * .008;
	const lng = zone.feeKz === 0 ? shop.lng : shop.lng + .012 + (zone.id - 2) * .005;
	let customerId;
	if (found[0]) {
		customerId = num(found[0].id);
		await db`
      update customers
      set name = ${input.customerName}, address = ${input.address}, landmark = ${input.landmark}, channel = ${input.channel}
      where id = ${customerId}
    `;
	} else customerId = num((await db`
      insert into customers (name, phone, channel, address, landmark, opt_in)
      values (${input.customerName}, ${input.phone}, ${input.channel}, ${input.address}, ${input.landmark}, true)
      returning id
    `)[0].id);
	const code4 = String(1e3 + Math.floor(Math.random() * 9e3));
	const token = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
	const orderId = num((await db`
    insert into orders (
      code, token, client_ref, customer_id, customer_name, phone, channel, status, payment, paid, proof,
      address, landmark, zone_id, zone_name, lat, lng, delivery_kz, subtotal_kz, discount_kz, total_kz,
      notes, coupon, allergy, delivery_code
    ) values (
      ${"TMP"}, ${token}, ${input.clientRef}, ${customerId}, ${input.customerName}, ${input.phone},
      ${input.channel}, 'recebido', ${input.payment}, ${input.payment === "transferencia" ? false : false},
      ${input.proof}, ${input.address || "Levantamento na loja"}, ${input.landmark || "Balcão"},
      ${zone.id}, ${zone.name}, ${lat}, ${lng}, ${priced.deliveryKz}, ${priced.subtotalKz}, ${priced.discountKz},
      ${priced.totalKz}, ${input.notes}, ${input.coupon}, ${allergy}, ${code4}
    ) returning id
  `)[0].id);
	const code = `PP-${2400 + orderId}`;
	await db`update orders set code = ${code} where id = ${orderId}`;
	await db`
    update customers
    set pizzas_count = pizzas_count + ${priced.enriched.reduce((s, l) => {
		return l.product.categorySlug === "pizzas" || l.product.categorySlug === "pocket" ? s + l.qty : s;
	}, 0)},
        points = points + ${Math.floor(priced.totalKz / 100)}
    where id = ${customerId}
  `;
	if (input.coupon) await db`update coupons set used = used + 1 where code = ${input.coupon}`;
	for (const line of priced.enriched) {
		const extraText = line.extraNames.join(", ");
		const itemId = num((await db`
      insert into order_items (order_id, product_id, name, qty, unit_kz, notes, extras)
      values (${orderId}, ${line.product.id}, ${line.product.name}, ${line.qty}, ${line.unit}, ${line.notes}, ${extraText})
      returning id
    `)[0].id);
		const recipes = await db`
      select ingredient_id, qty from recipes where product_id = ${line.product.id}
    `;
		const qtyMap = /* @__PURE__ */ new Map();
		for (const r of recipes) qtyMap.set(num(r.ingredient_id), num(r.qty) * line.qty);
		for (const extraId of line.extraIds) {
			const ing = ings.find((i) => i.id === extraId);
			if (!ing) continue;
			qtyMap.set(extraId, (qtyMap.get(extraId) ?? 0) + Math.max(1, ing.portion) * line.qty);
		}
		for (const [ingId, qty] of qtyMap) {
			const ing = ings.find((i) => i.id === ingId);
			if (!ing || qty <= 0) continue;
			await db`
        insert into order_checks (order_id, order_item_id, ingredient_id, item_name, name, unit, expected_qty, actual_qty)
        values (${orderId}, ${itemId}, ${ingId}, ${line.product.name}, ${ing.name}, ${ing.unit}, ${qty}, ${qty})
      `;
		}
	}
	await db`
    insert into order_events (order_id, status, actor) values (${orderId}, 'recebido', ${input.actor})
  `;
	await logEvent(db, "order.created", {
		code,
		canal: input.channel,
		total: priced.totalKz
	});
	await audit(db, input.actor, "pedido.criado", code);
	return {
		token,
		code,
		totalKz: priced.totalKz,
		deliveryCode: code4,
		replayed: false
	};
}
async function tracking(token) {
	const db = await getSql();
	const rows = await db.query(`${ORDER_SELECT} where o.token = $1`, [token]);
	if (!rows[0]) throw new Error("Não encontrámos este pedido. Confirma o link.");
	const order = mapOrder(rows[0]);
	const events = await db`
    select status, actor, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from order_events where order_id = ${order.id} order by id
  `;
	const shop = await settingsOf(db);
	const pings = await db`
    select p.lat, p.lng, p.simulated, st.name as name,
      to_char(p.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from pings p left join staff st on st.id = p.staff_id
    where p.order_id = ${order.id}
    order by p.id desc limit 1
  `;
	const zone = (await loadZones(db)).find((z) => z.name === order.zoneName);
	return {
		order,
		events: events.map((e) => ({
			status: str(e.status),
			actor: str(e.actor),
			at: str(e.at)
		})),
		shop: {
			lat: shop.lat,
			lng: shop.lng,
			address: shop.address
		},
		courier: pings[0] ? {
			lat: num(pings[0].lat),
			lng: num(pings[0].lng),
			at: str(pings[0].at),
			name: str(pings[0].name) || order.courierName,
			simulated: bool(pings[0].simulated)
		} : null,
		etaMin: (zone?.etaMin ?? 25) + 8
	};
}
async function ordersWhere(db, clause, params = []) {
	return (await db.query(`${ORDER_SELECT} ${clause}`, params)).map(mapOrder);
}
async function kitchenBoard() {
	const db = await getSql();
	return {
		orders: await ordersWhere(db, `where o.status in ('recebido','preparacao','pronto') order by o.created_at asc`),
		cleanWeek: num((await db`
    select count(*) as n from orders o
    where o.stock_applied = true
      and o.created_at > now() - interval '7 days'
      and o.status <> 'cancelado'
      and not exists (
        select 1 from order_checks c
        where c.order_id = o.id and c.actual_qty <> c.expected_qty
      )
  `)[0]?.n)
	};
}
async function orderDetail(id) {
	const db = await getSql();
	const rows = await ordersWhere(db, `where o.id = $1`, [id]);
	if (!rows[0]) throw new Error("Pedido não encontrado.");
	const items = await db`
    select id, name, qty, unit_kz, notes, extras from order_items where order_id = ${id} order by id
  `;
	const checks = await db`
    select * from order_checks where order_id = ${id} order by id
  `;
	const events = await db`
    select status, actor, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from order_events where order_id = ${id} order by id
  `;
	return {
		order: rows[0],
		items: items.map((i) => ({
			id: num(i.id),
			name: str(i.name),
			qty: num(i.qty),
			unitKz: num(i.unit_kz),
			notes: str(i.notes),
			extras: str(i.extras)
		})),
		checks: checks.map((c) => ({
			id: num(c.id),
			orderId: num(c.order_id),
			itemName: str(c.item_name),
			ingredientId: num(c.ingredient_id),
			name: str(c.name),
			unit: str(c.unit),
			expectedQty: num(c.expected_qty),
			actualQty: num(c.actual_qty),
			reason: str(c.reason)
		})),
		events: events.map((e) => ({
			status: str(e.status),
			actor: str(e.actor),
			at: str(e.at)
		}))
	};
}
async function markPreparing(id, actor) {
	const db = await getSql();
	if (!(await db`
    update orders set status = 'preparacao', updated_at = now()
    where id = ${id} and status = 'recebido'
    returning id
  `)[0]) throw new Error("Este pedido já não está à espera.");
	await db`insert into order_events (order_id, status, actor) values (${id}, 'preparacao', ${actor})`;
	await audit(db, actor, "pedido.preparacao", String(id));
	return { ok: true };
}
async function finishPrep(input) {
	const db = await getSql();
	const order = (await db`select * from orders where id = ${input.orderId}`)[0];
	if (!order) throw new Error("Pedido não encontrado.");
	const status = str(order.status);
	if (status === "cancelado" || status === "entregue") throw new Error("Este pedido já não se prepara.");
	if (bool(order.stock_applied)) {
		if (status === "preparacao" || status === "recebido") {
			await db`update orders set status = 'pronto', updated_at = now() where id = ${input.orderId}`;
			await db`insert into order_events (order_id, status, actor) values (${input.orderId}, 'pronto', ${input.actor})`;
		}
		return {
			ok: true,
			already: true
		};
	}
	const current = await db`select * from order_checks where order_id = ${input.orderId}`;
	const byId = new Map(input.lines.map((l) => [l.id, l]));
	for (const row of current) {
		const edit = byId.get(num(row.id));
		const actual = edit ? Math.max(0, Math.round(edit.actualQty)) : num(row.actual_qty);
		const reason = (edit?.reason ?? str(row.reason)).trim().slice(0, 160);
		if (actual !== num(row.expected_qty) && reason.length < 3) throw new Error(`Em ${str(row.name)}, a quantidade mudou. Diz o motivo (ex.: sem cebola).`);
		await db`
      update order_checks set actual_qty = ${actual}, reason = ${reason} where id = ${num(row.id)}
    `;
		await db`update ingredients set stock_qty = stock_qty - ${actual} where id = ${num(row.ingredient_id)}`;
		await db`
      insert into stock_moves (ingredient_id, kind, qty, reason, actor, order_id)
      values (${num(row.ingredient_id)}, 'pedido', ${-actual}, ${reason || str(order.code)}, ${input.actor}, ${input.orderId})
    `;
	}
	await db`
    update orders set status = 'pronto', stock_applied = true, updated_at = now() where id = ${input.orderId}
  `;
	await db`insert into order_events (order_id, status, actor) values (${input.orderId}, 'pronto', ${input.actor})`;
	const lows = await db`
    select name, stock_qty, min_qty, unit from ingredients where stock_qty <= min_qty and active = true
  `;
	for (const low of lows) await logEvent(db, "stock.low", {
		ingrediente: str(low.name),
		stock: num(low.stock_qty),
		minimo: num(low.min_qty)
	});
	await audit(db, input.actor, "pedido.pronto", str(order.code));
	return {
		ok: true,
		already: false,
		low: lows.length
	};
}
async function cancelOrder(id, actor, reason) {
	const db = await getSql();
	const rows = await db`
    update orders set status = 'cancelado', updated_at = now(), notes = ${reason.slice(0, 180)}
    where id = ${id} and status not in ('entregue','cancelado')
    returning code
  `;
	if (!rows[0]) throw new Error("Não dá para cancelar este pedido.");
	await db`insert into order_events (order_id, status, actor) values (${id}, 'cancelado', ${actor})`;
	await audit(db, actor, "pedido.cancelado", `${rows[0].code}: ${reason}`);
	return { ok: true };
}
async function courierBoard() {
	const db = await getSql();
	const orders = await ordersWhere(db, `where o.status in ('pronto','entrega') order by o.created_at asc`);
	const shop = await settingsOf(db);
	const pings = await db`
    select distinct on (order_id) order_id, lat, lng, simulated, staff_id,
      to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from pings order by order_id, id desc
  `;
	return {
		orders,
		shop: {
			lat: shop.lat,
			lng: shop.lng
		},
		pings: pings.map((p) => ({
			orderId: num(p.order_id),
			lat: num(p.lat),
			lng: num(p.lng),
			simulated: bool(p.simulated),
			staffId: num(p.staff_id),
			at: str(p.at)
		}))
	};
}
async function acceptDelivery(orderId, staffId, actor) {
	const db = await getSql();
	if (!(await db`
    update orders set status = 'entrega', courier_id = ${staffId}, updated_at = now()
    where id = ${orderId} and status = 'pronto'
    returning id
  `)[0]) throw new Error("Este pedido já não está pronto para sair.");
	await db`insert into order_events (order_id, status, actor) values (${orderId}, 'entrega', ${actor})`;
	const shop = await settingsOf(db);
	await db`
    insert into pings (staff_id, order_id, lat, lng, simulated)
    values (${staffId}, ${orderId}, ${shop.lat}, ${shop.lng}, true)
  `;
	await audit(db, actor, "pedido.saiu", String(orderId));
	return { ok: true };
}
async function pingCourier(input) {
	const db = await getSql();
	if (!(await db`
    select id from orders where id = ${input.orderId} and status = 'entrega'
  `)[0]) return { ok: false };
	await db`
    insert into pings (staff_id, order_id, lat, lng, simulated)
    values (${input.staffId}, ${input.orderId}, ${input.lat}, ${input.lng}, ${input.simulated})
  `;
	return { ok: true };
}
async function confirmDelivery(input) {
	const db = await getSql();
	const order = (await db`select * from orders where id = ${input.orderId}`)[0];
	if (!order) throw new Error("Pedido não encontrado.");
	if (str(order.status) !== "entrega") throw new Error("Este pedido não está em entrega.");
	if (str(order.delivery_code) !== input.code.trim()) throw new Error("Código incorrecto. Pede os 4 dígitos ao cliente.");
	await db`
    update orders set status = 'entregue', paid = ${input.paid}, updated_at = now()
    where id = ${input.orderId}
  `;
	await db`insert into order_events (order_id, status, actor) values (${input.orderId}, 'entregue', ${input.actor})`;
	await logEvent(db, "order.delivered", {
		code: str(order.code),
		pago: input.paid,
		nota: input.note.slice(0, 140)
	});
	await audit(db, input.actor, "pedido.entregue", str(order.code));
	return { ok: true };
}
async function listOrders() {
	return ordersWhere(await getSql(), `order by o.id desc limit 80`);
}
async function dashboard() {
	const db = await getSql();
	const orders = await ordersWhere(db, `where o.created_at > now() - interval '21 days' order by o.id desc`);
	const today = diaChave((/* @__PURE__ */ new Date()).toISOString());
	const todayOrders = orders.filter((o) => diaChave(o.createdAt) === today && o.status !== "cancelado");
	const delivered = todayOrders.filter((o) => o.status === "entregue");
	const sales = delivered.reduce((s, o) => s + o.totalKz, 0);
	const byChannelMap = /* @__PURE__ */ new Map();
	for (const o of todayOrders) {
		const cur = byChannelMap.get(o.channel) ?? {
			n: 0,
			total: 0
		};
		cur.n += 1;
		cur.total += o.totalKz;
		byChannelMap.set(o.channel, cur);
	}
	const days = [];
	for (let i = 6; i >= 0; i -= 1) {
		const d = /* @__PURE__ */ new Date(Date.now() - i * 864e5);
		const key = diaChave(d.toISOString());
		const slice = orders.filter((o) => diaChave(o.createdAt) === key && o.status === "entregue");
		days.push({
			day: key.slice(5),
			total: slice.reduce((s, o) => s + o.totalKz, 0),
			n: slice.length
		});
	}
	const itemRows = await db`
    select oi.name, sum(oi.qty) as qty, sum(oi.qty * oi.unit_kz) as total
    from order_items oi join orders o on o.id = oi.order_id
    where o.status <> 'cancelado' and o.created_at > now() - interval '14 days'
    group by oi.name order by sum(oi.qty) desc limit 6
  `;
	const events = await db`
    select order_id, status, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from order_events where at > now() - interval '7 days'
  `;
	const byOrder = /* @__PURE__ */ new Map();
	for (const e of events) {
		const id = num(e.order_id);
		const bag = byOrder.get(id) ?? {};
		bag[str(e.status)] = new Date(str(e.at)).getTime();
		byOrder.set(id, bag);
	}
	const prep = [];
	const trip = [];
	for (const bag of byOrder.values()) {
		if (bag.recebido && bag.pronto) prep.push((bag.pronto - bag.recebido) / 6e4);
		if (bag.entrega && bag.entregue) trip.push((bag.entregue - bag.entrega) / 6e4);
	}
	const avg = (xs) => xs.length ? Math.round(xs.reduce((s, n) => s + n, 0) / xs.length) : null;
	const punches = await db`
    select p.staff_id, p.kind, s.name, s.role,
      to_char(p.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from punches p join staff s on s.id = p.staff_id
    where p.at > now() - interval '18 hours'
    order by p.at desc
  `;
	const seen = /* @__PURE__ */ new Set();
	const present = [];
	for (const p of punches) {
		const id = num(p.staff_id);
		if (seen.has(id)) continue;
		seen.add(id);
		const kind = str(p.kind);
		if (kind === "entrada" || kind === "regresso" || kind === "pausa") present.push({
			name: str(p.name),
			role: str(p.role),
			since: str(p.at),
			kind
		});
	}
	const lows = (await loadIngs(db)).filter((i) => i.stock <= i.min);
	return {
		salesKz: sales,
		orders: todayOrders.length,
		ticketKz: delivered.length ? Math.round(sales / delivered.length) : 0,
		open: todayOrders.filter((o) => o.status !== "entregue").length,
		byChannel: [...byChannelMap.entries()].map(([channel, v]) => ({
			channel,
			...v
		})),
		byDay: days,
		top: itemRows.map((r) => ({
			name: str(r.name),
			qty: num(r.qty),
			total: num(r.total)
		})),
		prepAvgMin: avg(prep),
		tripAvgMin: avg(trip),
		present,
		lowStock: lows.map((i) => ({
			name: i.name,
			stock: i.stock,
			min: i.min,
			unit: i.unit
		}))
	};
}
async function ensureCostBasis(db) {
	await db`update ingredients set cost_cents = 300 where name = 'Massa' and cost_cents > 1000`;
}
async function productCosts(db) {
	const products = (await loadProducts(db)).filter((p) => !p.custom);
	const recipes = await db`
    select r.product_id, r.qty, i.cost_cents
    from recipes r join ingredients i on i.id = r.ingredient_id
  `;
	const cost = /* @__PURE__ */ new Map();
	for (const r of recipes) {
		const qty = num(r.qty);
		const cents = num(r.cost_cents);
		cost.set(num(r.product_id), (cost.get(num(r.product_id)) ?? 0) + qty * cents);
	}
	return products.map((p) => {
		const costKz = Math.round((cost.get(p.id) ?? 0) / 100);
		const marginKz = p.priceKz - costKz;
		const foodCostPct = p.priceKz > 0 ? Math.round(costKz / p.priceKz * 1e3) / 10 : 0;
		const marginPct = p.priceKz > 0 ? marginKz / p.priceKz : 0;
		const priority = p.categorySlug === "bebidas" ? "—" : foodCostPct === 0 ? "Ficha vazia" : marginPct >= .45 && foodCostPct <= 60 ? "Alta" : foodCostPct <= 45 ? "Média" : "Rever";
		return {
			id: p.id,
			name: p.name,
			category: p.category,
			categorySlug: p.categorySlug,
			priceKz: p.priceKz,
			costKz,
			marginKz,
			foodCostPct,
			priority
		};
	});
}
async function stockBoard() {
	const db = await getSql();
	await ensureCostBasis(db);
	const ingredients = await loadIngs(db);
	const moves = await db`
    select m.id, m.kind, m.qty, m.cost_kz, m.reason, m.actor, i.name, i.unit,
      to_char(m.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from stock_moves m join ingredients i on i.id = m.ingredient_id
    order by m.id desc limit 40
  `;
	await loadProducts(db);
	const foodCost = await productCosts(db);
	return {
		ingredients,
		moves: moves.map((m) => ({
			id: num(m.id),
			kind: str(m.kind),
			qty: num(m.qty),
			costKz: num(m.cost_kz),
			reason: str(m.reason),
			actor: str(m.actor),
			name: str(m.name),
			unit: str(m.unit),
			at: str(m.at)
		})),
		foodCost
	};
}
async function stockAdjust(input) {
	const db = await getSql();
	const ing = (await db`select * from ingredients where id = ${input.ingredientId}`)[0];
	if (!ing) throw new Error("Ingrediente não encontrado.");
	const qty = Math.round(input.qty);
	if (!Number.isFinite(qty)) throw new Error("Quantidade inválida.");
	const reason = input.reason.trim().slice(0, 180);
	if (reason.length < 3 && input.kind !== "entrada") throw new Error("Indica o motivo.");
	let delta = qty;
	if (input.kind === "quebra" || input.kind === "interno") {
		if (qty <= 0) throw new Error("A quantidade tem de ser positiva.");
		delta = -qty;
	} else if (input.kind === "entrada") {
		if (qty <= 0) throw new Error("A entrada tem de ser positiva.");
		delta = qty;
	} else delta = qty - num(ing.stock_qty);
	const costKz = Math.max(0, Math.round(input.costKz || 0));
	if (input.kind === "entrada" && costKz > 0 && qty > 0) await db`update ingredients set cost_cents = ${Math.round(costKz * 100 / qty)} where id = ${input.ingredientId}`;
	await db`update ingredients set stock_qty = stock_qty + ${delta} where id = ${input.ingredientId}`;
	await db`
    insert into stock_moves (ingredient_id, kind, qty, cost_kz, reason, actor)
    values (${input.ingredientId}, ${input.kind}, ${delta}, ${Math.max(0, Math.round(input.costKz || 0))}, ${reason}, ${input.actor})
  `;
	await audit(db, input.actor, `stock.${input.kind}`, `${str(ing.name)} ${delta}`);
	return { ok: true };
}
async function saveIngredientCost(input) {
	const db = await getSql();
	const price = Math.round(input.pricePerKgKz);
	if (!Number.isFinite(price) || price < 0) throw new Error("Preço inválido.");
	const ing = (await db`select name, unit from ingredients where id = ${input.ingredientId}`)[0];
	if (!ing) throw new Error("Ingrediente não encontrado.");
	const unit = str(ing.unit);
	await db`update ingredients set cost_cents = ${unit === "g" || unit === "ml" ? Math.round(price * 100 / 1e3) : Math.round(price * 100)} where id = ${input.ingredientId}`;
	await audit(db, input.actor, "custo.atualizado", `${str(ing.name)} ${price} Kz`);
	return { ok: true };
}
async function fichas() {
	const db = await getSql();
	await ensureCostBasis(db);
	const products = await loadProducts(db);
	const ingredients = await loadIngs(db);
	const lines = await db`
    select product_id, ingredient_id, qty from recipes order by product_id, ingredient_id
  `;
	return {
		products,
		ingredients: ingredients.map((i) => ({
			id: i.id,
			name: i.name,
			unit: i.unit,
			costCents: i.costCents
		})),
		lines: lines.map((l) => ({
			productId: num(l.product_id),
			ingredientId: num(l.ingredient_id),
			qty: num(l.qty)
		}))
	};
}
async function saveRecipe(input) {
	const db = await getSql();
	await db`delete from recipes where product_id = ${input.productId}`;
	for (const line of input.lines) {
		const qty = Math.round(line.qty);
		if (qty <= 0) continue;
		await db`
      insert into recipes (product_id, ingredient_id, qty)
      values (${input.productId}, ${line.ingredientId}, ${qty})
      on conflict (product_id, ingredient_id) do update set qty = ${qty}
    `;
	}
	await audit(db, input.actor, "ficha.atualizada", String(input.productId));
	return { ok: true };
}
async function saveProduct(input) {
	const db = await getSql();
	const name = input.name.trim().slice(0, 80);
	if (name.length < 2) throw new Error("O produto precisa de um nome.");
	const price = Math.round(input.priceKz);
	if (price < 0) throw new Error("Preço inválido.");
	const description = input.description.trim().slice(0, 220);
	if (input.id) {
		await db`
      update products set name = ${name}, description = ${description}, price_kz = ${price},
        active = ${input.active}, category_id = ${input.categoryId}
      where id = ${input.id}
    `;
		await audit(db, input.actor, "ementa.editada", name);
		return { id: input.id };
	}
	const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString().slice(-4)}`;
	const rows = await db`
    insert into products (category_id, name, slug, description, price_kz, active, photo, sort)
    values (${input.categoryId}, ${name}, ${slug}, ${description}, ${price}, ${input.active}, '', 50)
    returning id
  `;
	await audit(db, input.actor, "ementa.nova", name);
	return { id: num(rows[0].id) };
}
async function customerBoard() {
	return (await (await getSql())`
    select c.*,
      (select count(*) from orders o where o.customer_id = c.id and o.status <> 'cancelado') as orders,
      (select coalesce(sum(total_kz), 0) from orders o where o.customer_id = c.id and o.status <> 'cancelado') as spent,
      (select to_char(max(o.created_at) at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
         from orders o where o.customer_id = c.id and o.status <> 'cancelado') as last_order,
      to_char(c.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created,
      case when c.birthday is null then null else to_char(c.birthday, 'YYYY-MM-DD') end as birthday_s
    from customers c order by c.name
  `).map((r) => {
		const last = r.last_order == null ? null : str(r.last_order);
		const created = str(r.created);
		const orders = num(r.orders);
		const spent = num(r.spent);
		const days = last ? Math.floor((Date.now() - new Date(last).getTime()) / 864e5) : 999;
		const age = Math.floor((Date.now() - new Date(created).getTime()) / 864e5);
		const tags = [];
		if (days >= 30) tags.push("inativo");
		else if (days >= 14) tags.push("em risco");
		if (spent >= 3e4 || num(r.pizzas_count) >= 12) tags.push("VIP");
		if (orders >= 3 && days < 14) tags.push("frequente");
		if (age <= 14 && orders <= 1) tags.push("novo");
		if (!tags.length) tags.push("regular");
		const bday = r.birthday_s == null ? null : str(r.birthday_s);
		let birthdaySoon = false;
		if (bday) {
			const [, m, d] = bday.split("-").map(Number);
			const luanda = new Date((/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "Africa/Luanda" }));
			const target = new Date(luanda.getFullYear(), (m ?? 1) - 1, d ?? 1);
			const diff = Math.round((target.getTime() - new Date(luanda.getFullYear(), luanda.getMonth(), luanda.getDate()).getTime()) / 864e5);
			birthdaySoon = diff >= 0 && diff <= 7;
		}
		return {
			id: num(r.id),
			name: str(r.name),
			phone: str(r.phone),
			notes: str(r.notes),
			allergies: str(r.allergies),
			channel: str(r.channel),
			optIn: bool(r.opt_in),
			points: num(r.points),
			pizzas: num(r.pizzas_count),
			address: str(r.address),
			landmark: str(r.landmark),
			orders,
			spent,
			lastOrder: last,
			tags,
			birthday: bday,
			birthdaySoon,
			ticket: orders ? Math.round(spent / orders) : 0
		};
	});
}
async function saveCustomer(input) {
	const db = await getSql();
	await db`
    update customers set notes = ${input.notes.slice(0, 280)}, allergies = ${input.allergies.slice(0, 120)},
      opt_in = ${input.optIn}
    where id = ${input.id}
  `;
	await audit(db, input.actor, "cliente.editado", String(input.id));
	return { ok: true };
}
async function punchBoard() {
	const db = await getSql();
	const staff = await db`select id, name, role, phone from staff where active order by id`;
	const punches = await db`
    select p.id, p.staff_id, p.kind, p.inside, p.offline, p.actor, s.name,
      to_char(p.at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from punches p join staff s on s.id = p.staff_id
    where p.at > now() - interval '14 days'
    order by p.at desc limit 200
  `;
	return {
		staff: staff.map((s) => ({
			id: num(s.id),
			name: str(s.name),
			role: str(s.role),
			phone: str(s.phone)
		})),
		punches: punches.map((p) => ({
			id: num(p.id),
			staffId: num(p.staff_id),
			name: str(p.name),
			kind: str(p.kind),
			inside: bool(p.inside),
			offline: bool(p.offline),
			at: str(p.at)
		}))
	};
}
async function doPunch(input) {
	const db = await getSql();
	const shop = await settingsOf(db);
	if (!(await db`select * from staff where id = ${input.staffId} and active`)[0]) throw new Error("Funcionário não encontrado.");
	if (![
		"entrada",
		"saida",
		"pausa",
		"regresso"
	].includes(input.kind)) throw new Error("Tipo de picagem inválido.");
	const dist = meters(input.lat, input.lng, shop.lat, shop.lng);
	if (dist > shop.geofenceM) {
		await audit(db, input.actor, "ponto.recusado", `${Math.round(dist)} m`);
		throw new Error(`Estás a ${Math.round(dist)} m da Pezzo. O ponto só regista dentro de ${shop.geofenceM} m.`);
	}
	const last = await db`
    select kind from punches where staff_id = ${input.staffId} order by at desc, id desc limit 1
  `;
	const prev = last[0] ? str(last[0].kind) : "";
	const open = prev === "entrada" || prev === "regresso";
	const paused = prev === "pausa";
	if (input.kind === "entrada" && (open || paused)) throw new Error("Já estás em serviço.");
	if (input.kind === "saida" && !open && !paused) throw new Error("Ainda não entraste.");
	if (input.kind === "pausa" && !open) throw new Error("Só podes pausar depois de entrar.");
	if (input.kind === "regresso" && !paused) throw new Error("Não há pausa em aberto.");
	let when = null;
	if (input.offline && input.at) {
		const t = new Date(input.at).getTime();
		if (Number.isNaN(t)) throw new Error("Hora do telemóvel inválida.");
		if (t > Date.now() + 6e5) throw new Error("A hora do telemóvel está no futuro.");
		if (Date.now() - t > 2592e5) throw new Error("Picagem antiga demais para sincronizar.");
		when = new Date(t).toISOString();
	}
	await db`
    insert into punches (staff_id, kind, lat, lng, inside, offline, actor, at)
    values (
      ${input.staffId}, ${input.kind}, ${input.lat}, ${input.lng}, true, ${input.offline}, ${input.actor},
      coalesce(${when}::timestamptz, now())
    )
  `;
	await audit(db, input.actor, `ponto.${input.kind}`, input.offline ? "offline" : "online");
	return {
		ok: true,
		inside: true,
		meters: Math.round(dist)
	};
}
async function suggestionBoard() {
	const db = await getSql();
	const rows = await db`
    select id, kind, title, body, audience, message, status, source,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from suggestions order by id desc limit 30
  `;
	const coupons = await loadCoupons(db);
	return {
		suggestions: rows.map((r) => ({
			id: num(r.id),
			kind: str(r.kind),
			title: str(r.title),
			body: str(r.body),
			audience: str(r.audience),
			message: str(r.message),
			status: str(r.status),
			source: str(r.source),
			at: str(r.at)
		})),
		coupons
	};
}
async function decideSuggestion(id, status, actor) {
	if (![
		"aprovada",
		"dispensada",
		"enviada",
		"pendente"
	].includes(status)) throw new Error("Estado inválido.");
	const db = await getSql();
	await db`update suggestions set status = ${status} where id = ${id}`;
	await audit(db, actor, "sugestao", `${id} ${status}`);
	return { ok: true };
}
async function saveCoupon(input) {
	const db = await getSql();
	const code = input.code.trim().toUpperCase().replace(/\s+/g, "").slice(0, 16);
	if (code.length < 3) throw new Error("O código precisa de pelo menos 3 letras.");
	if (![
		"percent",
		"fixo",
		"entrega"
	].includes(input.kind)) throw new Error("Tipo de cupão inválido.");
	await db`
    insert into coupons (code, label, kind, value_kz, expires_at, max_uses, active)
    values (${code}, ${input.label.slice(0, 80)}, ${input.kind}, ${Math.max(0, Math.round(input.value))}, now() + interval '45 days', ${Math.max(1, Math.round(input.maxUses))}, true)
    on conflict (code) do update set label = excluded.label, kind = excluded.kind, value_kz = excluded.value_kz, active = true
  `;
	await audit(db, input.actor, "cupao", code);
	return { ok: true };
}
async function askGrok(actor) {
	const db = await getSql();
	if ((await db`
    select id from suggestions where source = 'grok' and created_at > now() - interval '20 seconds'
  `).length) throw new Error("Espera uns segundos antes de pedir outra sugestão.");
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("A IA não está disponível neste momento.");
	const lows = (await loadIngs(db)).filter((i) => i.stock <= i.min).slice(0, 6);
	const customers = await customerBoard();
	const risk = customers.filter((c) => c.tags.includes("em risco") || c.tags.includes("inativo")).slice(0, 4);
	const birthdays = customers.filter((c) => c.birthdaySoon).slice(0, 3);
	const top = await db`
    select name, sum(qty) as qty from order_items group by name order by sum(qty) desc limit 5
  `;
	const context = JSON.stringify({
		loja: "Pezzo Pizza, Maianga, Luanda. Terça a domingo 10h-20h. Fechado à segunda.",
		stockBaixo: lows.map((i) => ({
			nome: i.name,
			stock: i.stock,
			minimo: i.min,
			unidade: i.unit
		})),
		maisVendidos: top.map((t) => ({
			nome: str(t.name),
			qtd: num(t.qty)
		})),
		clientesParados: risk.map((c) => ({
			nome: c.name.split(" ")[0],
			dias: c.lastOrder ? Math.floor((Date.now() - new Date(c.lastOrder).getTime()) / 864e5) : null,
			etiquetas: c.tags
		})),
		aniversarios: birthdays.map((c) => ({
			nome: c.name.split(" ")[0],
			alergias: c.allergies,
			pizzas: c.pizzas
		})),
		regra: "A 10.ª pizza é oferta. Nada é enviado sem aprovação da gerência."
	});
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 450,
			temperature: .4,
			messages: [{
				role: "system",
				content: "És o assistente da Pezzo Pizza em Luanda. Responde APENAS com JSON: {\"title\",\"body\",\"audience\",\"message\",\"kind\"}. kind é um de: inativos, combo, stock, aniversario, dia_fraco. message é um WhatsApp curto em português de Angola, para o admin aprovar — não digas que já foi enviado. Não inventes números fora do contexto."
			}, {
				role: "user",
				content: context
			}]
		})
	});
	if (!res.ok) throw new Error(`O Grok não respondeu (${res.status}). Tenta outra vez daqui a pouco.`);
	const parsed = readSuggestion((await res.json()).choices?.[0]?.message?.content ?? "");
	await db`
    insert into suggestions (kind, title, body, audience, message, status, source)
    values (${parsed.kind}, ${parsed.title}, ${parsed.body}, ${parsed.audience}, ${parsed.message}, 'pendente', 'grok')
  `;
	await audit(db, actor, "sugestao.grok", parsed.title);
	return {
		ok: true,
		title: parsed.title
	};
}
function readSuggestion(text) {
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	const fallback = {
		title: "Sugestão do Grok",
		body: text.slice(0, 700),
		audience: "Gestão",
		message: "",
		kind: "geral"
	};
	if (start < 0 || end <= start) return fallback;
	try {
		const obj = JSON.parse(text.slice(start, end + 1));
		return {
			title: str(obj.title || fallback.title).slice(0, 120),
			body: str(obj.body).slice(0, 800),
			audience: str(obj.audience || "Gestão").slice(0, 140),
			message: str(obj.message).slice(0, 500),
			kind: str(obj.kind || "geral").slice(0, 40)
		};
	} catch {
		return fallback;
	}
}
async function adminSettings() {
	const db = await getSql();
	return {
		settings: await settingsOf(db),
		zones: await loadZones(db)
	};
}
async function saveSettings(input) {
	const db = await getSql();
	const phones = input.phones.split(/[|,]/).map((p) => p.trim()).filter(Boolean).join("|");
	if (!phones) throw new Error("Fica pelo menos um telefone.");
	const fence = Math.max(30, Math.min(500, Math.round(input.geofenceM)));
	const key = input.apiKey.trim().slice(0, 80);
	if (key.length < 8) throw new Error("A chave da API tem de ter pelo menos 8 caracteres.");
	await db`
    update settings set phones = ${phones}, geofence_m = ${fence}, api_key = ${key} where id = 1
  `;
	for (const z of input.zones) await db`
      update zones set fee_kz = ${Math.max(0, Math.round(z.feeKz))}, eta_min = ${Math.max(5, Math.round(z.etaMin))}
      where id = ${z.id}
    `;
	await audit(db, input.actor, "loja.definicoes", "contactos, geofence e zonas");
	return { ok: true };
}
async function auditLog() {
	return (await (await getSql())`
    select actor, action, detail, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
    from audit order by id desc limit 40
  `).map((r) => ({
		actor: str(r.actor),
		action: str(r.action),
		detail: str(r.detail),
		at: str(r.at)
	}));
}
async function assertAgent(key) {
	const settings = await settingsOf(await getSql());
	return Boolean(key) && key === settings.apiKey;
}
async function agentGet(kind) {
	if (kind === "resumo") {
		const dash = await dashboard();
		const shop = await settingsOf(await getSql());
		return {
			loja: shop.name,
			morada: shop.address,
			vendasEntreguesHojeKz: dash.salesKz,
			pedidosHoje: dash.orders,
			ticketMedioKz: dash.ticketKz,
			emAberto: dash.open,
			stockBaixo: dash.lowStock,
			presentes: dash.present
		};
	}
	if (kind === "pedidos") return listOrders();
	if (kind === "stock") return (await stockBoard()).ingredients.map((i) => ({
		nome: i.name,
		unidade: i.unit,
		stock: i.stock,
		minimo: i.min,
		baixo: i.stock <= i.min
	}));
	if (kind === "clientes") return (await customerBoard()).map((c) => ({
		nome: c.name,
		telefone: c.phone,
		etiquetas: c.tags,
		gastoKz: c.spent,
		pedidos: c.orders,
		pizzas: c.pizzas,
		optIn: c.optIn,
		ultimoPedido: c.lastOrder
	}));
	if (kind === "eventos") return (await (await getSql())`
      select id, type, payload, to_char(at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at
      from events order by id desc limit 40
    `).map((r) => ({
		id: num(r.id),
		tipo: str(r.type),
		payload: str(r.payload),
		at: str(r.at)
	}));
	throw new Error("Recurso desconhecido.");
}
async function agentCreate(body) {
	if (!body || typeof body !== "object") throw new Error("JSON inválido.");
	const b = body;
	const cliente = b.cliente ?? {};
	const itens = Array.isArray(b.itens) ? b.itens : [];
	return createOrder({
		clientRef: str(b.clientRef || crypto.randomUUID()),
		customerName: str(cliente.nome || b.nome),
		phone: str(cliente.telefone || b.telefone),
		channel: str(b.canal || "whatsapp") || "whatsapp",
		zoneId: num(b.zonaId || 2),
		address: str(b.morada),
		landmark: str(b.referencia),
		payment: str(b.pagamento || "dinheiro") || "dinheiro",
		proof: str(b.comprovativo),
		notes: str(b.notas),
		coupon: str(b.cupao),
		actor: "Agente",
		items: itens.map((item) => {
			const it = item;
			return {
				productId: num(it.produtoId),
				qty: num(it.qtd || 1),
				notes: str(it.notas),
				extras: Array.isArray(it.extras) ? it.extras.map((n) => num(n)) : []
			};
		})
	});
}
//#endregion
export { acceptDelivery, adminSettings, agentCreate, agentGet, askGrok, assertAgent, auditLog, cancelOrder, confirmDelivery, courierBoard, createOrder, customerBoard, dashboard, decideSuggestion, doPunch, fetchHome, fetchMenu, fichas, finishPrep, kitchenBoard, listOrders, markPreparing, orderDetail, pingCourier, punchBoard, quoteOrder, saveCoupon, saveCustomer, saveIngredientCost, saveProduct, saveRecipe, saveSettings, stockAdjust, stockBoard, suggestionBoard, tracking };
