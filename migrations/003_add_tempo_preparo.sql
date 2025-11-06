
ALTER TABLE itens_pedido
ADD COLUMN iniciado_em DATETIME DEFAULT NULL AFTER status_cozinha;


UPDATE itens_pedido 
SET iniciado_em = criado_em 
WHERE status_cozinha IN ('em_preparo', 'pronto', 'entregue') 
AND iniciado_em IS NULL;