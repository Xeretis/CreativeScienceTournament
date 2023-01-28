using Sieve.Attributes;

namespace CreativeScienceTournament.Data;

public class BaseEntity
{
    [Sieve(CanFilter = true, CanSort = true)]
    public DateTime CreatedAt { get; set; }

    [Sieve(CanFilter = true, CanSort = true)]
    public DateTime UpdatedAt { get; set; }
}