using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base (options){}

        //Mapeia a classe Pessoa para uma tabela chamada "Pessoas"
        public DbSet<Pessoa> Pessoas {get;set;}= null!;
        //Mapeia a classe Pessoa para uma tabela chamada "Transações"
        public DbSet<Transacao>Transacaos{get;set;}=null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /*
            Regra de negocio:::
                Aqui iremos dizewr ao banco de dados: "Uma pessoa tem muitas transações (HasMany),
                mas uma transação pertence apena a uma unica pessoa (WhitOne);
                Além disso, se uma pessoa for deletada, todo o historico de transações dela vai junto, 
                subtraido do total da familia (DeletedBehavior.Cascade)
            */
            modelBuilder.Entity<Pessoa>()
                .HasMany(p=>p.Transacoes)
                .WithOne(t=>t.Pessoa)
                .HasForeignKey(T=>T.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}