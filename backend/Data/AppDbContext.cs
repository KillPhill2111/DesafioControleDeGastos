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
                Aqui iremos dizer ao banco de dados: "Uma pessoa tem muitas transações (HasMany),
                mas uma transação pertence apenas a uma única pessoa (WithOne);
                Além disso, se uma pessoa for deletada, todo o histórico de transações dela vai junto, 
                subtraído do total da família (DeleteBehavior.Cascade)
            */
            
            modelBuilder.Entity<Transacao>()
                .HasOne(t => t.Pessoa)
                .WithMany(p => p.Transacoes)
                .HasForeignKey(t => t.PessoaId) // Usando o 't' minúsculo combinado com o DTO
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}