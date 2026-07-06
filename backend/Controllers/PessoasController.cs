using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/pessoas")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context=context;
        }
        //Listagem de pessoas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
        {
            return await _context.Pessoas.ToListAsync();
        }
        //Criação de pessoas
        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
        {
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
            // Retorna 201 Create indicando que o registro foi salvo
            return CreatedAtAction(nameof(GetPessoas), new {id=pessoa.Id}, pessoa);

        }

        //Essa funcionalidade é a de deletar a pessaoa com delação em cascata
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePessoa(Guid id)
        {
            var p=await _context.Pessoas.FindAsync(id);
            if (p==null)
            {
                return NotFound("A pessoa não foi encontrada no sistema");
            }

            var transacoesDaPessoa=_context.Transacaos.Where(t=>t.PessoaId==id);

            _context.Transacaos.RemoveRange(transacoesDaPessoa);           
            //Regra de negocio, deletar a pessoa e todas as transações dela
            _context.Pessoas.Remove(p);
            await _context.SaveChangesAsync();
            return NoContent(); //Retorna status 204... sucesso sem conteudo
        }

    }
}