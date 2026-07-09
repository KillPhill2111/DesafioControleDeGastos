using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO.Pipes;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Pessoa
    {
        [Key]
        public Guid Id {get;set;}= Guid.NewGuid(); 
        //DefiniçOes obrigatorios do nome de usuario
        [Required(ErrorMessage ="O nome da péssoa é obrigatório!")]
        [StringLength(100, ErrorMessage ="O nome não pode ultrapassar 100 caracteres!")]
        public string Nome {get;set;}=String.Empty;
        //DefiniçOes obrigatorios da idade de usuario
        [Required(ErrorMessage ="A idade da pessoa é obrigatória! ")]
        [Range(0,150, ErrorMessage ="Insiria uma idade válida!!!")]
        public int Idade{get;set;}

        [JsonIgnore]
        [InverseProperty("Pessoa")]
        public List<Transacao> Transacoes{get;set;}=new ();

    }
}