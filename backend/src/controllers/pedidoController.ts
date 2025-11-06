import { Request, Response } from 'express';
import { PedidoService } from '../services/pedidoService';
import { ApiResponse } from '../types';

const pedidoService = new PedidoService();

export class PedidoController {
  async getAllPedidos(req: Request, res: Response) {
    try {
      const { status, id_mesa } = req.query;
      const filtro: any = {};
      if (status) filtro.status = status;
      if (id_mesa) filtro.id_mesa = parseInt(id_mesa as string);

      const pedidos = await pedidoService.getAllPedidos(filtro);

      return res.json({
        success: true,
        data: pedidos,
      } as ApiResponse);
    } catch (error: any) {
      console.error('❌ Erro em getAllPedidos:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar pedidos',
      } as ApiResponse);
    }
  }

  async getPedidoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedido = await pedidoService.getPedidoById(parseInt(id));

      if (!pedido) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado',
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: pedido,
      } as ApiResponse);
    } catch (error: any) {
      console.error('❌ Erro em getPedidoById:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar pedido',
      } as ApiResponse);
    }
  }

  async createPedido(req: Request, res: Response) {
    try {
      const { id_mesa } = req.body;
      const id_garcom = req.user?.id;

      if (!id_mesa || !id_garcom) {
        return res.status(400).json({
          success: false,
          error: 'ID da mesa e ID do garçom são obrigatórios',
        } as ApiResponse);
      }

      const pedido = await pedidoService.createPedido(id_mesa, id_garcom);

      return res.status(201).json({
        success: true,
        data: pedido,
      } as ApiResponse);
    } catch (error: any) {
      console.error('❌ Erro em createPedido:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao criar pedido',
      } as ApiResponse);
    }
  }

  async updatePedidoStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const id_usuario = req.user?.id;

      if (!status || !id_usuario) {
        return res.status(400).json({
          success: false,
          error: 'Status e ID do usuário são obrigatórios',
        } as ApiResponse);
      }

      const pedido = await pedidoService.updatePedidoStatus(parseInt(id), status, id_usuario);

      return res.json({
        success: true,
        data: pedido,
      } as ApiResponse);
    } catch (error: any) {
      console.error('❌ Erro em updatePedidoStatus:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar pedido',
      } as ApiResponse);
    }
  }

  async deletePedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const id_usuario = req.user?.id;

      if (!id_usuario) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório',
        } as ApiResponse);
      }

      const resultado = await pedidoService.deletePedido(parseInt(id), id_usuario);

      if (!resultado) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado',
        } as ApiResponse);
      }

      return res.json({
        success: true,
        message: 'Pedido deletado com sucesso',
      } as ApiResponse);
    } catch (error: any) {
      console.error('❌ Erro em deletePedido:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao deletar pedido',
      } as ApiResponse);
    }
  }

  async addItemPedido(req: Request, res: Response) {
    try {
      const { id_pedido } = req.params;
      const { id_produto, quantidade, preco_unitario, observacoes } = req.body;
      const id_usuario = req.user?.id;

      if (!id_produto || !quantidade || !preco_unitario) {
        return res.status(400).json({
          success: false,
          error: 'ID do produto, quantidade e preço unitário são obrigatórios',
        } as ApiResponse);
      }

      const item = await pedidoService.addItemPedido(
        parseInt(id_pedido),
        id_produto,
        quantidade,
        preco_unitario,
        observacoes,
        id_usuario
      );

      return res.status(201).json({
        success: true,
        data: item,
      } as ApiResponse);
    } catch (error: any) {
      console.error('❌ Erro em addItemPedido:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao adicionar item ao pedido',
      } as ApiResponse);
    }
  }

  async updateItemStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status_cozinha } = req.body;
      const id_usuario = req.user?.id;

      console.log('🔹 updateItemStatus - Dados recebidos:', { 
        id, 
        status_cozinha, 
        id_usuario,
        body: req.body 
      });

      if (!status_cozinha) {
        console.log('❌ Status da cozinha não foi enviado');
        return res.status(400).json({
          success: false,
          error: 'Status da cozinha é obrigatório',
        } as ApiResponse);
      }

      if (!id_usuario) {
        console.log('❌ ID do usuário não encontrado');
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório',
        } as ApiResponse);
      }

      console.log('🔹 Chamando pedidoService.updateItemStatus...');
      const item = await pedidoService.updateItemStatus(parseInt(id), status_cozinha, id_usuario);

      console.log('✅ Item atualizado com sucesso:', item);

      return res.json({
        success: true,
        data: item,
      } as ApiResponse);
    } catch (error: any) {
      console.error('❌ ERRO em updateItemStatus:');
      console.error('❌ Mensagem:', error.message);
      console.error('❌ Stack:', error.stack);
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar item',
      } as ApiResponse);
    }
  }

  async updateItemPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantidade, observacoes } = req.body;
      const id_usuario = req.user?.id;

      if (!quantidade || quantidade < 1) {
        return res.status(400).json({
          success: false,
          error: 'Quantidade deve ser maior que zero',
        } as ApiResponse);
      }

      if (!id_usuario) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório',
        } as ApiResponse);
      }

      const item = await pedidoService.updateItemPedido(parseInt(id), quantidade, observacoes, id_usuario);

      return res.json({
        success: true,
        data: item,
      } as ApiResponse);
    } catch (error: any) {
      console.error('❌ Erro em updateItemPedido:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao atualizar item',
      } as ApiResponse);
    }
  }

  async deleteItemPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const id_usuario = req.user?.id;

      if (!id_usuario) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório',
        } as ApiResponse);
      }

      const resultado = await pedidoService.deleteItemPedido(parseInt(id), id_usuario);

      if (!resultado) {
        return res.status(404).json({
          success: false,
          error: 'Item do pedido não encontrado',
        } as ApiResponse);
      }

      return res.json({
        success: true,
        message: 'Item deletado com sucesso',
      } as ApiResponse);
    } catch (error: any) {
      console.error('❌ Erro em deleteItemPedido:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao deletar item',
      } as ApiResponse);
    }
  }
}