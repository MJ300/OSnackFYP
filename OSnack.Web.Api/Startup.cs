using System;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OSnack.Web.Api.AppSettings;
using OSnack.Web.Api.ClassOverrides;
using OSnack.Web.Api.Database.Context;
using OSnack.Web.Api.Database.Models;

namespace OSnack.OSnack.Web.Api
{
    public class Startup
    {
        internal IConfiguration Configuration { get; }
        internal const string AuthSchemeApplication = "Identity.Application";
        public Startup(IConfiguration configuration) => Configuration = configuration;

        /// <summary>
        /// Configure ASP.Net pipe-line services
        /// </summary>
        public void ConfigureServices(IServiceCollection services)
        {
            /// Set the NewtonSoft Json as default json parser for the controllers
            services.AddControllers().AddNewtonsoftJson();

            /// Enable API calls from different origins
            services.AddCors(options =>
            {
                options.AddPolicy("WebApp",
                    builder =>
                    {
                        builder.WithOrigins(oAppConst.AppSettings.Allowed_CORS)
                               .AllowAnyMethod()
                               .AllowCredentials()
                               .WithHeaders("Accept",
                               "content-type",
                               "x-antiforgery-token",
                               "Access-Control-Allow-Origin");
                    });
            });

            /// Add the anti-forgery service and identify the 
            /// the header name of the request to identify and
            /// validate the token
            services.AddAntiforgery(options => options.HeaderName = "X-AF-TOKEN");
            /// Add Mvc service to the application
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            string conString = oAppConst.AppSettings.DbConnectionString();

            /// Pass the SQL server connection to the db context
            /// receive the connection string from the package.json
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(conString));

            /// Add .Net Core Identity to the pipe-line with the following options
            services.AddIdentityCore<oUser>(options =>
            {
                options.ClaimsIdentity.UserIdClaimType = "UserId";
                options.ClaimsIdentity.SecurityStampClaimType = "SecurityStamp";
                options.ClaimsIdentity.RoleClaimType = oAppConst.AccessClaims.Type;
                options.User.RequireUniqueEmail = true;
                options.Password = new PasswordOptions
                {
                    RequireDigit = true,
                    RequiredLength = 3,
                    RequiredUniqueChars = 1,
                    RequireLowercase = true,
                    RequireNonAlphanumeric = true,
                    RequireUppercase = true
                }; ;
            })
            .AddEntityFrameworkStores<AppDbContext>()// Add the custom db context class
            .AddSignInManager<AuthManager<oUser>>() // add the custom SignInManager class
            .AddDefaultTokenProviders(); // Allow the use of tokens

            /// local static function to set the cookie authentication option 
            static void CookieAuthOptions(CookieAuthenticationOptions options)
            {
                options.LoginPath = "/Login";
                options.LogoutPath = "/Logout";
                options.AccessDeniedPath = "/AccessDenied";
                options.ClaimsIssuer = "OSnack";
                options.ExpireTimeSpan = TimeSpan.FromDays(60);
                options.SlidingExpiration = true;
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            }
            /// Add authentication services to the pipeline  
            services.AddAuthentication()
                .AddCookie(AuthSchemeApplication, CookieAuthOptions);


            /// Add Authorization policies for Admin, Manager, Staff and Customer
            services.AddAuthorization(options =>
            {
                options.AddPolicy(oAppConst.AccessPolicies.LevelFour, policy =>
                {
                    policy.AuthenticationSchemes.Add(AuthSchemeApplication);
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim(oAppConst.AccessClaims.Type
                                        , new string[] { oAppConst.AccessClaims.Admin,
                                                         oAppConst.AccessClaims.Manager,
                                                         oAppConst.AccessClaims.Staff,
                                                         oAppConst.AccessClaims.Customer});
                });
                options.AddPolicy(oAppConst.AccessPolicies.LevelThree, policy =>
                {
                    policy.AuthenticationSchemes.Add(AuthSchemeApplication);
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim(oAppConst.AccessClaims.Type
                                        , new string[] { oAppConst.AccessClaims.Admin,
                                                         oAppConst.AccessClaims.Manager,
                                                         oAppConst.AccessClaims.Staff});
                });
                options.AddPolicy(oAppConst.AccessPolicies.LevelTwo, policy =>
                {
                    policy.AuthenticationSchemes.Add(AuthSchemeApplication);
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim(oAppConst.AccessClaims.Type
                                        , new string[] { oAppConst.AccessClaims.Manager,
                                                         oAppConst.AccessClaims.Admin});
                });
                options.AddPolicy(oAppConst.AccessPolicies.LevelOne, policy =>
                {
                    policy.AuthenticationSchemes.Add(AuthSchemeApplication);
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim(oAppConst.AccessClaims.Type
                                        , new string[] { oAppConst.AccessClaims.Admin });
                });
            });

            /// Grab the Smtp server info
            /// and add it as a singleton middle-ware so that the EmailSettings object is 
            /// only referring to the same object across requests and classes
            services.AddSingleton(oAppConst.AppSettings.EmailSettings);

            /// Add email service as a Transient service middle-ware so that each class implementing this
            /// middle-ware will receive a new object of oEmailService class
            //services.AddTransient<IEmailService, oEmailService>();

            /// Add MVC services to the pipeline
            services.AddMvc(options => options.EnableEndpointRouting = false);
        }


        /// <summary>
        /// Configure ASP.Net Application environment pipe-line
        /// </summary>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiforgery)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseHsts();

            app.UseCors("WebApp");

            /// Add the anti-forgery cookie to the context response
            app.Use(next => context =>
            {
                switch (context.Request.Path.Value)
                {
                    case "/":
                        AntiforgeryTokenSet tokens = antiforgery.GetAndStoreTokens(context);
                        context.Response.Cookies.Append(
                            "AF-TOKEN",
                            tokens.RequestToken,
                            new CookieOptions() { HttpOnly = false });
                        break;
                }
                return next(context);
            });

            /// Enable the application to use authentication
            app.UseAuthentication();
            /// allow only secure socket layer (SSL) connection
            app.UseHttpsRedirection();
            /// Allow the use of static files from wwwroot folder
            app.UseStaticFiles();

            /// User MVC Routes for the api calls
            app.UseMvc();

        }
    }
}
