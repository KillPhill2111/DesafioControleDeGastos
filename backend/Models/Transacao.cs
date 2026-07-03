using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public enum TipoTransacao
    {
        Receita, //0
        Despesas //1
    }
    public class Transacao
    {
        [Key]
        public Guid Id{get;set;}=Guid.NewGuid();

        //Definições obrigatoria da decrição da transação
        [Required(ErrorMessage ="A descrição é obrigatoria.")]
        public string Descricao{get;set;}=string.Empty;

        //Definições obrigatoria do valor da transação
        [Required(ErrorMessage ="O valor é obrigatório")]
        [Range(0.01,double.MaxValue,ErrorMessage ="O valor deve ser maior que zero...")]
        [Column(TypeName ="decimal(18,2)")]
        public decimal Valor{get;set;}

        //Definições obrigatoria do tipo da transação
        [Required(ErrorMessage ="A transação precisa ser definida!")]
        [JsonConverter(typeof(JsonStringEnumConverter))]//("Receita"/"Despesa") ==>> 0/1
        public TipoTransacao Tipo{get;set;}

        [Required(ErrorMessage ="O identificador da pessoa é orbigatoório...")]
        public Guid PessoaId{get;set;}

        //relacionamento:--- Vincula a trasção a respectibva
        [JsonIgnore]
        public Pessoa? Pessoa{get;set;}


    }

}