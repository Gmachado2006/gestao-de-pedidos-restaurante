import { useState, useEffect } from 'react';
import { produtoService } from '@/services/produtoService';
import { Produto } from '@/types';

interface ModalCardapioProps {
  mostrar: boolean;
  onFechar: () => void;
}

export function ModalCardapio({ mostrar, onFechar }: ModalCardapioProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  
  // Estados do formulário
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('1');
  const [disponivel, setDisponivel] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (mostrar) {
      carregarProdutos();
    }
  }, [mostrar]);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      const dados = await produtoService.getAllProdutos();
      setProdutos(dados);
      setErro('');
    } catch (error: any) {
      setErro(error.message || 'Erro ao carregar produtos');
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setPreco('');
    setCategoria('1');
    setDisponivel(true);
    setModoEdicao(false);
    setProdutoEditando(null);
  };

  const handleNovoProduto = () => {
    limparFormulario();
    setModoEdicao(true);
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setNome(produto.nome);
    setDescricao(produto.descricao || '');
    setPreco(produto.preco.toString());
    setCategoria(produto.id_categoria.toString());
    setDisponivel(produto.disponivel);
    setModoEdicao(true);
  };

  const handleSalvar = async () => {
    if (!nome.trim()) {
      setErro('Nome é obrigatório');
      return;
    }

    const precoNum = parseFloat(preco);
    if (isNaN(precoNum) || precoNum <= 0) {
      setErro('Preço deve ser maior que zero');
      return;
    }

    try {
      setSalvando(true);
      
      if (produtoEditando) {
        await produtoService.updateProduto(
          produtoEditando.id,
          nome,
          precoNum,
          parseInt(categoria),
          descricao || undefined,
          disponivel
        );
      } else {
        await produtoService.createProduto(
          nome,
          precoNum,
          parseInt(categoria),
          descricao || undefined,
          disponivel
        );
      }

      limparFormulario();
      carregarProdutos();
      setErro('');
    } catch (error: any) {
      setErro(error.message || 'Erro ao salvar produto');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (id: number, nomeProduto: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${nomeProduto}"?`)) return;

    try {
      await produtoService.deleteProduto(id);
      carregarProdutos();
      setErro('');
    } catch (error: any) {
      setErro(error.message || 'Erro ao excluir produto');
    }
  };

  const handleToggleDisponivel = async (produto: Produto) => {
    try {
      await produtoService.updateProduto(
        produto.id,
        undefined,
        undefined,
        undefined,
        undefined,
        !produto.disponivel
      );
      carregarProdutos();
    } catch (error: any) {
      setErro(error.message || 'Erro ao atualizar disponibilidade');
    }
  };

  if (!mostrar) return null;

  const categorias = [
    { id: 1, nome: 'Bebidas' },
    { id: 2, nome: 'Entradas' },
    { id: 3, nome: 'Pratos Principais' },
    { id: 4, nome: 'Acompanhamentos' },
    { id: 5, nome: 'Sobremesas' },
    { id: 6, nome: 'Bebidas Alcoólicas' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">📋 Gerenciar Cardápio</h2>
          <button
            onClick={onFechar}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto p-6">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
              <span>{erro}</span>
              <button onClick={() => setErro('')} className="text-red-700 font-bold">✕</button>
            </div>
          )}

          {/* Botão Novo Produto */}
          {!modoEdicao && (
            <div className="mb-6">
              <button
                onClick={handleNovoProduto}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
              >
                + Novo Produto
              </button>
            </div>
          )}

          {/* Formulário de Edição/Criação */}
          {modoEdicao && (
            <div className="bg-gray-50 border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {produtoEditando ? 'Editar Produto' : 'Novo Produto'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: Feijão Tropeiro"
                    disabled={salvando}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                    disabled={salvando}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Categoria *
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={salvando}
                  >
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disponivel}
                      onChange={(e) => setDisponivel(e.target.checked)}
                      className="mr-2 w-5 h-5"
                      disabled={salvando}
                    />
                    <span className="text-gray-700 font-bold">Disponível</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={2}
                    placeholder="Descrição do produto (opcional)"
                    disabled={salvando}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSalvar}
                  disabled={salvando}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
                >
                  {salvando ? 'Salvando...' : '💾 Salvar'}
                </button>
                <button
                  onClick={limparFormulario}
                  disabled={salvando}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de Produtos */}
          {carregando ? (
            <p className="text-gray-500 text-center py-8">Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum produto cadastrado</p>
          ) : (
            <div className="space-y-3">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className={`border rounded-lg p-4 ${
                    produto.disponivel ? 'bg-white' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {produto.nome}
                        </h4>
                        {!produto.disponivel && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                            Indisponível
                          </span>
                        )}
                      </div>
                      {produto.descricao && (
                        <p className="text-sm text-gray-600 mb-2">{produto.descricao}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-bold text-green-600 text-lg">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                        <span className="text-gray-500">
                          {categorias.find((c) => c.id === produto.id_categoria)?.nome}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleDisponivel(produto)}
                        className={`${
                          produto.disponivel
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-green-500 hover:bg-green-600'
                        } text-white text-xs font-bold py-2 px-3 rounded transition`}
                        title={produto.disponivel ? 'Marcar como indisponível' : 'Marcar como disponível'}
                      >
                        {produto.disponivel ? '👁️' : '🔓'}
                      </button>
                      <button
                        onClick={() => handleEditarProduto(produto)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded transition"
                        title="Editar produto"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(produto.id, produto.nome)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-3 rounded transition"
                        title="Excluir produto"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <button
            onClick={onFechar}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}