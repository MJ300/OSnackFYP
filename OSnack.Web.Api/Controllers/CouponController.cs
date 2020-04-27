using Microsoft.AspNetCore.Http;
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
using System.Threading.Tasks;

namespace OSnack.Web.Api.Controllers
{
    [Route("api/[controller]")]
    public class CouponController : ControllerBase
    {
        private AppDbContext DbContext { get; }
        private List<oError> ErrorsList = new List<oError>();

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        public CouponController(AppDbContext db) => DbContext = db;

        /// <summary>
        /// Used to get a list of all Coupons
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
                /// return the list of Coupon ordered by Code
                return Ok(DbContext.Coupons.OrderBy(o => o.Code));
            }
            catch (Exception) //ArgumentNullException
            {
                /// in the case any exceptions return the following error
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Create a new Coupon
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
        public async Task<IActionResult> Post([FromBody] oCoupon newCoupon)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(newCoupon))
                {
                    oAppConst.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a coupon with the same name exists
                if (!await DbContext.Coupons.AnyAsync(d => d.Code == newCoupon.Code).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppConst.Error(ref ErrorsList, "Coupon already exists.");
                    return StatusCode(412, ErrorsList);
                }

                /// Add the new Coupons to the EF context
                await DbContext.Coupons.AddAsync(newCoupon).ConfigureAwait(false);
                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newCoupon);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Update a modified Coupon
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
        public async Task<IActionResult> Put([FromBody] oCoupon modifiedCoupon)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(modifiedCoupon))
                {
                    oAppConst.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a coupon with the same Code exists
                if (!await DbContext.Coupons.AnyAsync(d => d.Code == modifiedCoupon.Code).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppConst.Error(ref ErrorsList, "Coupon Not exists.");
                    return StatusCode(412, ErrorsList);
                }

                /// check the database to see if a coupon type changed
                if (await DbContext.Coupons.AnyAsync(d => d.Code == modifiedCoupon.Code &&
                                                          d.Type != modifiedCoupon.Type).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppConst.Error(ref ErrorsList, "Coupon Type Can't be Change.");
                    return StatusCode(412, ErrorsList);
                }



                /// Update the current Coupon to the EF context
                DbContext.Coupons.Update(modifiedCoupon);
                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 200 OK (Update) status with the modified object
                /// and success message
                return Ok(modifiedCoupon);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Delete Coupon
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
        public async Task<IActionResult> Delete([FromBody] oCoupon coupon)
        {
            try
            {
                /// if the coupon record with the same id is not found
                if (!await DbContext.Coupons.AnyAsync(d => d.Code == coupon.Code).ConfigureAwait(false))
                {
                    oAppConst.Error(ref ErrorsList, "Coupon not found");
                    return NotFound(ErrorsList);
                }

                /// If the coupon is in use by any Order then do not allow delete
                if (await DbContext.Orders.AnyAsync(c => c.Coupon.Code == coupon.Code).ConfigureAwait(false))
                {
                    oAppConst.Error(ref ErrorsList, "Coupon is in use by at least one Order.");
                    return StatusCode(412, ErrorsList);
                }

                /// now delete the coupon record
                DbContext.Coupons.Remove(coupon);
                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 200 OK status
                return Ok($"Coupon '{coupon.Code}' was deleted");
            }
            catch (Exception)
            {
                /// Add the error below to the error list
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }
    }
}