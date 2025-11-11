import { Router } from 'express';
import { ProdutoController } from '../controllers/produtoController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const produtoController = new ProdutoController();

// Todas as rotas de produtos requerem autenticação
router.use(authMiddleware);

// Rotas de produtos
router.get('/', (req, res) => produtoController.getAllProdutos(req, res));
router.get('/:id', (req, res) => produtoController.getProdutoById(req, res));
router.post('/', (req, res) => produtoController.createProduto(req, res));
router.put('/:id', (req, res) => produtoController.updateProduto(req, res));
router.delete('/:id', (req, res) => produtoController.deleteProduto(req, res));

export default router;