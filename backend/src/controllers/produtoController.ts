import { Request, Response } from 'express';
import { ProdutoService } from '../services/produtoService';
import { ApiResponse } from '../types';

const produtoService = new ProdutoService();

export class ProdutoController {
  async getAllProdutos(req: Request, res: Response) {
    try {
      const { id_categoria, disponivel } = req.query;
      
      const filtro: any = {};
      if (id_categoria) filtro.id_categoria = parseInt(id_categoria as string);
      if (disponivel !== undefined) filtro.disponivel = disponivel === 'true';
      
      const produtos = await produtoService.getAllProdutos(filtro);
      
      return res.json({
        success: true,
        data: produtos,
      } as ApiResponse);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar produtos',
      } as ApiResponse);
    }
  }

  async getProdutoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const produto = await produtoService.getProdutoById(parseInt(id));
      
      if (!produto) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
        } as ApiResponse);
      }
      
      return res.json({
        success: true,
        data: produto,
      } as ApiResponse);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar produto',
      } as ApiResponse);
    }
  }

  // NOVOS MÉTODOS
  async createProduto(req: Request, res: Response) {
    try {
      const { nome, descricao, preco, id_categoria, disponivel } = req.body;

      if (!nome || !preco || !id_categoria) {
        return res.status(400).json({
          success: false,
          error: 'Nome, preço e categoria são obrigatórios',
        } as ApiResponse);
      }

      const produto = await produtoService.createProduto(
        nome,
        preco,
        id_categoria,
        descricao,
        disponivel !== undefined ? disponivel : true
      );

      return res.status(201).json({
        success: true,
        data: produto,
      } as ApiResponse);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao criar produto',
      } as ApiResponse);
    }
  }

  async updateProduto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, id_categoria, disponivel } = req.body;

      const produto = await produtoService.updateProduto(
        parseInt(id),
        nome,
        descricao,
        preco,
        id_categoria,
        disponivel
      );

      return res.json({
        success: true,
        data: produto,
      } as ApiResponse);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar produto',
      } as ApiResponse);
    }
  }

  async deleteProduto(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const resultado = await produtoService.deleteProduto(parseInt(id));

      if (!resultado) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
        } as ApiResponse);
      }

      return res.json({
        success: true,
        message: 'Produto deletado com sucesso',
      } as ApiResponse);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao deletar produto',
      } as ApiResponse);
    }
  }
}