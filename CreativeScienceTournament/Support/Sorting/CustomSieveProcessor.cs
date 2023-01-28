using CreativeScienceTournament.Data.Entities;
using Microsoft.Extensions.Options;
using Sieve.Models;
using Sieve.Services;

namespace CreativeScienceTournament.Support.Sorting;

public class CustomSieveProcessor : SieveProcessor
{
    public CustomSieveProcessor(
        IOptions<SieveOptions> options,
        ISieveCustomSortMethods customSortMethods
    )
        : base(options, customSortMethods)
    {
    }

    protected override SievePropertyMapper MapProperties(SievePropertyMapper mapper)
    {
        mapper.Property<ApiUser>(u => u.Id)
            .CanFilter()
            .CanSort();

        mapper.Property<ApiUser>(u => u.UserName)
            .CanFilter()
            .CanSort();

        return mapper;
    }
}