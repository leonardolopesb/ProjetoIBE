using FluentValidation;

public class UpdateUserValidator : AbstractValidator<UpdateUserDto>
{
    public UpdateUserValidator()
    {
        RuleFor(x => x.Username).NotEmpty().WithMessage("O nome de usuário é obrigatório.");
        
        RuleFor(x => x.NewPassword)
            .MinimumLength(8).When(x => !string.IsNullOrWhiteSpace(x.NewPassword))
            .WithMessage("A nova senha deve ter no mínimo 8 caracteres.");
            
        RuleFor(x => x.Role)
            .Must(r => r.Equals("admin", StringComparison.OrdinalIgnoreCase) || 
                       r.Equals("lider", StringComparison.OrdinalIgnoreCase) || 
                       r.Equals("analista", StringComparison.OrdinalIgnoreCase))
            .WithMessage("O nível de acesso deve ser Admin, Lider ou Analista.");
    }
}