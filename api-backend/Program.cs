using FluentValidation;
using ApiBackend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ApiBackend.Controllers;

var builder = WebApplication.CreateBuilder(args);

// 1. Libera o CORS globalmente
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2. Adiciona conexão do Banco de Dados PRIMEIRO
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Adiciona o Identity (Agora ele sabe que o AppDbContext já existe)
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options => 
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 8; // IMPORTANTE: Sua senha do user-secrets agora precisa ter no mínimo 8 caracteres!
    options.Password.RequireNonAlphanumeric = false; 
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// 4. Adiciona os serviços dos Controllers e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 5. Registrando os validadores do FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// 6. Lê a porta que o Render fornecer
var port = Environment.GetEnvironmentVariable("PORT") ?? "5115";
builder.WebHost.UseUrls($"http://*:{port}");

// ==========================================
// CONSTRUÇÃO DO APP
// ==========================================
var app = builder.Build();

// 7. Chamando o Seeder para criar o Admin automaticamente
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // 1º Aplica as migrations no banco remoto (Cria as tabelas se não existirem)
        var db = services.GetRequiredService<AppDbContext>();
        db.Database.Migrate();

        // 2º Roda o Seeder para criar o Admin
        await IdentitySeeder.SeedAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Um erro ocorreu ao criar o banco ou o usuário Admin inicial.");
    }
}

// 8. Pipeline de execução
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

// Apenas redireciona para HTTPS em produção (evita avisos no localhost)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.MapControllers();

app.Run();