using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiBackend.Data;
using ApiBackend.Models;

namespace ApiBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class CultosController : ControllerBase
{
    private readonly AppDbContext _context;

    public CultosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Cultos
    [HttpGet]
    // [Authorize(Roles = "Admin,Lider,Analista")]
    public async Task<ActionResult<IEnumerable<Culto>>> GetCultos()
    {
        return await _context.Cultos
            .Include(c => c.Contagens)
            .Where(c => !c.IsDeleted) // Traz apenas os que NÃO estão na lixeira
            .ToListAsync();
    }

    // GET: api/Cultos/{id}
    [HttpGet("{id}")]
    // [Authorize(Roles = "Admin,Lider,Analista")]
    public async Task<ActionResult<Culto>> GetCulto(Guid id)
    {
        var culto = await _context.Cultos
            .Include(c => c.Contagens)
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

        if (culto == null) return NotFound();
        return culto;
    }

    // POST: api/Cultos
    [HttpPost]
    // [Authorize(Roles = "Lider")]
    public async Task<ActionResult<Culto>> PostCulto(Culto culto)
    {
        culto.CalcularGrupoRecepcao();
        if (culto.Contagens != null) culto.Contagens.CalcularTotal();

        culto.IsDeleted = false;

        _context.Cultos.Add(culto);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCulto), new { id = culto.Id }, culto);
    }

    // PUT: api/Cultos/{id}
    [HttpPut("{id}")]
    // [Authorize(Roles = "Lider")]
    public async Task<IActionResult> PutCulto(Guid id, Culto culto)
    {
        if (id != culto.Id) return BadRequest("O ID informado não bate.");

        var cultoExistente = await _context.Cultos
            .Include(c => c.Contagens)
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

        if (cultoExistente == null) return NotFound();

        culto.CalcularGrupoRecepcao();
        if (culto.Contagens != null) culto.Contagens.CalcularTotal();

        cultoExistente.Data = culto.Data;
        cultoExistente.Turno = culto.Turno;
        cultoExistente.LiderRecepcao = culto.LiderRecepcao;
        cultoExistente.GrupoRecepcao = culto.GrupoRecepcao;

        if (cultoExistente.Contagens != null) _context.Contagens.Remove(cultoExistente.Contagens);
        cultoExistente.Contagens = culto.Contagens;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/Cultos/{id} (SOFT DELETE)
    [HttpDelete("{id}")]
    // [Authorize(Roles = "Lider")]
    public async Task<IActionResult> DeleteCulto(Guid id)
    {
        var culto = await _context.Cultos.FindAsync(id);
        if (culto == null || culto.IsDeleted) return NotFound();

        culto.IsDeleted = true;
        
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // GET: api/Cultos/deletados (LIXEIRA)
    [HttpGet("deletados")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Culto>>> GetDeletados()
    {
        return await _context.Cultos
            .Include(c => c.Contagens)
            .Where(c => c.IsDeleted) // Traz SOMENTE os deletados
            .ToListAsync();
    }

    // DELETE: api/Cultos/{id}/permanente (HARD DELETE)
    [HttpDelete("{id}/permanente")]
    // [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePermanente(Guid id)
    {
        var culto = await _context.Cultos.FindAsync(id);
        if (culto == null) return NotFound();

        _context.Cultos.Remove(culto);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}