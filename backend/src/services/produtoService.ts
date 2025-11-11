import { ProdutoRepository } from '../repositories/produtoRepository';
import { Produto } from '../types';

const produtoRepository = new ProdutoRepository();

export class ProdutoService {
  async getAllProdutos(filtro?: { id_categoria?: number; disponivel?: boolean }): Promise<Produto[]> {
    return produtoRepository.findAll(filtro);
  }

  async getProdutoById(id: number): Promise<Produto | null> {
    return produtoRepository.findById(id);
  }

  async createProduto(
    nome: string,
    preco: number,
    id_categoria: number,
    descricao?: string,
    disponivel: boolean = true
  ): Promise<Produto> {
    if (preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }

    return produtoRepository.create(nome, preco, id_categoria, descricao, disponivel);
  }

  async updateProduto(
    id: number,
    nome?: string,
    descricao?: string,
    preco?: number,
    id_categoria?: number,
    disponivel?: boolean
  ): Promise<Produto> {
    const produtoExistente = await produtoRepository.findById(id);
    if (!produtoExistente) {
      throw new Error('Produto não encontrado');
    }

    if (preco !== undefined && preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }

    return produtoRepository.update(id, nome, descricao, preco, id_categoria, disponivel);
  }

  async deleteProduto(id: number): Promise<boolean> {
    const produtoExistente = await produtoRepository.findById(id);
    if (!produtoExistente) {
      throw new Error('Produto não encontrado');
    }

    return produtoRepository.delete(id);
  }
}