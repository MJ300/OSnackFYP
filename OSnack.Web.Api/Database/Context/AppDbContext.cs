using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Esf;
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
        public DbSet<oStorage> Storages { get; set; }
        public DbSet<oStorageItem> StorageItems { get; set; }
        public DbSet<oComment> Comments { get; set; }
        public DbSet<oScore> Scores { get; set; }
        public DbSet<oNewsletterSubscription> NewsletterSubscriptions { get; set; }
        

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            #region *** Remove unnecessary Entities added by Identity User Context class ***
            builder.Ignore<IdentityUserLogin<int>>();
            builder.Ignore<IdentityUserToken<int>>();
            #endregion

            #region *** Change table names ***
            builder.Entity<oUser>().ToTable("Users");
            builder.Entity<IdentityUserClaim<int>>().ToTable("AccessClaims");
            #endregion

            builder.Entity<IdentityUserClaim<int>>().Ignore("Id");
            builder.Entity<IdentityUserClaim<int>>().HasKey("UserId");

            builder.Entity<oStorageItem>().HasKey(si => new { si.ProductId, si.StorageId });
            builder.Entity<oScore>().HasKey(s => new { s.OrderItemId });

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
