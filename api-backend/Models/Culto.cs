using System.ComponentModel.DataAnnotations;

namespace ApiBackend.Models;

public enum Turno
{
    Manha = 1,
    Noite = 2
}

public class Culto
{
    [Key]
    public Guid Id { get; set; }

    public DateOnly Data { get; set; }

    public Turno Turno { get; set; }

    public List<Contagem> Contagens { get; set; } = new List<Contagem>();
}