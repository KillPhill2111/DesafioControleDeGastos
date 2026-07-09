using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public enum TipoTransacao
    {
        Receita, // 0
        Despesa  // 1
    }

    public class TransacaoDTO
    {
        [JsonPropertyName("descricao")]
        public string Descricao { get; set; } = string.Empty;

        [JsonPropertyName("valor")]
        public decimal Valor { get; set; }

        [JsonPropertyName("tipo")]
        public string Tipo { get; set; } = string.Empty;

        [JsonPropertyName("pessoaId")]
        public Guid PessoaId { get; set; }
    }

    public class Transacao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "O valor é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero...")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "A transação precisa ser definida!")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "O identificador da pessoa é obrigatório...")]
        public Guid PessoaId { get; set; } // Mantemos APENAS este no singular!

        // RELACIONAMENTO: Vincula a transaçao à sua respectiva pessoa
        // Colocmos o ForeignKey aqui para amarrar o objeto Pessoa estritamente a coluna PessoaId do C#
        [JsonIgnore]
        [ForeignKey("PessoaId")]
        public Pessoa? Pessoa { get; set; }
    }
}
