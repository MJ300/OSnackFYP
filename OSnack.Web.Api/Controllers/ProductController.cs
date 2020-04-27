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
    public class ProductController : ControllerBase
    {

        private AppDbContext DbContext { get; }
        private List<oError> ErrorsList = new List<oError>();

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        public ProductController(AppDbContext db) => DbContext = db;

        /// <summary>
        /// Used to get a list of all Products
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
                /// return the list of Product ordered by Category name
                return Ok(DbContext.Products.OrderBy(o => o.Category.Name));
            }
            catch (Exception) //ArgumentNullException
            {
                /// in the case any exceptions return the following error
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Create a new Product
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
        public async Task<IActionResult> Post([FromBody] oProduct newProduct)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(newProduct))
                {
                    oAppConst.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a Product with the same name exists
                if (!await DbContext.Products.AnyAsync(d => d.Name == newProduct.Name).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppConst.Error(ref ErrorsList, "Product already exists.");
                    return StatusCode(412, ErrorsList);
                }

                /// Add the new Product to the EF context
                await DbContext.Products.AddAsync(newProduct).ConfigureAwait(false);

                //TODO : Save Image Byte Into Media Api

                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newProduct);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        ///     Update a modified Product
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
        public async Task<IActionResult> Put([FromBody] oProduct modifiedProduct)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(modifiedProduct))
                {
                    oAppConst.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a Product with the same name exists
                if (!await DbContext.Products.AnyAsync(d => d.Name == modifiedProduct.Name).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppConst.Error(ref ErrorsList, "Product already exists.");
                    return StatusCode(412, ErrorsList);
                }

                //TODO : Save Image Byte Into Media Api


                /// Update the current Product to the EF context
                DbContext.Products.Update(modifiedProduct);

                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 200 OK (Update) status with the modified object
                /// and success message
                return Ok(modifiedProduct);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppConst.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Delete Product
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
        public async Task<IActionResult> Delete([FromBody] oProduct product)
        {
            try
            {
                /// if the Product record with the same id is not found
                if (!await DbContext.Categories.AnyAsync(d => d.Id == product.Id).ConfigureAwait(false))
                {
                    oAppConst.Error(ref ErrorsList, "Product not found");
                    return NotFound(ErrorsList);
                }

                /// If the Product is in use by any OrdersItems then do not allow delete
                if (await DbContext.OrdersItems.AnyAsync(c => c.Product.Id == product.Id).ConfigureAwait(false))
                {
                    oAppConst.Error(ref ErrorsList, "Product is in use by at least one Orders Items.");
                    return StatusCode(412, ErrorsList);
                }

                //TODO : Delete Image from Media Api

                /// now delete the Product record
                DbContext.Products.Remove(product);
                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 200 OK status
                return Ok($"Product '{product.Name}' was deleted");
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