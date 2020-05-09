using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OSnack.Web.Api.Database.Models;

namespace OSnack.Web.Api.Database.Context
{

    public class AppDbContext : IdentityUserContext<oUser, int,
        IdentityUserClaim<int>,
        IdentityUserLogin<int>,
        IdentityUserToken<int>>
    {

        public DbSet<oAddress> Addresses { get; set; }
        public DbSet<oCategory> Categories { get; set; }
        public DbSet<oOrder> Orders { get; set; }
        public DbSet<oPayment> Payments { get; set; }
        public DbSet<oOrderItem> OrdersItems { get; set; }
        public DbSet<oProduct> Products { get; set; }
        public DbSet<oToken> Tokens { get; set; }
        public DbSet<oCoupon> Coupons { get; set; }
        public DbSet<oAppLog> AppLogs { get; set; }
        public DbSet<oStore> Stores { get; set; }
        public DbSet<oStoreProduct> StoreProducts { get; set; }
        public DbSet<oComment> Comments { get; set; }
        public DbSet<oScore> Scores { get; set; }
        public DbSet<oNewsletterSubscription> NewsletterSubscriptions { get; set; }
        public DbSet<oRole> Roles { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            #region *** Remove unnecessary Entities added by Identity User Context class ***
            builder.Ignore<IdentityUserLogin<int>>();
            builder.Ignore<IdentityUserToken<int>>();
            #endregion

            #region *** Change table names ***
            builder.Entity<IdentityUserClaim<int>>().ToTable("AccessClaims");
            builder.Entity<oUser>().ToTable("Users");
            #endregion

            builder.Entity<IdentityUserClaim<int>>().Ignore("Id");
            builder.Entity<IdentityUserClaim<int>>().HasKey("UserId");

            builder.Entity<oStoreProduct>().Property(sp => sp.ProductId).ValueGeneratedNever();
            builder.Entity<oStoreProduct>().Property(sp => sp.StoreId).ValueGeneratedNever();
            builder.Entity<oStoreProduct>().HasKey(sp => new { sp.StoreId, sp.ProductId });

            builder.Entity<oStore>().HasIndex(s => s.Name).IsUnique();
            builder.Entity<oCategory>().HasIndex(c => c.Name).IsUnique();
            builder.Entity<oProduct>().HasIndex(p => p.Name).IsUnique();


            builder.Entity<oUser>().Ignore(u => u.UserName);
            builder.Entity<oUser>().Ignore(u => u.NormalizedUserName);
            builder.Entity<oUser>().Ignore(u => u.PhoneNumberConfirmed);
            builder.Entity<oUser>().Ignore(u => u.TwoFactorEnabled);
        }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
    }
}
