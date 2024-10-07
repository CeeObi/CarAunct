using Duende.IdentityServer.Models;
using IdentityService.Pages.ExternalLogin;
using Microsoft.AspNetCore.Hosting.Server;

namespace IdentityService;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[]
        {
            new ApiScope("auctionApp", "Auction app full access"),
            
        };

    public static IEnumerable<Client> Clients(IConfiguration config) =>
        new Client[]
        {
           new Client()
           {
            ClientId = "postman",
            ClientName = "Postman",
            AllowedScopes = {"openid", "profile","auctionApp"},
            RedirectUris = {"https://www.getpostman.com/oauth2/callback"},
            ClientSecrets = new[] {new Secret("NotASecret".Sha256())},
            AllowedGrantTypes = {GrantType.ResourceOwnerPassword} 
           },

           new Client
            {
                ClientId = "nextApp",
                ClientName = "Next App",
                AllowedScopes = { "openid", "profile", "auctionApp" }, // Correct way to specify allowed scopes
                ClientSecrets = { new Secret(config["ClientSecret"].Sha256()) }, // Use the SHA-256 hash for the secret
                AllowedGrantTypes = GrantTypes.CodeAndClientCredentials, // Use only Code for PKCE, remove ClientCredentials
                RequirePkce = false, // Set to true to enforce PKCE
                AllowOfflineAccess = true, // This is fine if you want refresh tokens
                AccessTokenLifetime = 3600 * 24 * 30, // 30 days
               RedirectUris = { config["ClientApp"]+"/api/auth/callback/id-server"}, // Ensure this matches exactly
                AlwaysIncludeUserClaimsInIdToken = true // This is good practice
            }

        };
}
 