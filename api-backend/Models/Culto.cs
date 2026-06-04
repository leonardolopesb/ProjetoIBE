using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiBackend.Models;

public enum Turno
{
    Manha = 1,
    Noite = 2
}

public class Culto
{
    [Key]
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("registro")]
    public DateTime Registro { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("data")]
    public DateOnly Data { get; set; }

    [JsonIgnore]
    public Turno Turno { get; set; }

    [JsonPropertyName("horario")]
    [NotMapped]
    public string Horario
    {
        get => Turno == Turno.Manha ? "Manhã" : "Noite";
        set => Turno = value == "Manhã" ? Turno.Manha : Turno.Noite;
    }

    [JsonPropertyName("lider_recepcao")]
    public string LiderRecepcao { get; set; } = string.Empty;

    [JsonIgnore]
    public int GrupoRecepcao { get; set; }

    [JsonPropertyName("grupo")]
    [NotMapped]
    public string GrupoFormatado
    {
        get => Data.DayOfWeek == DayOfWeek.Saturday ? "Renove" : $"{GrupoRecepcao}ª Domingo";
        set
        {
            if (!string.IsNullOrEmpty(value))
            {
                var limpo = value.Replace("ª Domingo", "").Trim();
                if (int.TryParse(limpo, out int grupo))
                {
                    GrupoRecepcao = grupo;
                }
            }
        }
    }

    public void CalcularGrupoRecepcao()
    {
        GrupoRecepcao = ((Data.Day - 1) / 7) + 1;
    }

    [JsonPropertyName("contagens")]
    public Contagem? Contagens { get; set; }
}