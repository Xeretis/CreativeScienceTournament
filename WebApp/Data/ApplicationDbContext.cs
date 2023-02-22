using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApp.Data.Entities;
using WebApp.Data.Entities.Owned;

namespace WebApp.Data;

public class ApplicationDbContext : IdentityDbContext<ApiUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Team> Teams { get; set; }
    public DbSet<Contest> Contests { get; set; }
    public DbSet<PointEntry> PointEntries { get; set; }
    public DbSet<ContestEntry> ContestEntries { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Contest>().OwnsOne<Exercise>(c => c.Exercise);
        builder.Entity<Contest>().OwnsOne<TopicHelp>(c => c.TopicHelp);
        builder.Entity<ContestEntry>().OwnsOne<Solution>(e => e.Solution);
        builder.Entity<ContestEntry>().OwnsOne<Correction>(e => e.Correction);

        builder.Entity<Contest>().Property(c => c.Concluded).HasDefaultValue(false);

        builder.Entity<Team>().HasMany<ApiUser>(t => t.Members).WithOne(u => u.Team).OnDelete(DeleteBehavior.SetNull);
        base.OnModelCreating(builder);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new())
    {
        UpdateTimestamps();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && e.State is EntityState.Added or EntityState.Modified);

        foreach (var entityEntry in entries)
        {
            ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;

            if (entityEntry.State == EntityState.Added) ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
        }
    }
}