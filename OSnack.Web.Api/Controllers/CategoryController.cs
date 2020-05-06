using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.VisualBasic;
using OSnack.Web.Api.AppSettings;
using OSnack.Web.Api.AppSettings.CustomTypes;
using OSnack.Web.Api.Database.Context;
using OSnack.Web.Api.Database.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using static OSnack.Web.Api.AppSettings.oAppFunc;

namespace OSnack.Web.Api.Controllers
{
    [Route("[controller]")]
    public class CategoryController : ControllerBase
    {
        private AppDbContext DbContext { get; }
        private IWebHostEnvironment WebHost { get; }
        private List<oError> ErrorsList = new List<oError>();

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        public CategoryController(AppDbContext db, IWebHostEnvironment webEnv)
        {
            DbContext = db;
            WebHost = webEnv;
        }

        /// <summary>
        /// Search or get all the categories.
        /// search by name or filter by unit or status
        /// </summary>
        #region *** 200 OK, 417 ExpectationFailed ***
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [HttpGet("[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterProductUnit}/{filterStatus}")]
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)] /// Done
        public async Task<IActionResult> Get(
            int selectedPage,
            int maxNumberPerItemsPage,
            string searchValue = "",
            string filterProductUnit = "",
            string filterStatus = "")
        {
            try
            {
                bool.TryParse(filterStatus, out bool boolFilterStatus);
                ProductUnitType productUnitType = ProductUnitType.Grams;
                switch (filterProductUnit)
                {
                    case nameof(ProductUnitType.Grams):
                        productUnitType = ProductUnitType.Grams;
                        break;
                    case nameof(ProductUnitType.Kg):
                        productUnitType = ProductUnitType.Kg;
                        break;
                    case nameof(ProductUnitType.PerItem):
                        productUnitType = ProductUnitType.PerItem;
                        break;
                    default:
                        filterProductUnit = oAppConst.GetAllRecords;
                        break;
                }
                int totalCount = await DbContext.Categories
                    .Where(c => filterProductUnit.Equals(oAppConst.GetAllRecords) ? true : c.Unit == productUnitType)
                    .Where(c => filterStatus.Equals(oAppConst.GetAllRecords) ? true : c.Status == boolFilterStatus)
                    .CountAsync(c => searchValue.Equals(oAppConst.GetAllRecords) ? true : c.Name.Contains(searchValue))
                    .ConfigureAwait(false);

                List<oCategory> list = await DbContext.Categories
                    .OrderBy(c => c.Name)
                    .Where(c => filterStatus.Equals(oAppConst.GetAllRecords) ? true : c.Status == boolFilterStatus)
                    .Where(c => filterProductUnit.Equals(oAppConst.GetAllRecords) ? true : c.Unit == productUnitType)
                    .Where(c => searchValue.Equals(oAppConst.GetAllRecords) ? true : c.Name.Contains(searchValue))
                    .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                    .Take(maxNumberPerItemsPage)
                    .ToListAsync()
                    .ConfigureAwait(false);
                /// return the list of Categories
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
        ///     Create a new Category
        /// </summary>
        #region *** 201 Created, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
        [HttpPost("[action]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Ready For Test
        public async Task<IActionResult> Post([FromBody] oCategory newCategory)
        {
            try
            {
                /// if model validation failed
                if (!TryValidateModel(newCategory))
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a Category with the same name exists
                if (await DbContext.Categories
                    .AnyAsync(d => d.Name.Equals(newCategory.Name)).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppFunc.Error(ref ErrorsList, "Category already exists.");
                    return StatusCode(412, ErrorsList);
                }

                /// else Category object is made without any errors
                /// Add the new Category to the EF context
                await DbContext.Categories.AddAsync(newCategory).ConfigureAwait(false);

                try
                {
                    newCategory.ImagePath = oAppFunc.SaveImageToWWWRoot(newCategory.Name,
                            WebHost.WebRootPath,
                            newCategory.ImageBase64,
                            @"Images/Categories");
                }
                catch (Exception)
                {
                    oAppFunc.Error(ref ErrorsList, "Image cannot be saved.");
                    return StatusCode(412, ErrorsList);
                }
                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);

                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newCategory);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }


        /// <summary>
        ///     Update a modified Category
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
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)]  /// Ready For Test
        public async Task<IActionResult> Put([FromBody] oCategory modifiedCategory)
        {
            try
            {
                /// get the current category object without tracking it
                oCategory currentCatogory = await DbContext.Categories
                    .AsNoTracking()
                    .SingleOrDefaultAsync(c => c.Id == modifiedCategory.Id)
                    .ConfigureAwait(false);

                // if the current category does not exists
                if (currentCatogory == null)
                {
                    oAppFunc.Error(ref ErrorsList, "Store Not Found");
                    return NotFound(ErrorsList);
                }

                TryValidateModel(modifiedCategory);
                ModelState.Remove("ImageBase64");
                /// if model validation failed
                if (!ModelState.IsValid)
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a Category with the same name exists
                if (await DbContext.Categories
                    .AsNoTracking()
                    .AnyAsync(c => c.Name == modifiedCategory.Name && c.Id != modifiedCategory.Id)
                    .ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppFunc.Error(ref ErrorsList, "Category already exists.");
                    return StatusCode(412, ErrorsList);
                }

                if (!string.IsNullOrWhiteSpace(modifiedCategory.ImageBase64))
                {
                    try
                    {
                        modifiedCategory.ImagePath = oAppFunc.SaveImageToWWWRoot(modifiedCategory.Name,
                                WebHost.WebRootPath,
                                modifiedCategory.ImageBase64,
                                @"Images/Categories");
                    }
                    catch (Exception)
                    {
                        oAppFunc.Error(ref ErrorsList, "Image cannot be saved.");
                        return StatusCode(412, ErrorsList);
                    }
                }

                /// else Category object is made without any errors
                /// Update the current Category to the EF context
                DbContext.Categories.Update(modifiedCategory);

                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 200 OK (Update) status with the modified object
                /// and success message
                return Ok(modifiedCategory);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }

        /// <summary>
        /// Delete Category
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
        public async Task<IActionResult> Delete([FromBody] oCategory category)
        {
            try
            {
                /// if the Category record with the same id is not found
                if (!await DbContext.Categories
                    .AsNoTracking()
                    .AnyAsync(c => c.Id == category.Id)
                    .ConfigureAwait(false))
                {
                    oAppFunc.Error(ref ErrorsList, "Category not found");
                    return NotFound(ErrorsList);
                }

                /// If the category is in use by any product then do not allow delete
                if (await DbContext.Products
                    .AnyAsync(c => c.Category.Id == category.Id)
                    .ConfigureAwait(false))
                {
                    oAppFunc.Error(ref ErrorsList, "Category is in use by at least one product.");
                    return StatusCode(412, ErrorsList);
                }
                try
                {
                    oAppFunc.DeleteImage(category.ImagePath, WebHost.WebRootPath);
                }
                catch (Exception)
                {
                    DbContext.AppLogs.Add(new oAppLog { Massage = string.Format("Image was not deleted. The path is: {0}", category.ImagePath) });
                }

                /// else the Category is found
                /// now delete the Category record
                DbContext.Categories.Remove(category);
                /// save the changes to the database
                await DbContext.SaveChangesAsync().ConfigureAwait(false);
                /// return 200 OK status
                return Ok($"Category '{category.Name}' was deleted");
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

