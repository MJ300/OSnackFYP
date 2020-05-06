using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.Web.Api.AppSettings;
using OSnack.Web.Api.AppSettings.CustomTypes;
using OSnack.Web.Api.Database.Context;
using OSnack.Web.Api.Database.Models;
using static OSnack.Web.Api.AppSettings.oAppFunc;

namespace OSnack.Web.Api.Controllers
{
    [Route("[controller]")]
    public class NewsletterController : ControllerBase
    {
        private AppDbContext DbContext { get; }
        private List<oError> ErrorsList = new List<oError>();

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        public NewsletterController(AppDbContext db) => DbContext = db;

        /// <summary>
        ///     Subscribe to newsletter
        /// </summary>
        #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 417 ExpectationFailed ***
        [HttpPost("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Ready For Test
        public async Task<IActionResult> Post([FromBody] oNewsletterSubscription newsletter)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(newsletter))
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return the errors
                    return UnprocessableEntity(ErrorsList);
                }
                using (var dbContextTransaction = DbContext.Database.BeginTransaction())
                {
                    //set token
                    newsletter.SetToken();
                    /// Add the new Newsletter to the EF context
                    await DbContext.NewsletterSubscriptions.AddAsync(newsletter).ConfigureAwait(false);


                    /// save the changes to the data base
                    await DbContext.SaveChangesAsync().ConfigureAwait(false);
                    dbContextTransaction.Commit();
                }

                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newsletter);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Delete Newsletter
        /// </summary>
        #region *** 200 OK,417 ExpectationFailed, 400 BadRequest, 404 NotFound ***
        [HttpDelete("[action]/{email}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        #endregion
        //[Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Ready For Test
        public async Task<IActionResult> Delete(string Token)
        {
            try
            {
                /// if the Newsletter record with the same id is not found
                if (!await DbContext.NewsletterSubscriptions.Include(t => t.Token)
                    .AnyAsync(d => d.Token.ValueType == TokenType.Subscription
                                && d.Token.Value.Equals(Token, StringComparison.CurrentCulture))
                    .ConfigureAwait(false))
                {
                    oAppFunc.Error(ref ErrorsList, "Token not found");
                    return NotFound(ErrorsList);
                }

                oNewsletterSubscription ns = await DbContext.NewsletterSubscriptions.Include(t => t.Token)
                    .SingleOrDefaultAsync(d => d.Token.ValueType == TokenType.Subscription
                                && d.Token.Value.Equals(Token, StringComparison.CurrentCulture))
                    .ConfigureAwait(false);

                /// now delete the Newsletter record
                DbContext.NewsletterSubscriptions.Remove(ns);

                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 200 OK status
                return Ok($"{ns.Email} is now unsubscribed");
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