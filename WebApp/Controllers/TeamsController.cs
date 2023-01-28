using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using WebApp.Data;
using WebApp.Data.Entities;
using WebApp.Models.Requests;
using WebApp.Models.Responses;
using WebApp.Services.Interfaces;
using WebApp.Support.Auth;

namespace WebApp.Controllers;

[Authorize]
[ApiController]
[Route("Api/[controller]")]
[Produces("application/json")]
public class TeamsController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ISieveProcessor _sieveProcessor;
    private readonly ITeamService _teamService;

    public TeamsController(ApplicationDbContext dbContext, IMapper mapper, ISieveProcessor sieveProcessor,
        ITeamService teamService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _sieveProcessor = sieveProcessor;
        _teamService = teamService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<IndexTeamResponse>>> IndexTeams([FromQuery] SieveModel sieveModel)
    {
        var teams = _dbContext.Teams.Include(t => t.PointEntries).Include(t => t.Members).AsNoTracking();
        var filteredTeams = await _sieveProcessor.Apply(sieveModel, teams).ToListAsync();

        var response = _mapper.Map<IEnumerable<IndexTeamResponse>>(filteredTeams);

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
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

        if (user.Team != null) return BadRequest(new { Message = "Mér rendelkezel csapattal" });

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

    [HttpPost("Leave")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> LeaveTeam()
    {
        var user = await _dbContext.Users.Include(u => u.Team).FirstOrDefaultAsync(u => u.Id == User.GetId());

        if (user.Team == null) return BadRequest(new { Message = "Nem vagy tagja csapatnak" });

        if (user.Team.CreatorId == user.Id)
            return BadRequest(new { Message = "A csapat létrehozója nem hagyhatja el a csapatot" });

        user.Team = null;
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("Invite/{userId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> InviteUser(string userId, [FromQuery] string inviteUrl)
    {
        var targetUser = await _dbContext.Users.Where(u => u.EmailConfirmed).Include(u => u.Team)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (targetUser == null) return NotFound();
        if (targetUser.Team != null) return BadRequest(new { Message = "Ez a felhaználó már rendelkezik csapattal" });

        var user = await _dbContext.Users.Include(u => u.Team).ThenInclude(t => t.Members)
            .FirstOrDefaultAsync(u => u.Id == User.GetId());

        if (user.Team == null) return BadRequest(new { Message = "Nem rendelkezel csapattal" });
        if (user.Team.Members.Count >= 3) return BadRequest(new { Message = "A csapatban már 3 tag van" });
        if (user.Team.CreatorId != user.Id) return Forbid();

        _teamService.SendInviteEmail(user.Team, targetUser, inviteUrl, user.UserName);

        return NoContent();
    }
}