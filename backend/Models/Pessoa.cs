using System.ComponentModel.DataAnnotations;
using System.IO.Pipes;

namespace backend.Models
{
    public class Pessoa
    {
        [Key]
        public Guid Id {get;set;}= Guid.NewGuid(); 
        //Definições obrigatorios do nome de usuario
        [Required(ErrorMessage ="O nome da péssoa é obrigatório!")]
        [StringLength(100, ErrorMessage ="O nome não pode ultrapassar 100 caracteres!")]
        public string Nome {get;set;}=String.Empty;
        //Definições obrigatorios da idade de usuario
        [Required(ErrorMessage ="A idade da pessoa é obrigatória! ")]
        [Range(0,15, ErrorMessage ="Insiria uma idade válida1")]
        public int Idade{get;set;}

        public List<Transacao> Transacoes{get;set;}=new ();

    }
}