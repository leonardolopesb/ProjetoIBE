using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiBackend.Data;
using ApiBackend.Models;

namespace ApiBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CultosController : ControllerBase
{
    private readonly AppDbContext _context;

    public CultosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Cultos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Culto>>> GetCultos()
    {
        return await _context.Cultos
            .Include(c => c.Contagens) 
            .ToListAsync();
    }

    // GET: api/Cultos/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Culto>> GetCulto(Guid id)
    {
        var culto = await _context.Cultos
            .Include(c => c.Contagens)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (culto == null)
        {
            return NotFound();
        }

        return culto;
    }

    // POST: api/Cultos
    [HttpPost]
    public async Task<ActionResult<Culto>> PostCulto(Culto culto)
    {
        _context.Cultos.Add(culto);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCulto), new { id = culto.Id }, culto);
    }

    // PUT: api/Cultos/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCulto(Guid id, Culto culto)
    {
        if (id != culto.Id)
        {
            return BadRequest("O ID da URL não bate com o ID do objeto.");
        }

        var cultoExistente = await _context.Cultos
            .Include(c => c.Contagens)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cultoExistente == null)
        {
            return NotFound();
        }

        cultoExistente.Data = culto.Data;
        cultoExistente.Turno = culto.Turno;

        _context.Contagens.RemoveRange(cultoExistente.Contagens);
        cultoExistente.Contagens = culto.Contagens;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Cultos/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCulto(Guid id)
    {
        var culto = await _context.Cultos.FindAsync(id);
        if (culto == null)
        {
            return NotFound();
        }

        _context.Cultos.Remove(culto);
        await _context.SaveChangesAsync();

        return NoContent(); // Retorna 204 (Sucesso, sem conteúdo para exibir)
    }
}