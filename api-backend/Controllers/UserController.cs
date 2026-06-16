using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IValidator<CreateUserDto> _createValidator;
    private readonly IValidator<UpdateUserDto> _updateValidator;

    public UserController(
        UserManager<IdentityUser> userManager,
        IValidator<CreateUserDto> createValidator,
        IValidator<UpdateUserDto> updateValidator)
    {
        _userManager = userManager;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.Username);

        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            return Unauthorized(new { message = "Usuário ou senha inválidos." });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var userRole = roles.FirstOrDefault()?.ToLower() ?? "analista";

        return Ok(new
        {
            id = user.Id,
            username = user.UserName,
            role = userRole
        });
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        var validationResult = await _createValidator.ValidateAsync(dto);
        if (!validationResult.IsValid) return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));

        var existingUser = await _userManager.FindByNameAsync(dto.Username);
        if (existingUser != null) return BadRequest(new[] { "Este nome de usuário já está em uso." });

        var roleValida = dto.Role.ToLower();
        if (roleValida != "admin" && roleValida != "lider" && roleValida != "analista")
        {
            return BadRequest(new[] { "O nível de acesso deve ser Admin, Lider ou Analista." });
        }

        var newUser = new IdentityUser
        {
            UserName = dto.Username,
            Email = $"{dto.Username}@sistema.local"
        };

        var result = await _userManager.CreateAsync(newUser, dto.Password);

        if (!result.Succeeded) return BadRequest(result.Errors.Select(e => e.Description));

        string roleFormatada = char.ToUpper(dto.Role[0]) + dto.Role.Substring(1).ToLower();
        await _userManager.AddToRoleAsync(newUser, roleFormatada);

        return Ok(new { message = $"Usuário {dto.Username} criado com sucesso!" });
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        var userList = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userList.Add(new
            {
                id = user.Id,
                username = user.UserName,
                role = roles.FirstOrDefault()?.ToLower() ?? "analista"
            });
        }

        return Ok(userList);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "Usuário não encontrado." });

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new
        {
            id = user.Id,
            username = user.UserName,
            role = roles.FirstOrDefault()?.ToLower() ?? "analista"
        });
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.Username);
        if (user == null)
            return NotFound(new[] { "Usuário não encontrado." });

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);

        if (result.Succeeded)
            return Ok(new { message = "Senha alterada com sucesso!" });

        return BadRequest(result.Errors.Select(e => e.Description));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid) return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));

        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "Usuário não encontrado." });

        // Atualiza o Username se foi modificado
        if (!string.Equals(user.UserName, dto.Username, StringComparison.OrdinalIgnoreCase))
        {
            var existingUser = await _userManager.FindByNameAsync(dto.Username);
            if (existingUser != null) return BadRequest(new[] { "Este nome de usuário já está em uso." });

            user.UserName = dto.Username;
            user.Email = $"{dto.Username}@recepcao.ibe";
            await _userManager.UpdateAsync(user);
        }

        // Atualiza a senha apenas se o campo for preenchido
        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var passResult = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);
            if (!passResult.Succeeded) return BadRequest(passResult.Errors.Select(e => e.Description));
        }

        // Atualiza a Role (Nível de Acesso)
        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);

        string roleFormatada = char.ToUpper(dto.Role[0]) + dto.Role.Substring(1).ToLower();
        await _userManager.AddToRoleAsync(user, roleFormatada);

        return Ok(new { message = "Usuário atualizado com sucesso." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "Usuário não encontrado." });

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded) return BadRequest(result.Errors.Select(e => e.Description));

        return Ok(new { message = "Usuário excluído com sucesso." });
    }
}