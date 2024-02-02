using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using MassTransit.RabbitMqTransport;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public AuctionsController(AuctionDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>>GetAllAuctions(string date)
    {   
        var query = _context.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

        if (!string.IsNullOrEmpty(date))
        {
            query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
        }

        // var query = await _context.Auctions
        //     .Include(x => x.Item)
        //     .OrderBy(X => X.Item.Make)
        //     .ToListAsync();
        
        // return _mapper.Map<List<AuctionDto>>(query);
        return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>>GetAuctionById(Guid id)
    {
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(X => X.Id == id);
        if (auction == null) return NotFound();

        return _mapper.Map<AuctionDto>(auction);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto newAuctionDto) 
    {
        var new_auction = _mapper.Map<Auction>(newAuctionDto);

        //TODO: Add current user as seller        
        new_auction.Seller=User.Identity.Name;//"test";

        _context.Auctions.Add(new_auction);

        var newAuction = _mapper.Map<AuctionDto>(new_auction);        
        await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));//Publishes to rabbitmq for subscribers to consume.

        var result =  await _context.SaveChangesAsync() > 0;//Saves to DB

        if(!result) {return BadRequest("Could not save changes to the Db");}        
        
        return CreatedAtAction(nameof(GetAuctionById), new {new_auction.Id}, newAuction);
    }

    [Authorize]
    [HttpPut("{id}")]    
    public async Task<ActionResult> UpdateAuction(UpdateAuctionDto updateAuction, Guid id)
    {
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(X => X.Id == id);
        if (auction == null) return NotFound();

        //TODO: check to ensure the seller == username
        if(auction.Seller != User.Identity.Name) return Forbid();

        auction.Item.Make = updateAuction.Make ?? auction.Item.Make;
        auction.Item.Model = updateAuction.Model ?? auction.Item.Model;
        auction.Item.Color = updateAuction.Color ?? auction.Item.Color;
        auction.Item.Mileage = updateAuction.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = updateAuction.Year ?? auction.Item.Year;

        var updatedAuction = _mapper.Map<AuctionUpdated>(updateAuction);
        updatedAuction.Id = id.ToString();
        await _publishEndpoint.Publish(updatedAuction);///////Publish UPDATED
        
        var result =  await _context.SaveChangesAsync() > 0;

        if(!result) {return BadRequest("Problem updating changes");} 

        return Ok();   
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {        
        var auction = await _context.Auctions.FindAsync(id);
        if (auction == null) return NotFound();
        
        //TODO: check to ensure the seller == username
        if(auction.Seller != User.Identity.Name) return Forbid();

        _context.Auctions.Remove(auction);

        var _deleteAuction = new DeleteAuctionDto ()
        { 
            Id = auction.Id.ToString()
        };
        
        var deletedAuction = _mapper.Map<AuctionDeleted>(_deleteAuction);

        await _publishEndpoint.Publish(deletedAuction);


        var result =  await _context.SaveChangesAsync() > 0;

        if(!result) {return BadRequest("Problem deleting auction. Please try again!");} 
        
        return Ok();    
    }
}
