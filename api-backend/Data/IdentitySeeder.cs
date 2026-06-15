using Microsoft.AspNetCore.Identity;

namespace ApiBackend.Data;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("IdentitySeeder");

        // Roles do nível de acesso
        string[] roles = { "Admin", "Analista", "Lider" };
        foreach (var r in roles)
        {
            if (!await roleManager.RoleExistsAsync(r))
                await roleManager.CreateAsync(new IdentityRole(r));
        }

        // Resgata os segredos
        var adminUserName = configuration["ADMIN_USERNAME"];
        var adminPassword = configuration["ADMIN_PASSWORD"];

        if (string.IsNullOrWhiteSpace(adminUserName) || string.IsNullOrWhiteSpace(adminPassword))
        {
            logger.LogWarning("Credenciais de Admin ausentes no user-secrets.");
            return;
        }

        // Cria um novo admin caso não exista ainda
        var admin = await userManager.FindByNameAsync(adminUserName);
        if (admin is null)
        {
            admin = new IdentityUser
            {
                UserName = adminUserName,
                // O email é obrigatório na classe base
                Email = $"{adminUserName}@recepcao.ibe" 
            };

            var create = await userManager.CreateAsync(admin, adminPassword);

            if (create.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
                logger.LogInformation("Admin criado com sucesso: {username}", adminUserName);
            }
            else
            {
                logger.LogError("Falha ao criar admin: {errors}", string.Join(", ", create.Errors.Select(e => e.Description)));
            }
        }
    }
}