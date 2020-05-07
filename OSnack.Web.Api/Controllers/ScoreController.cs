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
using System.Text;
using System.Threading.Tasks;
using static OSnack.Web.Api.AppSettings.oAppFunc;

namespace OSnack.Web.Api.Controllers
{
    [Route("[controller]")]
    public class ScoreController : ControllerBase
    {
        private AppDbContext DbContext { get; }
        private List<oError> ErrorsList = new List<oError>();

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        public ScoreController(AppDbContext db) => DbContext = db;

        /// <summary>
        ///     Create a new Score
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
        public async Task<IActionResult> Post([FromBody] oScore newScore)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(newScore))
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                ///// check the database to see if a Score with the same name exists
                //if (!await DbContext.Categories.AnyAsync(d => d.Name == newRole.Name).ConfigureAwait(false))
                //{
                //    /// extract the errors and return bad request containing the errors
                //    oAppFunc.Error(ref ErrorsList, "Role already exists.");
                //    return StatusCode(412, ErrorsList);
                //}

                /// else score object is made without any errors
                /// Add the new score to the EF context
                await DbContext.Scores.AddAsync(newScore).ConfigureAwait(false);

                /// save the changes to the data base
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newScore);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }
    }
}


