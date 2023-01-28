using AutoMapper;
using CreativeScienceTournament.Data;
using CreativeScienceTournament.Data.Entities;
using CreativeScienceTournament.Models.Requests;
using CreativeScienceTournament.Models.Responses;
using CreativeScienceTournament.Support.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;

namespace CreativeScienceTournament.Controllers;

[Authorize]
[ApiController]
[Route("Api/[controller]")]
[Produces("application/json")]
public class TeamsController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly SieveProcessor _sieveProcessor;

    public TeamsController(ApplicationDbContext dbContext, IMapper mapper, SieveProcessor sieveProcessor)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _sieveProcessor = sieveProcessor;
    }

    [AllowAnonymous]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<IndexTeamResponse>>> IndexTeams([FromQuery] SieveModel sieveModel)
    {
        var teams = _dbContext.Teams.Include(t => t.PointEntries).Include(t => t.Members).AsNoTracking();
        var filteredTeams = _sieveProcessor.Apply(sieveModel, teams);

        var response = _mapper.Map<IEnumerable<IndexTeamResponse>>(filteredTeams);

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ViewTeamResponse>> ViewTeam([FromRoute] int id)
    {
        var team = await _dbContext.Teams.Include(t => t.Members).Include(t => t.PointEntries).AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null) return NotFound();

        var response = _mapper.Map<ViewTeamResponse>(team);

        return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> CreateTeam(CreateTeamRequest request)
    {
        var user = await _dbContext.Users.Include(u => u.Team).FirstOrDefaultAsync(u => u.Id == User.GetId());

        if (user.Team != null) return BadRequest(new { Message = "Ez a felhaználó már rendelkezik csapattal!" });

        var team = _mapper.Map<Team>(request);
        team.CreatorId = User.GetId()!;
        team.Members = new List<ApiUser> { user };

        await _dbContext.Teams.AddAsync(team);
        await _dbContext.SaveChangesAsync();

        var response = _mapper.Map<ViewTeamResponse>(team);
        response.Points = 0;

        return CreatedAtAction(nameof(ViewTeam), new { id = team.Id }, response);
    }

    [HttpPatch("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UpdateTeam([FromRoute] int id, UpdateTeamRequest request)
    {
        var team = await _dbContext.Teams.FirstOrDefaultAsync(t => t.Id == id);

        if (team == null)
            return NotFound();

        if (team.CreatorId != User.GetId() && !User.IsAdmin())
            return Forbid();

        _mapper.Map(request, team);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteTeam([FromRoute] int id)
    {
        var team = await _dbContext.Teams.FirstOrDefaultAsync(t => t.Id == id);

        if (team == null)
            return NotFound();

        if (team.CreatorId != User.GetId() && !User.IsAdmin())
            return Forbid();

        _dbContext.Teams.Remove(team);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}