using Microsoft.Extensions.Options;
using Sieve.Models;
using Sieve.Services;
using WebApp.Data.Entities;

namespace WebApp.Support.Sieve;

public class CustomSieveProcessor : SieveProcessor
{
    public CustomSieveProcessor(
        IOptions<SieveOptions> options,
        ISieveCustomSortMethods customSortMethods,
        ISieveCustomFilterMethods customFilterMethods
    )
        : base(options, customSortMethods, customFilterMethods)
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