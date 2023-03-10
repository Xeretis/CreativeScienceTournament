using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using WebApp.Auth;
using WebApp.Data;
using WebApp.Data.Entities;
using WebApp.Data.Entities.Owned;
using WebApp.Filters;
using WebApp.Models.Requests;
using WebApp.Models.Responses;
using WebApp.Services.Interfaces;
using WebApp.Support.Auth;

namespace WebApp.Controllers;

[Authorize]
[ApiController]
[Route("Api/[controller]")]
[Produces("application/json")]
public class ContestEntriesController : Controller
{
    private readonly IContestEntryService _contestEntryService;
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ISieveProcessor _sieveProcessor;

    public ContestEntriesController(ApplicationDbContext dbContext, IMapper mapper, ISieveProcessor sieveProcessor,
        IContestEntryService contestEntryService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _sieveProcessor = sieveProcessor;
        _contestEntryService = contestEntryService;
    }

    [Authorize(Roles = $"{AuthConstants.AdminRole}")]
    [HttpGet("{contestId}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<IndexContestEntriesResponse>>> IndexContestEntries(
        [FromRoute] int contestId,
        [FromQuery] SieveModel sieveModel)
    {
        var contest = await _dbContext.Contests.FindAsync(contestId);

        if (contest == null) return NotFound();

        var contestEntries = _dbContext.ContestEntries.Where(e => e.ContestId == contestId).Include(e => e.Team);
        var filteredContestEntries = await _sieveProcessor.Apply(sieveModel, contestEntries).ToListAsync();

        var response = _mapper.Map<IEnumerable<IndexContestEntriesResponse>>(filteredContestEntries);

        return Ok(response);
    }

    [Authorize(Roles = $"{AuthConstants.AdminRole}")]
    [HttpGet("{contestId}/{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ViewContestEntryResponse>> ViewContestEntry([FromRoute] int contestId,
        [FromRoute] int id)
    {
        var contestEntry = await _dbContext.ContestEntries.Include(e => e.Team)
            .FirstOrDefaultAsync(e => e.Id == id && e.ContestId == contestId);

        if (contestEntry == null) return NotFound();

        var response = _mapper.Map<ViewContestEntryResponse>(contestEntry);

        return Ok(response);
    }

    [Authorize(Roles = $"{AuthConstants.AdminRole}")]
    [HttpGet("{id}/Solution")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> DownloadSolution([FromRoute] int id)
    {
        var contestEntry = await _dbContext.ContestEntries.FindAsync(id);

        if (contestEntry == null) return NotFound();

        return File(System.IO.File.OpenRead(Path.Combine("Resources", "Solutions", contestEntry.Solution.Filename)),
            contestEntry.Solution.ContentType,
            contestEntry.Solution.OriginalFilename);
    }

    [ServiceFilter(typeof(RequireFullTeamActionFilter))]
    [HttpGet("{contestId}/Own")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ViewContestEntryResponse>> ViewOwnContestEntry([FromRoute] int contestId)
    {
        var user = await _dbContext.Users.FindAsync(User.GetId());

        var contestEntry = await _dbContext.ContestEntries.Include(e => e.Team)
            .FirstOrDefaultAsync(e => e.TeamId == user.TeamId && e.ContestId == contestId);

        if (contestEntry == null) return NotFound();

        var response = _mapper.Map<ViewContestEntryResponse>(contestEntry);

        return Ok(response);
    }

    [ServiceFilter(typeof(RequireFullTeamActionFilter))]
    [HttpPost("{contestId}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<ViewContestEntryResponse>> CreateContestEntry([FromRoute] int contestId,
        [FromForm] CreateContestEntryRequest request)
    {
        var contest = await _dbContext.Contests.Include(c => c.Teams).Include(c => c.ContestEntries)
            .FirstOrDefaultAsync(c => c.Id == contestId);

        if (contest == null) return NotFound();
        if (contest.StartDate > DateTime.Now) return BadRequest(new { Message = "A verseny m??g nem kezd??d??tt el" });
        if (contest.EndDate < DateTime.Now) return BadRequest(new { Message = "A verseny m??r v??get ??rt" });

        var user = await _dbContext.Users.Include(u => u.Team).FirstOrDefaultAsync(u => u.Id == User.GetId());

        if (user.Team.CreatorId != user.Id)
            return BadRequest(new { Message = "Csak a csapat l??trehoz??ja k??ldhet be megold??st" });
        if (contest.Teams.All(t => t.Id != user.TeamId))
            return BadRequest(new { Message = "A csapatod nem csatlakozott a versenyhez" });
        if (contest.ContestEntries.Any(e => e.TeamId == user.TeamId))
            return BadRequest(new { Message = "A csapatod m??r bek??ldte a megold??s??t" });

        var contestEntry = new ContestEntry
        {
            Solution = await _contestEntryService.UploadSolutionAsync(request.Solution),
            TeamId = user.Team.Id,
            Team = user.Team,
            ContestId = contestId
        };

        await _dbContext.ContestEntries.AddAsync(contestEntry);
        await _dbContext.SaveChangesAsync();

        var response = _mapper.Map<ViewContestEntryResponse>(contestEntry);

        return CreatedAtAction(nameof(ViewOwnContestEntry), new { contestId }, response);
    }

    [Authorize(Roles = $"{AuthConstants.AdminRole}")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> DeleteContestEntry([FromRoute] int id)
    {
        var contestEntry = await _dbContext.ContestEntries.FindAsync(id);

        if (contestEntry == null) return NotFound();

        _dbContext.ContestEntries.Remove(contestEntry);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [ServiceFilter(typeof(RequireFullTeamActionFilter))]
    [HttpDelete("{contestId}/Own")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> DeleteOwnContestEntry([FromRoute] int contestId)
    {
        var user = await _dbContext.Users.Include(u => u.Team).FirstOrDefaultAsync(u => u.Id == User.GetId());

        var contestEntry =
            await _dbContext.ContestEntries.FirstOrDefaultAsync(
                c => c.ContestId == contestId && c.TeamId == user.TeamId);

        if (contestEntry == null) return NotFound();

        if (user.Team.CreatorId != user.Id)
            return BadRequest(new { Message = "Csak a csapat l??trehoz??ja t??r??lhet megold??st" });

        _dbContext.ContestEntries.Remove(contestEntry);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = $"{AuthConstants.AdminRole}")]
    [HttpPost("{id}/Correct")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> CorrectContestEntry([FromRoute] int id,
        [FromBody] CorrectContestEntryRequest request)
    {
        var contestEntry = await _dbContext.ContestEntries.Include(e => e.Contest).FirstOrDefaultAsync(e => e.Id == id);

        if (contestEntry == null) return NotFound();

        if (contestEntry.Contest.Concluded) return BadRequest(new { Message = "A verseny m??r v??get ??rt" });

        if (contestEntry.Correction != null) return BadRequest(new { Message = "Ez a megold??s m??r ki lett jav??tva" });

        contestEntry.Correction = _mapper.Map<Correction>(request);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = $"{AuthConstants.AdminRole}")]
    [HttpPut("{id}/Correct")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> UpdateContestEntryCorrection([FromRoute] int id,
        [FromBody] UpdateContestEntryCorrectionRequest request)
    {
        var contestEntry = await _dbContext.ContestEntries.Include(e => e.Contest).FirstOrDefaultAsync(e => e.Id == id);

        if (contestEntry == null) return NotFound();

        if (contestEntry.Contest.Concluded) return BadRequest(new { Message = "A verseny m??r v??get ??rt" });

        contestEntry.Correction = _mapper.Map<Correction>(request);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}