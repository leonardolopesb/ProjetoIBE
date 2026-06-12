public class UpdateUserDto
{
    public string Username { get; set; } = string.Empty;
    public string? NewPassword { get; set; }
    public string Role { get; set; } = string.Empty;
}