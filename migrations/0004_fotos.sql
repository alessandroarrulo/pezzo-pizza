-- Fotos reais da casa (Outubro 2026), uma por sabor.

update products set photo = '/menu/real/bela.jpg' where slug in ('pocket-bela', 'pizza-bela', 'pizza-sempre');
update products set photo = '/menu/real/aloha.jpg' where slug in ('pocket-aloha', 'pizza-aloha');
update products set photo = '/menu/real/pezzo.jpg' where slug in ('pocket-pezzo', 'pizza-pezzo', 'cria-a-tua');
update products set photo = '/menu/real/frango.jpg' where slug in ('pocket-sweet', 'pizza-amor');
update products set photo = '/menu/real/estacoes.jpg' where slug = 'pizza-estacoes';
update products set photo = '/menu/real/mar.jpg' where slug = 'pizza-mar';
