using Microsoft.EntityFrameworkCore;
using ApiBackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ApiBackend.Data;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Culto> Cultos { get; set; }
    public DbSet<Contagem> Contagens { get; set; }
}