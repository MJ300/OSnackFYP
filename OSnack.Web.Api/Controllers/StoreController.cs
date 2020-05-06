using Microsoft.AspNetCore.Authorization;
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
    public class StoreController : ControllerBase
    {
        private AppDbContext DbContext { get; }
        private List<oError> ErrorsList = new List<oError>();

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        public StoreController(AppDbContext db) => DbContext = db;

        /// <summary>
        /// Used to get a list of all Stores
        /// </summary>
        #region *** 200 OK, 417 ExpectationFailed ***
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [HttpGet("[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue?}")]
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)] /// Done
        public async Task<IActionResult> Get(
            int selectedPage,
            int maxNumberPerItemsPage,
            string searchValue = "")
        {
            try
            {
                int totalCount = await DbContext.Stores
                    .CountAsync(s => searchValue.Equals(oAppConst.GetAllRecords) ? true : s.Name.Contains(searchValue))
                    .ConfigureAwait(false);

                List<oStore> list = await DbContext.Stores
                    .OrderBy(s => s.Name)
                    .Where(s => searchValue.Equals(oAppConst.GetAllRecords) ? true : s.Name.Contains(searchValue))
                    .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                    .Take(maxNumberPerItemsPage)
                    .ToListAsync()
                    .ConfigureAwait(false);
                /// return the list of Stores
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
        ///     Create a new Store
        /// </summary>
        #region *** 201 Created, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
        [HttpPost("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        //[Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Done
        public async Task<IActionResult> Post([FromBody] oStore newStore)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(newStore))
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a Store with the same name exists
                if (await DbContext.Stores.AsNoTracking()
                    .AnyAsync(d => d.Name.Equals(newStore.Name)).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppFunc.Error(ref ErrorsList, "Store already exists.");
                    return StatusCode(412, ErrorsList);
                }

                /// else Store object is made without any errors
                /// Add the new Store to the EF context
                await DbContext.Stores.AddAsync(newStore).ConfigureAwait(false);

                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newStore);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Update a modified Store
        /// </summary>
        #region *** 200 OK, 404 NotFound, 412 PreconditionFailed, 422 UnprocessableEntity, 417 ExpectationFailed***
        [HttpPut("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        //[Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Done
        public async Task<IActionResult> Put([FromBody] oStore modifiedStore)
        {
            try
            {
                /// get the current store object without tracking it
                oStore currentStore = await DbContext.Stores
                    .AsNoTracking()
                    .SingleOrDefaultAsync(s => s.Id == modifiedStore.Id)
                    .ConfigureAwait(false);

                // if the current store does not exists
                if (currentStore == null)
                {
                    oAppFunc.Error(ref ErrorsList, "Store Not Found");
                    return NotFound(ErrorsList);
                }

                /// if model validation failed
                if (!TryValidateModel(modifiedStore))
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }


                /// check the database to see if a Store with the same name exists
                if (await DbContext.Stores
                    .AsNoTracking()
                    .AnyAsync(d => d.Name.Equals(modifiedStore.Name) && d.Id != modifiedStore.Id)
                    .ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppFunc.Error(ref ErrorsList, "Store already exists.");
                    return StatusCode(412, ErrorsList);
                }


                /// else Store object is made without any errors
                /// Update the current Store on EF context
                DbContext.Stores.Update(modifiedStore);

                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 200 OK (Update) status with the modified object
                /// and success message
                return Ok(modifiedStore);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Delete Store
        /// </summary>
        #region *** 200 OK,417 ExpectationFailed, 400 BadRequest,404 NotFound,412 PreconditionFailed ***
        [HttpDelete("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        //[Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Done Must be tested for in use stores
        public async Task<IActionResult> Delete([FromBody] oStore store)
        {
            try
            {
                /// if the Store record with the same id is not found
                if (!await DbContext.Stores
                    .AsNoTracking()
                    .AnyAsync(d => d.Id == store.Id)
                    .ConfigureAwait(false))
                {
                    oAppFunc.Error(ref ErrorsList, "Store not found");
                    return NotFound(ErrorsList);
                }

                /// If the store is already in use do not allow deletion
                if (await DbContext.OrdersItems.AsNoTracking()
                    .AnyAsync(oi => oi.StoreId == store.Id).ConfigureAwait(false))
                {
                    oAppFunc.Error(ref ErrorsList, "Store already in use. Contact administrator to delete this store");
                    return StatusCode(412, ErrorsList);
                }

                /// else the Store is found.
                /// now delete the Store record
                DbContext.Stores.Remove(store);

                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 200 OK status
                return Ok($"'{store.Name}' was deleted");
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

