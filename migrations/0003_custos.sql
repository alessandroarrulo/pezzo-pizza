-- Preços de compra de Luanda (Outubro 2026) e fichas técnicas alinhadas
-- à análise de custos da Pezzo. Unidades: g, ml ou unidade.
-- cost_cents é o custo em cêntimos de kwanza por 1 unidade de stock.

update ingredients set cost_cents = 1700 where id = 3;   -- mozzarella 17.000 Kz/kg → 1.700 cêntimos/g
update ingredients set cost_cents = 600  where id = 11;  -- peito de frango 6.000 Kz/kg
update ingredients set cost_cents = 150  where id = 2;   -- molho de tomate 1.500 Kz/kg

insert into ingredients (name, unit, stock_qty, min_qty, portion, extra_kz, cost_cents)
select 'Coxa de frango', 'g', 4000, 800, 130, 0, 350
where not exists (select 1 from ingredients where name = 'Coxa de frango');

insert into ingredients (name, unit, stock_qty, min_qty, portion, extra_kz, cost_cents)
select 'Base de pizza', 'unidade', 36, 10, 1, 0, 80000
where not exists (select 1 from ingredients where name = 'Base de pizza');

-- Pocket: a massa continua por grama. 450 Kz por base de 150 g → 3 Kz/g.
update ingredients set cost_cents = 300 where id = 1;

-- Pão da magoga e do burger: 450 Kz, como na ficha ("pão / massa, baixo custo").
update ingredients set cost_cents = 45000 where id = 19;


-- Pocket: massa de 150 g (~450 Kz) + queijo ~80 g, como na ficha.
update recipes set qty = 80 where product_id between 1 and 4 and ingredient_id = 3;

-- Pizza 8 fatias e a base "cria a tua": uma base de 800 Kz no lugar da massa por grama.
-- Queijo médio 200 g; premium (Doce Vitá, 4 Estações, Mar) 220 g.
delete from recipes
where ingredient_id = 1
  and product_id in (select id from products where category_id = 2);

insert into recipes (product_id, ingredient_id, qty)
select p.id, b.id, 1
from products p
join ingredients b on b.name = 'Base de pizza'
where p.category_id = 2
on conflict (product_id, ingredient_id) do update set qty = 1;

update recipes set qty = 200 where product_id in (5, 6, 7, 8, 9, 10) and ingredient_id = 3;
update recipes set qty = 220 where product_id in (11, 12, 13) and ingredient_id = 3;

-- O pão da magoga custa pouco; os "outros" da ficha (ovo, fiambre, salada, molhos)
-- é que fazem o resto. Tira o fiambre para a ficha não duplicar esse custo.
delete from recipes where product_id in (15, 16) and ingredient_id = 4;

-- Magoga: 130 g de coxa + salada e molhos. Burger: 110 g de peito.
insert into recipes (product_id, ingredient_id, qty)
select p.id, i.id, 130
from products p
join ingredients i on i.name = 'Coxa de frango'
where p.id in (15, 16)
on conflict (product_id, ingredient_id) do update set qty = 130;

insert into recipes (product_id, ingredient_id, qty)
select 14, i.id, 110
from ingredients i where i.name = 'Frango'
on conflict (product_id, ingredient_id) do update set qty = 110;

-- Hambúrguer deixa de usar a unidade genérica de carne (custo irreal).
delete from recipes where product_id = 14 and ingredient_id = 20;
