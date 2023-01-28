using Sieve.Services;
using WebApp.Data.Entities;

namespace WebApp.Support.Sorting;

public class CustomSieveSortMethods : ISieveCustomSortMethods
{
    public IQueryable<Team> Points(IQueryable<Team> source, bool useThenBy, bool desc)
    {
        var result = useThenBy
            ? ((IOrderedQueryable<Team>)source).ThenBy(t => t.PointEntries.Sum(e => e.Amount))
            : source.OrderBy(t => t.PointEntries.Sum(e => e.Amount));

        return desc ? result.Reverse() : result;
    }
}