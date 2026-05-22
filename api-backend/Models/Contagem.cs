using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiBackend.Models;

public class Contagem
{
    [Key]
    [JsonIgnore]
    public Guid Id { get; set; }

    [JsonPropertyName("pulpito")]
    public int QuantidadePulpito { get; set; }

    [JsonIgnore] public int QuantidadeCadeirasA { get; set; }
    [JsonIgnore] public int QuantidadeCadeirasB { get; set; }
    [JsonIgnore] public int QuantidadeCadeirasC { get; set; }
    [JsonIgnore] public int QuantidadeCadeirasD { get; set; }

    [JsonPropertyName("cadeiras")]
    [NotMapped]
    public Cadeiras Cadeiras 
    { 
        get => new Cadeiras 
        { 
            A = QuantidadeCadeirasA, 
            B = QuantidadeCadeirasB, 
            C = QuantidadeCadeirasC, 
            D = QuantidadeCadeirasD 
        };
        set 
        {
            if (value != null)
            {
                QuantidadeCadeirasA = value.A;
                QuantidadeCadeirasB = value.B;
                QuantidadeCadeirasC = value.C;
                QuantidadeCadeirasD = value.D;
            }
        }
    }

    [JsonPropertyName("galeria")]
    public int QuantidadeGaleria { get; set; }

    [JsonPropertyName("salas")]
    public int QuantidadeSalas { get; set; }

    [JsonPropertyName("externo")]
    public int QuantidadeExterno { get; set; }

    [JsonPropertyName("online")]
    public int QuantidadeOnline { get; set; }

    [JsonPropertyName("total")]
    public int Total { get; set; }

    [JsonIgnore]
    public Guid CultoId { get; set; }

    public void CalcularTotal()
    {
        Total = QuantidadeCadeirasA + QuantidadeCadeirasB + QuantidadeCadeirasC + QuantidadeCadeirasD +
                QuantidadePulpito + QuantidadeGaleria + QuantidadeSalas + QuantidadeExterno + QuantidadeOnline;
    }
}

public class Cadeiras
{
    [JsonPropertyName("A")]
    public int A { get; set; }

    [JsonPropertyName("B")]
    public int B { get; set; }

    [JsonPropertyName("C")]
    public int C { get; set; }

    [JsonPropertyName("D")]
    public int D { get; set; }
}