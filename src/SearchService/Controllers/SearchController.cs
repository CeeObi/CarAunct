﻿using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Model;
using SearchService.RequestHelpers;

namespace SearchService.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Item>>>SearchAllItems([FromQuery] SearchParams searchParams) 
    {
        // var query = DB.Find<Item>();
        var query = DB.PagedSearch<Item, Item>();
        
        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
        {   
            query.Match(x => x.Seller.ToLower()==searchParams.SearchTerm.ToLower() || x.Winner.ToLower()==searchParams.SearchTerm.ToLower() || x.Make.ToLower()==searchParams.SearchTerm.ToLower() || x.Mileage.ToString().ToLower()==searchParams.SearchTerm.ToLower()
                        || x.Model.ToLower()==searchParams.SearchTerm.ToLower() || x.Color.ToLower()==searchParams.SearchTerm.ToLower() || x.Year.ToString().ToLower()==searchParams.SearchTerm.ToLower());
        }

        query = searchParams.OrderBy switch
        {
            "make" => query.Sort(x => x.Ascending(a => a.Make)).Sort(x => x.Ascending(a => a.Model)),
            "new" => query.Sort(x => x.Descending(a => a.CreatedAt)),            
            _ => query.Sort(x => x.Ascending(a => a.AuctionEnd))

        };

        query = searchParams.FilterBy switch
        {
            "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
            "endingsoon" => query.Match(x => x.AuctionEnd < DateTime.UtcNow.AddHours(6) && x.AuctionEnd > DateTime.UtcNow),       
            _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow) 
        };

        if (!string.IsNullOrEmpty(searchParams.Seller))
        {
            query.Match(x => x.Seller == searchParams.Seller);
        }

        if (!string.IsNullOrEmpty(searchParams.Winner))
        {
            query.Match(x => x.Winner == searchParams.Winner);
        }



        query.PageNumber(searchParams.PageNumber);
        query.PageSize(searchParams.PageSize);

        var result = await query.ExecuteAsync();
        
        return Ok(new {
            results = result.Results,
            pageCount = result.PageCount,
            totalCount = result.TotalCount
        });
    }
}