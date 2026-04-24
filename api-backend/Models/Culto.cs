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

    // Data do Culto (dd/mm/yyyy)
    public DateOnly Data { get; set; }

    // Manhã/Noite
    public Turno Turno { get; set; }

    // Líder da Escala
    public string LiderRecepcao { get; set; } = null!;

    // Escala da Recepção (número do domingo)
    public int GrupoRecepcao { get; set; }

    public void CalcularGrupoRecepcao()
    {
        GrupoRecepcao = ((Data.Day - 1) / 7) + 1;
    }

    public List<Contagem> Contagens { get; set; } = new List<Contagem>();
}