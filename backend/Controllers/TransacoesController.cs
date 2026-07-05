using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/transacoes")] 
    public class TransacoesController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        // FUNCIONALIDADE OBRIGATÓRIA: Listagem de Transações
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
        {
            return await _context.Transacaos.ToListAsync();
        }

        
        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao([FromBody]TransacaoDTO dto)
        {
            // 1. REGRA DE NEGÓCIO: Verifica se a pessoa informada existe no cadastro
            var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
            if (pessoa == null)
            {
                return BadRequest("A pessoa informada não existe no sistema.");
            }

            // 2. CONVERSÃO SEGURA: Tenta converter o texto vindo do React ("Receita"/"Despesa") para o Enum do C#
            if (!Enum.TryParse<TipoTransacao>(dto.Tipo, true, out var tipoEnum))
            {
                return BadRequest("O tipo de transação enviado é inválido. Use 'Receita' ou 'Despesa'.");
            }

            // 3. REGRA DE NEGÓCIO: Menor de idade (menor de 18 anos) só pode cadastrar DESPESAS
            if (pessoa.Idade < 18 && tipoEnum == TipoTransacao.Receita)
            {
                return BadRequest("Menores de 18 anos só podem registrar despesas.");
            }

            // 4. MAPEAMENTO: Transfere os dados limpos do DTO para a entidade física do banco de dados
            var novaTransacao = new Transacao
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                Tipo = tipoEnum, // Injeta o Enum convertido com sucesso
                PessoaId = dto.PessoaId
            };

            _context.Transacaos.Add(novaTransacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransacoes), new { id = novaTransacao.Id }, novaTransacao);
        }
    }
}
