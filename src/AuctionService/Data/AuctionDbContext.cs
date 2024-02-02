using AuctionService.Entities;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions options) : base(options)
    {
    }
    public DbSet<Auction> Auctions {set; get;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {   //Class created due to x.AddEntityFrameworkOutbox added into mass transit service in program.cs
        base.OnModelCreating(modelBuilder);

        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
        modelBuilder.AddOutboxStateEntity();
    }
}
