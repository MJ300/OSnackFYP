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
    public class OrderController : ControllerBase
    {
        private AppDbContext DbContext { get; }
        private List<oError> ErrorsList = new List<oError>();

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        public OrderController(AppDbContext db) => DbContext = db;

        /// <summary>
        /// Used to get a list of all Order with OrderItems
        /// </summary>
        #region *** 200 OK, 417 ExpectationFailed ***
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [HttpGet("[action]")]
        // [Authorize(oAppConst.AccessPolicies.LevelFour)]  /// Ready For Test
        public IActionResult Get()
        {
            try
            {
                /// return the list of Category ordered by Address Id
                return Ok(DbContext.Orders.Include(o => o.OrderItems).OrderBy(o => o.Address.Id));
            }
            catch (Exception) //ArgumentNullException
            {
                /// in the case any exceptions return the following error
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Create a new Order
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
        public async Task<IActionResult> Post([FromBody] oOrder newOrder)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(newOrder))
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }


                /// Add the new Order to the EF context
                await DbContext.Orders.AddAsync(newOrder).ConfigureAwait(false);

                //TODO : Calculate price per quantity 
                //TODO : Save Image Byte Into Media Api

                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newOrder);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Update a modified Order
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
        public async Task<IActionResult> Put([FromBody] oOrder modifiedOrder)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(modifiedOrder))
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                ///TODO Change Statues Only Or Update ALl

                /// Update the current Order to the EF context
                DbContext.Orders.Update(modifiedOrder);

                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 200 OK (Update) status with the modified object
                /// and success message
                return Ok(modifiedOrder);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Delete Order
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
        public async Task<IActionResult> Delete([FromBody] oOrder order)
        {
            try
            {
                /// if the Order record with the same id is not found
                if (!await DbContext.Categories.AnyAsync(d => d.Id == order.Id).ConfigureAwait(false))
                {
                    oAppFunc.Error(ref ErrorsList, "Order not found");
                    return NotFound(ErrorsList);
                }

                /// now delete the Order record
                DbContext.Orders.Remove(order);
                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 200 OK status
                return Ok($"Order '{order.Id}' was deleted");
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