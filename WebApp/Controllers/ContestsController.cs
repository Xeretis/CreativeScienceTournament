using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using WebApp.Auth;
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
public class ContestsController : Controller
{
    private readonly IContestService _contestService;
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ISieveProcessor _sieveProcessor;

    public ContestsController(ApplicationDbContext dbContext, IMapper mapper, IContestService contestService,
        ISieveProcessor sieveProcessor)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _contestService = contestService;
        _sieveProcessor = sieveProcessor;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<IndexContestsResponse>>> IndexContests(
        [FromQuery] SieveModel sieveModel)
    {
        var contests = _dbContext.Contests.AsNoTracking();
        var filteredContests = await _sieveProcessor.Apply(sieveModel, contests).ToListAsync();

        var response = _mapper.Map<IEnumerable<IndexContestsResponse>>(filteredContests);

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ViewContestResponse>> ViewContest([FromRoute] int id)
    {
        var contest = await _dbContext.Contests.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

        if (contest == null) return NotFound();

        var response = _mapper.Map<ViewContestResponse>(contest);

        return Ok(response);
    }

    [Authorize(Roles = $"{AuthConstants.AdminRole}")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> CreateContest([FromForm] CreateContestRequest request)
    {
        var contest = _mapper.Map<Contest>(request);

        var exercise = await _contestService.UploadExerciseAsync(request.Exercise);
        contest.Exercise = exercise;

        if (request.Thumbnail != null)
        {
            var thumbnailPath = await _contestService.UploadThumbnailAsync(request.Thumbnail);
            contest.ThumbnailUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/{thumbnailPath}";
        }

        _dbContext.Contests.Add(contest);
        await _dbContext.SaveChangesAsync();

        var response = _mapper.Map<ViewContestResponse>(contest);

        return CreatedAtAction(nameof(ViewContest), new { id = contest.Id }, response);
    }

    [Authorize(Roles = $"{AuthConstants.AdminRole}")]
    [HttpPatch("{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> UpdateContest([FromRoute] int id, [FromForm] UpdateContestRequest request)
    {
        var contest = await _dbContext.Contests.FindAsync(id);

        if (contest == null) return NotFound();

        _mapper.Map(request, contest);

        if (request.Exercise != null)
        {
            System.IO.File.Delete(Path.Combine("Resources", "Exercises", contest.Exercise.Filename));
            var exercise = await _contestService.UploadExerciseAsync(request.Exercise);
            contest.Exercise = exercise;
        }

        if (request.Thumbnail != null)
        {
            var thumbnailPath = await _contestService.UploadThumbnailAsync(request.Thumbnail);
            contest.ThumbnailUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/{thumbnailPath}";
        }

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = $"{AuthConstants.AdminRole}")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> DeleteContest([FromRoute] int id)
    {
        var contest = await _dbContext.Contests.FindAsync(id);

        if (contest == null) return NotFound();

        System.IO.File.Delete(Path.Combine("Resources", "Exercises", contest.Exercise.Filename));

        _dbContext.Contests.Remove(contest);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize("FullTeam")]
    [HttpPost("{id}/Join")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> JoinContest([FromRoute] int id)
    {
        var contest = await _dbContext.Contests.Include(c => c.Teams).FirstOrDefaultAsync(c => c.Id == id);

        if (contest == null) return NotFound();

        var user = await _dbContext.Users.Include(u => u.Team).FirstOrDefaultAsync(u => u.Id == User.GetId());

        if (user.Team.CreatorId != user.Id)
            return BadRequest(new { Message = "Csak a csapatod vezetője csatlakozhat a versenyhez" });

        if (contest.StartDate > DateTime.Now) return BadRequest(new { Message = "A verseny még nem kezdődött el" });
        if (contest.EndDate < DateTime.Now) return BadRequest(new { Message = "A verseny már véget ért" });

        if (contest.Teams.Any(t => t.Id == user.TeamId))
            return BadRequest(new { Message = "A csapatod már csatlakozott a versenyhez" });

        contest.Teams.Add(user.Team);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize("FullTeam")]
    [HttpPost("{id}/Leave")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> LeaveContest([FromRoute] int id)
    {
        var contest = await _dbContext.Contests.Include(c => c.Teams).FirstOrDefaultAsync(c => c.Id == id);

        if (contest == null) return NotFound();

        var user = await _dbContext.Users.Include(u => u.Team).FirstOrDefaultAsync(u => u.Id == User.GetId());

        if (user.Team.CreatorId != user.Id)
            return BadRequest(new { Message = "Csak a csapatod vezetője hagyhatja el a versenyt" });

        if (contest.EndDate < DateTime.Now) return BadRequest(new { Message = "A verseny már véget ért" });

        if (contest.Teams.All(t => t.Id != user.TeamId))
            return BadRequest(new { Message = "A csapatod nem csatlakozott a versenyhez" });

        contest.Teams.Remove(user.Team);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}