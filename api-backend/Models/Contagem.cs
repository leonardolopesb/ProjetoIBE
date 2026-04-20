using System.ComponentModel.DataAnnotations;

namespace ApiBackend.Models;

public class Contagem
{
    [Key]
    public Guid Id { get; set; }

    public int Quantidade { get; set; }

    public Guid CultoId { get; set; }
}