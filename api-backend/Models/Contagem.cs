using System.ComponentModel.DataAnnotations;

namespace ApiBackend.Models;

public class Contagem
{
    [Key]
    public Guid Id { get; set; }

    public int QuantidadeCadeirasA { get; set; }
    public int QuantidadeCadeirasB { get; set; }
    public int QuantidadeCadeirasC { get; set; }
    public int QuantidadeCadeirasD { get; set; }
    public int QuantidadeGaleria { get; set; }
    public int QuantidadePulpito { get; set; }
    public int QuantidadeSalas { get; set; }
    public int QuantidadeExterno { get; set; }
    public int QuantidadeOnline { get; set; }

    public int Total { get; set; }

    public Guid CultoId { get; set; }

    public void CalcularTotal()
    {
        Total = QuantidadeCadeirasA + QuantidadeCadeirasB + QuantidadeCadeirasC + QuantidadeCadeirasD +
        QuantidadePulpito + QuantidadeGaleria + QuantidadeSalas + QuantidadeExterno + QuantidadeOnline;
    }
}