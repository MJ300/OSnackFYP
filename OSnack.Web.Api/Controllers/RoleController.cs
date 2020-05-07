using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OSnack.Web.Api.AppSettings;
using OSnack.Web.Api.Database.Context;
using OSnack.Web.Api.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using static OSnack.Web.Api.AppSettings.oAppFunc;

namespace OSnack.Web.Api.Controllers
{
    [Route("[controller]")]
    public class RoleController : ControllerBase
    {
        private AppDbContext DbContext { get; }
        private List<oError> ErrorsList = new List<oError>();

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        public RoleController(AppDbContext db) => DbContext = db;

        /// <summary>
        /// Get all the Roles.
        /// </summary>
        #region *** 200 OK, 417 ExpectationFailed ***
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [HttpGet("[action]/All")]
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)] /// Done
        public async Task<IActionResult> Get()
        {
            try
            {
                /// return the list of All Roles
                return Ok(await DbContext.Roles.ToListAsync().ConfigureAwait(false));
            }
            catch (Exception) //ArgumentNullException
            {
                /// in the case any exceptions return the following error
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Search or get all the Roles.
        /// search by name or filter by access claim
        /// </summary>
        #region *** 200 OK, 417 ExpectationFailed ***
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [HttpGet("[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterAccessClaim}")]
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)] /// Done
        public async Task<IActionResult> Get(
            int selectedPage,
            int maxNumberPerItemsPage,
            string searchValue = "",
            string filterAccessClaim = "")
        {
            try
            {
                int totalCount = await DbContext.Roles
                    .Where(r => filterAccessClaim.Equals(oAppConst.GetAllRecords) ? true : r.AccessClaim.Equals(filterAccessClaim))
                    .CountAsync(r => searchValue.Equals(oAppConst.GetAllRecords) ? true : r.Name.Contains(searchValue))
                    .ConfigureAwait(false);

                List<oRole> list = await DbContext.Roles
                    .OrderBy(c => c.Name)
                    .Where(r => filterAccessClaim.Equals(oAppConst.GetAllRecords) ? true : r.AccessClaim.Equals(filterAccessClaim))
                    .Where(r => searchValue.Equals(oAppConst.GetAllRecords) ? true : r.Name.Contains(searchValue))
                    .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                    .Take(maxNumberPerItemsPage)
                    .ToListAsync()
                    .ConfigureAwait(false);
                /// return the list of Roles
                return Ok(new { list, totalCount });
            }
            catch (Exception) //ArgumentNullException
            {
                /// in the case any exceptions return the following error
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Create a new Role
        /// </summary>
        #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
        [HttpPost("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Ready For Test
        public async Task<IActionResult> Post([FromBody] oRole newRole)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(newRole))
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a role with the same name exists
                if (await DbContext.Categories.AnyAsync(d => d.Name.Equals(newRole.Name)).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppFunc.Error(ref ErrorsList, "Role already exists.");
                    return StatusCode(412, ErrorsList);
                }

                /// else role object is made without any errors
                /// Add the new role to the EF context
                await DbContext.Roles.AddAsync(newRole).ConfigureAwait(false);

                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newRole);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Update a modified Role
        /// </summary>
        #region *** 200 OK, 304 NotModified,412 PreconditionFailed ,422 UnprocessableEntity, 417 ExpectationFailed***
        [HttpPut("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Ready For Test
        public async Task<IActionResult> Put([FromBody] oRole modifiedRole)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(modifiedRole))
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a Category with the same name exists
                if (await DbContext.Categories.AnyAsync(d => d.Name == modifiedRole.Name).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppFunc.Error(ref ErrorsList, "Role already exists.");
                    return StatusCode(412, ErrorsList);
                }

                /// else Role object is made without any errors
                /// Update the current Role on EF context
                DbContext.Roles.Update(modifiedRole);

                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 200 OK (Update) status with the modified object
                /// and success message
                return Ok(modifiedRole);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Delete Role
        /// </summary>
        #region *** 200 OK,417 ExpectationFailed, 400 BadRequest,404 NotFound,412 PreconditionFailed ***
        [HttpDelete("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        #endregion
        //[Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Ready For Test
        public async Task<IActionResult> Delete([FromBody] oRole role)
        {
            try
            {
                /// if the Category record with the same id is not found
                if (!await DbContext.Roles.AnyAsync(d => d.Id == role.Id).ConfigureAwait(false))
                {
                    oAppFunc.Error(ref ErrorsList, "Role not found");
                    return NotFound(ErrorsList);
                }

                /// If the category is in use by any product then do not allow delete
                if (await DbContext.Users.AnyAsync(c => c.Role.Id == role.Id).ConfigureAwait(false))
                {
                    oAppFunc.Error(ref ErrorsList, "Failed. Role is in use by at least one user.");
                    return StatusCode(412, ErrorsList);
                }

                /// else the role is found
                /// now delete the role record
                DbContext.Roles.Remove(role);

                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 200 OK status
                return Ok($"'{role.Name}' was deleted");
            }
            catch (Exception)
            {
                /// Add the error below to the error list
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }
    }
}

