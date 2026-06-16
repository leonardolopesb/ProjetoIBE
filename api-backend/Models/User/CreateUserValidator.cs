using FluentValidation;

public class CreateUserValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Username).NotEmpty().WithMessage("O nome de usuário é obrigatório.");
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8).WithMessage("A senha deve ter no mínimo 8 caracteres.");
        RuleFor(x => x.Role).Must(r => r == "Admin" || r == "Lider" || r == "Analista")
            .WithMessage("O nível de acesso deve ser Admin, Lider ou Analista.");
    }
}