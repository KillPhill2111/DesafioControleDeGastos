using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/totais")]
    public class TotaisController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context= context;
        // public TotaisController(AppDbContext context)
        // {
        //     _context=context;
        // }
        [HttpGet]
        public async Task<IActionResult> GetTotais()
        {
            var pessoasComTotais= await _context.Pessoas
            .Select(p => new
            {
                p.Id,
                p.Nome,
                //Aqui filtra e soma apenas as transações do tipo receita...
                TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => (decimal?)t.Valor) ?? 0,
                //Filtra e soma transações do tipo despesas
                TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => (decimal?)t.Valor) ?? 0,
                //Calcula o saldo individual (Receita-despesas)
                Saldo = (p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => (decimal?)t.Valor) ?? 0) - 
                            (p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => (decimal?)t.Valor) ?? 0)
                }).ToListAsync();
                // Caclula os totais do cabeçalho somando os resultados
                var gerarReceitas = pessoasComTotais.Sum(p => p.TotalReceitas);
                var gerarDespesas = pessoasComTotais.Sum(p => p.TotalDespesas);
                var saldoLiquido = gerarReceitas - gerarDespesas;

                return Ok(new
                    {
                        Pessoas=pessoasComTotais,
                        Geral=new
                        {
                            TotalReceitas=gerarReceitas,
                            TotalDespesas=gerarDespesas,
                            SaldoLiquido=saldoLiquido
                        }
                    }
                );
        }
    }
}