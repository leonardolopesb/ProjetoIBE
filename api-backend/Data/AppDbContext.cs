using Microsoft.EntityFrameworkCore;
using ApiBackend.Models;

namespace ApiBackend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Culto> Cultos { get; set; }
    public DbSet<Contagem> Contagens { get; set; }
}