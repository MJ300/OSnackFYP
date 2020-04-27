using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace OSnack.Web.Api.ClassOverrides
{
    /// <summary>
    /// this class is used to override the SignOutAsync method of SignInManager
    /// </summary>
    /// <typeparam name="TUser">The user class</typeparam>
    public class AuthManager<TUser> : SignInManager<TUser> where TUser : class
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userManager"></param>
        /// <param name="contextAccessor"></param>
        /// <param name="claimsFactory"></param>
        /// <param name="optionsAccessor"></param>
        /// <param name="logger"></param>
        /// <param name="schemes"></param>
        public AuthManager(UserManager<TUser> userManager, 
            IHttpContextAccessor contextAccessor, 
            IUserClaimsPrincipalFactory<TUser> claimsFactory, 
            IOptions<IdentityOptions> optionsAccessor, 
            ILogger<SignInManager<TUser>> logger, 
            IAuthenticationSchemeProvider schemes,
            IUserConfirmation<TUser> confirmation) : 
            base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
        {
        }

        /// <summary>
        /// Sign-out override method
        /// </summary>
        /// <returns></returns>
        public override async Task SignOutAsync()
        {
            /// Only sign-out from the applicationScheme
            await Context.SignOutAsync(IdentityConstants.ApplicationScheme);
        }
    }
}
