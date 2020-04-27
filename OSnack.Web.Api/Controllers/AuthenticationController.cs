//using System;
//using System.Linq;
//using System.Net.Mime;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Logging;
//using OSnack.Web.Api.Models;

//namespace OSnack.Web.Api.Controllers
//{
//    /// api/Authentication/[action]
//    [Route("api/[controller]/")]
//    public class AuthenticationController : Controller
//    {
//        /// <summary>
//        ///     Private Fields
//        /// </summary>
//        private readonly UserManager<oUser> _UserManager;
//        private readonly SignInManager<oUser> _SignInManager;
//        private readonly ILogger<oUser> _Logger;

//        /// <summary>
//        ///     Class Constructor
//        /// </summary>
//        /// <param name="UserManager">User Manager Middle-ware</param>
//        /// <param name="SignInManager">Sign-in Manager Middle-ware</param>
//        /// <param name="Logger"></param>
//        public AuthenticationController(UserManager<oUser> UserManager
//            , SignInManager<oUser> SignInManager
//            , ILogger<oUser> Logger)
//        {
//            _UserManager = UserManager;
//            _SignInManager = SignInManager;
//            _Logger = Logger;
//        }

//        /// <summary>
//        ///     Login the user into the system (URL: api/Authentication/LoginAsync)
//        /// </summary>
//        /// <param name="data"></param>
//        /// <returns></returns>
//        #region ** Attributes: HttpPost, AntiForgery, Return Status 200/ 401/ 400 **
//        [HttpPost("[action]")] // Login Method
//        [ValidateAntiForgeryToken]
//        [Consumes(MediaTypeNames.Application.Json)]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        #endregion
//        public async Task<IActionResult> LoginAsync([FromBody]dynamic data)
//        {
//            /// if no data is provided by the client
//            /// return "unauthorized" response including error message (stop code execution)
//            if (data == null)
//                return Unauthorized(new{ message = "Technical failure! Try again later." });
//            try
//            {

//                /// If email parameter is empty
//                /// return "unauthorized" response (stop code execution)
//                if (string.IsNullOrWhiteSpace(data.email.Value))
//                    return Unauthorized(new { message = "Email is required!" });

//                /// Find the user with the provided email address
//                oUser AUser = await _UserManager
//                        .FindByEmailAsync(data.email.Value);

//                /// if no user is found on the database 
//                /// return "unauthorized" response (stop code execution)
//                if (AUser == null || string.IsNullOrWhiteSpace(AUser.Email))
//                    return Unauthorized(new{ message = " User not found!" });

//                /// Check if user's account is locked
//                if (AUser.LockoutEnabled)
//                {
//                    /// get the current lockout end dateTime
//                    var currentLockoutDate =
//                        await _UserManager.GetLockoutEndDateAsync(AUser);

//                    /// if the user's lockout is not expired (stop code execution)
//                    if (currentLockoutDate > DateTimeOffset.UtcNow)
//                        return Unauthorized(new
//                        {
//                            message = string.Format("Account Locked for {0}"
//                            , CompareWithCurrentTime(currentLockoutDate))
//                        });

//                    /// else lockout time has expired
//                    /// disable user lockout 
//                    await _UserManager.SetLockoutEnabledAsync(AUser, false);
//                    AUser.LockoutEnabled = false;
//                }

//                /// else user account is not locked
//                /// Attempt to sign in the user
//                var SignInResult = await _SignInManager
//                    .PasswordSignInAsync(AUser,
//                    data.password.Value,
//                    data.rememberMe.Value,
//                    false);

//                /// If password sign-in succeeds
//                /// responded ok 200 status code with the user's role attached (stop code execution)
//                if (SignInResult.Succeeded)
//                {
//                    AUser.AccessFailedCount = 0;
//                    await _UserManager.UpdateAsync(AUser);
//                    return Ok(new { userRole = AUser.Role });
//                }

//                /// else login attempt failed
//                /// increase and update the user's failed login attempt by 1
//                AUser.AccessFailedCount++;
//                await _UserManager.UpdateAsync(AUser);

//                /// if failed login attempt is less than/ equal to 5 (stop code execution)
//                if (AUser.AccessFailedCount <= 5)
//                    return Unauthorized(new { message = "Incorrect Password!"});

//                /// if the user login fails attempt is more less than/ equal to 10 
//                /// Lock the user for two minutes (stop code execution)
//                if (AUser.AccessFailedCount <= 10)
//                {
//                    await _UserManager.SetLockoutEnabledAsync(AUser, true);
//                    await _UserManager.SetLockoutEndDateAsync(AUser,
//                            DateTimeOffset.UtcNow.AddMinutes(2.00));
//                    return Unauthorized(new
//                    {
//                        message = string.Format("Account Locked for {0}"
//                            , CompareWithCurrentTime(AUser.LockoutEnd))
//                    });
//                }

