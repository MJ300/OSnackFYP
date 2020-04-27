﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OSnack.Web.Api.AppModels;
using OSnack.Web.Api.AppSettings;
using OSnack.Web.Api.Database.Context;
using OSnack.Web.Api.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OSnack.Web.Api.Controllers
{
    [Route("api/[controller]")]
    // [Authorize(oAppConst.AccessPolicies.LevelFour)]
    public class UserController : Controller
    {
        private AppDbContext DbContext { get; }
        private UserManager<oUser> UserManager { get; }
        private List<oError> ErrorsList = new List<oError>();

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        /// <param name="um)">Receive the UserManager instance from the ASP.Net Pipeline</param>
        public UserController(AppDbContext db, UserManager<oUser> um)
        {
            DbContext = db;
            UserManager = um;
        }

        /// <summary>
        /// Used to get a list of all users
        /// </summary>
        #region *** 200 OK, 417 ExpectationFailed ***
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [HttpGet("[action]/{roleId}/{searchValue?}")]
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)] /// Ready For Test
        public async Task<IActionResult> Get(string role, string searchValue = "")
        {
            try
            {
                //1.Check the search parameter and filters and return the appropriate user list
                //      a.If search value is empty or null then return the filtered users
                //          Note(Default value for parameters)
                //                    searchValue = null
                //ALL OTHER PARAMETERS = ***GET - ALL ***
                List<oUser> userList;
                /// populate the list to be returned
                if (string.IsNullOrWhiteSpace(searchValue))
                {

                    userList = await DbContext.Users.Where(u => u.Role == role)
                                                    .Include(a => a.Addresses)
                                                    .ToListAsync().ConfigureAwait(false);
                }
                else
                {
                    int.TryParse(searchValue, out int userId);
                    userList = await DbContext.Users.Where(u => u.Role == role).Where(u => u.Id == userId
                                                             || u.FirstName.Contains(searchValue, StringComparison.CurrentCultureIgnoreCase)
                                                             || u.Surname.Contains(searchValue, StringComparison.CurrentCultureIgnoreCase)
                                                             || u.Email.Contains(searchValue, StringComparison.CurrentCultureIgnoreCase))
                                                    .Include(a => a.Addresses)
                                                    .ToListAsync()
                                                    .ConfigureAwait(false);
                }



                /// return the list of Role ordered by name
                return Ok(userList);
            }
            catch (Exception) //ArgumentNullException
            {
                /// in the case any exceptions return the following error
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Create a new User
        /// </summary>
        #region *** 201 Created, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
        [HttpPost("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        //[Authorize(oAppConst.AccessPolicies.LevelOne)]  /// Ready For Test
        public async Task<IActionResult> Post([FromBody] oUser newUser)
        {
            try
            {
                newUser.PasswordHash = newUser.NewPassword;
                ModelState.Clear();
                /// if model validation failed
                if (!TryValidateModel(newUser))
                {
                    oAppConst.ExtractErrors(ModelState, ref ErrorsList);
                    /// return bad request with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a user with the same email exists
                if (DbContext.Users.Any(d => d.Email == newUser.Email))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppConst.Error(ref ErrorsList, "Email already exists.");
                    return StatusCode(412, ErrorsList);
                }

                /// Create the new user
                IdentityResult newUserResult = await UserManager.CreateAsync(newUser, newUser.PasswordHash)
                                                                .ConfigureAwait(false);


                /// If result failed
                if (!newUserResult.Succeeded)
                {
                    /// Add the error below to the error list and return bad request
                    foreach (var error in newUserResult.Errors)
                    {
                        oAppConst.Error(ref ErrorsList, error.Description, error.Code);
                    }
                    return StatusCode(417, ErrorsList);
                }

                /// else result is successful the try to add the access claim for the user
                IdentityResult addedClaimResult = await UserManager.AddClaimAsync(
                        newUser,
                        new Claim(oAppConst.AccessClaims.Type, newUser.Role)
                    ).ConfigureAwait(false);

                /// if claim failed to be created
                if (!addedClaimResult.Succeeded)
                {
                    /// remove the user account and return appropriate error
                    DbContext.Users.Remove(newUser);
                    await DbContext.SaveChangesAsync().ConfigureAwait(false);
                    oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                    return StatusCode(417, ErrorsList);
                }

                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newUser);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Update user record
        /// </summary>
        #region *** Put, 200 OK, 422 UnprocessableEntity,412 PreconditionFailed, 417 ExpectationFailed ***
        [HttpPut("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        //[Authorize(oAppConst.AccessPolicies.LevelOne)]  /// Ready For Test
        public async Task<IActionResult> Put([FromBody] oUser modifiedUser)
        {
            try
            {
                /// Try to validate the model
                TryValidateModel(modifiedUser);
                /// remove the passwordHash and confrimPassword since
                /// the password update gets handled by another method in this class
                ModelState.Remove("PasswordHash");
                if (!ModelState.IsValid)
                {
                    /// extract the errors and return bad request containing the errors
                    oAppConst.ExtractErrors(ModelState, ref ErrorsList);
                    return UnprocessableEntity(ErrorsList);
                }

                /// if the user record with the same id is not found
                if (!DbContext.Users.Any(u => u.Id == modifiedUser.Id))
                {
                    oAppConst.Error(ref ErrorsList, "User not found");
                    return StatusCode(412, ErrorsList);
                }
                /// find the current user details from the database
                oUser userDetails = DbContext.Users.Find(modifiedUser.Id);

                /// update the user details with the new details
                userDetails.FirstName = modifiedUser.FirstName;
                userDetails.Surname = modifiedUser.Surname;
                userDetails.Email = modifiedUser.Email;
                userDetails.PhoneNumber = modifiedUser.PhoneNumber;
                userDetails.Role = modifiedUser.Role;

                /// thus update user in the context
                DbContext.Users.Update(userDetails);

                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// thus return 200 ok status with the updated object
                return Ok(userDetails);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Check if the user exists then block the user
        /// </summary>
        #region ***  Put, 200 OK, 422 UnprocessableEntity,412 PreconditionFailed, 417 ExpectationFailed***
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [Authorize(oAppConst.AccessPolicies.LevelTwo)]
        [HttpPut("put/{userId}/{lockoutEnabled}")]  /// Ready For Test
        public async Task<IActionResult> Put(int userId, bool lockoutEnabled)
        {
            try
            {

                /// if the user with the same id is not found
                oUser user = await DbContext.Users.FindAsync(userId).ConfigureAwait(false);
                if (user == null)
                {
                    oAppConst.Error(ref ErrorsList, "User not found");
                    return StatusCode(412, ErrorsList);
                }

                user.LockoutEnabled = lockoutEnabled;


                /// update user in the context
                DbContext.Users.Update(user);

                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// thus return 200 ok status with the updated object
                return Ok(user);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Update the password of current user
        /// </summary>
        #region ***  Put, 200 OK, 422 UnprocessableEntity,412 PreconditionFailed, 417 ExpectationFailed ***
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [Authorize(oAppConst.AccessPolicies.LevelFour)]  /// Ready For Test
        [HttpPut("[action]")]
        public async Task<IActionResult> PutMyPassword([FromBody] oUser modifiedUser)
        {
            try
            {
                int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "UserId").Value, out int userId);
                if (modifiedUser.Id != userId)
                {
                    oAppConst.Error(ref ErrorsList, "Not Authorized!");
                    return StatusCode(412, ErrorsList);
                }

                oUser result = await UpdatePassword(modifiedUser).ConfigureAwait(false);
                if (result == null)
                {
                    return StatusCode(412, ErrorsList);
                }

                return Ok(result);

            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Update the password of the user
        /// </summary>
        #region ***  Put, 200 OK, 412 PreconditionFailed, 417 ExpectationFailed  ***
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
       // [Authorize(oAppConst.AccessPolicies.LevelOne)]  /// Ready For Test
        [HttpPut("[action]")]
        public async Task<IActionResult> PutPassword([FromBody] oUser modifiedUser)
        {
            try
            {
                oUser result = await UpdatePassword(modifiedUser).ConfigureAwait(false);
                if (result == null)
                    return StatusCode(412, ErrorsList);

                return Ok(result);

            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Delete a user
        /// </summary>
        #region *** Delete, 200 OK, 412 PreconditionFailed, 417 ExpectationFailed ***
        [HttpDelete("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        // [Authorize(oAppConst.AccessPolicies.LevelOne)]  /// Ready For Test
        public async Task<IActionResult> Delete([FromBody] oUser thisUser)
        {
            try
            {
                /// if the User record with the same id is not found
                if (!DbContext.Users.Any(u => u.Id == thisUser.Id))
                {
                    oAppConst.Error(ref ErrorsList, "User not found");
                    return StatusCode(412, ErrorsList);
                }

                /// else the User is found
                /// now delete the user record
                DbContext.Users.Remove(DbContext.Users.Find(thisUser.Id));

                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 200 OK status
                return Ok($"User ID ('{thisUser.Id}') was deleted");
            }
            catch (Exception)
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList); 
            }
        }

        private async Task<oUser> UpdatePassword(oUser SelectedUser)
        {
            /// find the current user details from the database
            oUser userDetails = DbContext.Users.Find(SelectedUser.Id);

            if (userDetails == null)
            {
                oAppConst.Error(ref ErrorsList, "User not found!");
                return null;
            }

            /// generate new password reset token
            string passResetToken = await UserManager.GeneratePasswordResetTokenAsync(userDetails).ConfigureAwait(false);
            /// reset user's password
            IdentityResult result = await UserManager.ResetPasswordAsync(
                        userDetails, passResetToken, SelectedUser.NewPassword).ConfigureAwait(false);

            /// if result is Failed
            if (!result.Succeeded)
            {
                foreach (var item in result.Errors)
                    ErrorsList.Add(new oError(item.Code, item.Description));

                return null;
            }

            /// else the result is a success.
            return userDetails;
        }
    }
}