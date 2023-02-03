using Sieve.Services;
using WebApp.Data.Entities;

namespace WebApp.Support.Sieve;

public class CustomSieveFilterMethods : ISieveCustomFilterMethods
{
    public IQueryable<Contest> JoinedBy(IQueryable<Contest> source, string op, string[] values)
    {
        var result = source.Where(c => c.Teams.Any(t => t.Id == Convert.ToInt32(values[0])));

        return result;
    }
}