//                /// if failed sign in is less than 15
//                /// Lock the user for five minutes (stop code execution)
//                if (AUser.AccessFailedCount <= 15)
//                {
//                    await _UserManager.SetLockoutEnabledAsync(AUser, true);
//                    await _UserManager.SetLockoutEndDateAsync(AUser,
//                        DateTimeOffset.UtcNow.AddMinutes(5.00));
//                    return Unauthorized(new
//                    {
//                        message = string.Format("Account Locked for: {0}"
//                        , CompareWithCurrentTime(AUser.LockoutEnd))
//                    });
//                }

//                /// else user has tried their password more than 15 times
//                /// lock the user and ask them to reset their password
//                await _UserManager.SetLockoutEnabledAsync(AUser, true);
//                await _UserManager.SetLockoutEndDateAsync(AUser,
//                    DateTimeOffset.UtcNow.AddMinutes(5.00));
//                return Unauthorized(new
//                {
//                    message = "Account locked. Please reset your password."
//                });
//            }
//            catch (Exception)
//            {
//                return BadRequest(new { message = " Server Internal Error." });
//            }
//        }

//        /// <summary>
//        ///     Logout the current user (URL: api/Authentication/LogoutAsync)
//        /// </summary>
//        /// <returns>
//        ///     200 => {bool: isAuthenticated}
//        ///     400 => {}
//        /// </returns>
//        #region ** Attributes: HttpGet, Authorized, Return Status 200/ 400 **
//        [HttpGet("[action]")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status400BadRequest)]
//        #endregion
//        public async Task<IActionResult> LogoutAsync()
//        {
//            try
//            {
//                /// try to sign-out the user and return ok
//                await _SignInManager.SignOutAsync();
//                return Ok(new { isAuthenticated = false });
//            }
//            catch (Exception)
//            {
//                return BadRequest();
//            }
//        }

//        /// <summary>
//        ///     Check if the user is still logged-in. (URL: api/Authentication/SilentAuthAsync)
//        ///     This method is used to check user's authentication status in the background.
//        /// </summary>
//        /// <returns>
//        ///     200 => {
//        ///         bool: isAuthenticated,
//        ///         string: message,
//        ///         string: userRole
//        ///     }
//        ///     401 => {}
//        /// </returns>
//        #region ** Attributes: HttpGet, Authorized, Return Status 200/ 401 **
//        [HttpGet("[action]")]
//        [ProducesResponseType(StatusCodes.Status200OK)]
//        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
//        #endregion
//        public async Task<IActionResult> SilentAuthAsync()
//        {
//            try
//            {
//                /// Run the operation as async 
//                return await Task.Run(() =>
//                {
//                    // return 200 response with 
//                    return Ok(new
//                    {
//                        isAuthenticated = true,
//                        message = "",
//                        userRole = User.Claims
//                        .Where(r => r.Type == "Role").ToList()
//                        .FirstOrDefault().Value
//                    });
//                });
//            }
//            catch (Exception)
//            {
//                return Unauthorized();
//            }
//        }

//        /**********************************************/
//        /************* Private Methods ****************/
//        /**********************************************/
//        /// <summary>
//        ///     Used to extract the difference between the parameter dateTime and UtcNow.
//        /// </summary>
//        /// <param name="timeDate">DateTime object to compare with the current Utc time</param>
//        /// <returns>Returns a string type which states the time difference. (dd hh mm ss)</returns>
//        private string CompareWithCurrentTime(DateTimeOffset? timeDate)
//        {
//            if (timeDate == null)
//                return "";
//            /// checks the difference between the parameter dateTime and
//            /// the current Utc time which would return the following format 
//            /// 00.00:00:00.0000 (days.hours:minutes:seconds.milliseconds)
//            var comparedTime = (timeDate - DateTimeOffset.UtcNow);

//            /// convert the difference to string and split it at "."
//            var initSplit = comparedTime.ToString().Split(".");

//            /// switch the split length and split then at correct
//            switch (initSplit.Length)
//            {
//                case 3: // Contains both days and time
//                    /// since number of days is available then the time would be located at the position "1"
//                    /// within the initSplit with position 0 = hours, 1 = minutes, 2 = seconds
//                    var timeSplit3 = initSplit[1].Split(":");
//                    return string.Format("Day(s): {0}, Hour(s): {1}, Minute(s): {2}, Second(s): {3}",
//                        initSplit[0], timeSplit3[0], timeSplit3[1], timeSplit3[2]);

//                case 2:// contains only time and milliseconds
//                    /// since number of days is not available then the time would be located at the position "0"
//                    /// within the initSplit with position 0 = hours, 1 = minutes, 2 = seconds
//                    var timeSplit1 = initSplit[0].Split(":");
//                    if (timeSplit1[0] != "00")// if hours is not 0
//                        return string.Format("{0} hours, {1} minutes and {2} seconds",
//                            timeSplit1[0], timeSplit1[1], timeSplit1[2]);
//                    if (timeSplit1[1] != "00") // if minutes is not 0
//                        return string.Format("{0} minutes and {1} seconds.",
//                            timeSplit1[1], timeSplit1[2]);
//                    // if only the seconds is left
//                    return string.Format("{0} seconds.",
//                        timeSplit1[2]);
//                default:// show the entire time difference 
//                    return timeDate.ToString();
//            }
//        }
//    }
//}