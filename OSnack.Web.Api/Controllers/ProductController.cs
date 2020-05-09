using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Storage;
using MimeKit.Encodings;
using OSnack.Web.Api.AppSettings;
using OSnack.Web.Api.AppSettings.CustomTypes;
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
    public class ProductController : ControllerBase
    {

        private AppDbContext DbContext { get; }
        private List<oError> ErrorsList = new List<oError>();
        private IWebHostEnvironment WebHost { get; }

        /// <summary>
        ///     Class Constructor. Set the local properties
        /// </summary>
        /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
        public ProductController(AppDbContext db, IWebHostEnvironment webEnv)
        {
            DbContext = db;
            WebHost = webEnv;
        }

        /// <summary>
        /// Used to get a list of all Products
        /// </summary>
        #region *** 200 OK, 417 ExpectationFailed ***
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        #region *** 200 OK, 417 ExpectationFailed ***
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [HttpGet("[action]/" +
            "{selectedPage}/" +
            "{maxNumberPerItemsPage}/" +
            "{filterProductStoreId}/" +
            "{filterProductCategory}/" +
            "{searchValue}" +
            "/{filterProductUnit}" +
            "/{filterStatus}" +
            "/{isAccendingSort}" +
            "/{sortByType}")]
        // [Authorize(oAppConst.AccessPolicies.LevelTwo)] /// Done
        public async Task<IActionResult> Get(
            int selectedPage,
            int maxNumberPerItemsPage,
            int filterProductStoreId,
            string filterProductCategory,
            string searchValue = "",
            string filterProductUnit = "",
            string filterStatus = "",
            bool isAccendingSort = true,
            SortByType sortByType = SortByType.product)
        {
            try
            {
                bool.TryParse(filterStatus, out bool boolFilterStatus);
                int.TryParse(filterProductCategory, out int filterProductCategoryId);
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
                int totalCount = await DbContext.StoreProducts
                    .Where(sp => filterProductStoreId.Equals(oAppConst.GetAllRecords) ? true : sp.Store.Id == filterProductStoreId)
                    .Where(sp => filterProductUnit.Equals(oAppConst.GetAllRecords) ? true : sp.Product.Unit == productUnitType)
                    .Where(sp => filterProductCategory.Equals(oAppConst.GetAllRecords) ? true : sp.Product.Category.Id == filterProductCategoryId)
                    .CountAsync(sp => searchValue.Equals(oAppConst.GetAllRecords) ? true : (sp.Product.Name.Contains(searchValue) || sp.Product.Id.ToString().Contains(searchValue)))
                    .ConfigureAwait(false);

                /// Include the necessary properties
                IIncludableQueryable<oStoreProduct, oCategory> product = DbContext.StoreProducts
                        .Include(sp => sp.Store)
                        .Include(sp => sp.Product)
                        .ThenInclude(p => p.Category);

                IQueryable sortedList;
                if (isAccendingSort)
                    sortedList = sortByType switch
                    {
                        SortByType.category => product.OrderBy(sp => sp.Product.Category.Name),
                        SortByType.price => product.OrderBy(sp => sp.Product.Price),
                        SortByType.unit => product.OrderBy(sp => sp.Product.Unit),
                        SortByType.unitQuantity => product.OrderBy(sp => sp.Product.UnitQuantity),
                        SortByType.status => product.OrderBy(sp => sp.Status),
                        _ => product.OrderBy(sp => sp.Product.Name),
                    };
                else
                    sortedList = sortByType switch
                    {
                        SortByType.category => product.OrderByDescending(sp => sp.Product.Category.Name),
                        SortByType.price => product.OrderByDescending(sp => sp.Product.Price),
                        SortByType.unit => product.OrderByDescending(sp => sp.Product.Unit),
                        SortByType.unitQuantity => product.OrderByDescending(sp => sp.Product.UnitQuantity),
                        SortByType.status => product.OrderByDescending(sp => sp.Status),
                        _ => product.OrderByDescending(sp => sp.Product.Name),
                    };

                List<oStoreProduct> list = await product
                            .Where(sp => filterProductStoreId.Equals(oAppConst.GetAllRecords) ? true : sp.Store.Id == filterProductStoreId)
                            .Where(sp => filterProductUnit.Equals(oAppConst.GetAllRecords) ? true : sp.Product.Unit == productUnitType)
                            .Where(sp => filterProductCategory.Equals(oAppConst.GetAllRecords) ? true : sp.Product.Category.Id == filterProductCategoryId)
                            .Where(sp => searchValue.Equals(oAppConst.GetAllRecords) ? true : (sp.Product.Name.Contains(searchValue) || sp.Product.Id.ToString().Contains(searchValue)))
                            .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                            .Take(maxNumberPerItemsPage)
                            .ToListAsync()
                            .ConfigureAwait(false);


                //int totalCount = await DbContext.Products
                //    .Where(c => filterProductUnit.Equals(oAppConst.GetAllRecords) ? true : c.Unit == productUnitType)
                //    .Where(c => filterProductCategory.Equals(oAppConst.GetAllRecords) ? true : c.Category.Id == filterProductCategoryId)
                //    .CountAsync(c => searchValue.Equals(oAppConst.GetAllRecords) ? true : c.Name.Contains(searchValue))
                //    .ConfigureAwait(false);

                //List<oProduct> list = await DbContext.Products
                //    .OrderBy(c => c.Name)
                //    .Where(c => filterProductUnit.Equals(oAppConst.GetAllRecords) ? true : c.Unit == productUnitType)
                //    .Where(c => filterProductCategory.Equals(oAppConst.GetAllRecords) ? true : c.Category.Id == filterProductCategoryId)
                //    .Include(t => t.StoreProducts)
                //    .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                //    .Take(maxNumberPerItemsPage)
                //    .ToListAsync()
                //    .ConfigureAwait(false);
                //foreach (oProduct product in list)
                //{
                //    product.StoreProducts = product.StoreProducts.Where(t => t.StoreId == filterProductStoreId).ToList();
                //}
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
                newProduct.Category = await DbContext.Categories.FindAsync(newProduct.Category.Id).ConfigureAwait(false);
                ModelState.Clear();
                TryValidateModel(newProduct);
                ModelState.Remove("Category.ImageBase64");
                /// if model validation failed
                if (!ModelState.IsValid)
                {
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a Product with the same name exists
                if (await DbContext.Products.AnyAsync(d => d.Name == newProduct.Name).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppFunc.Error(ref ErrorsList, "Product already exists.");
                    return StatusCode(412, ErrorsList);
                }

                try
                {
                    newProduct.ImagePath = oAppFunc.SaveImageToWWWRoot(newProduct.Name,
                            WebHost.WebRootPath,
                            newProduct.ImageBase64,
                            @"Images\Products");
                }
                catch (Exception)
                {
                    oAppFunc.Error(ref ErrorsList, "Image cannot be saved.");
                    return StatusCode(412, ErrorsList);
                }

                List<oStoreProduct> storeProductList = new List<oStoreProduct>();

                await DbContext.Stores
                    .ForEachAsync(s =>
                    {
                        storeProductList.Add(new oStoreProduct
                        {
                            Store = s,
                            Quantity = 0,
                            Status = false
                        });
                    }).ConfigureAwait(false);

                newProduct.StoreProducts = storeProductList;
                /// Add the new Product to the EF context
                await DbContext.Products.AddAsync(newProduct).ConfigureAwait(false);

                //using (IDbContextTransaction dbContextTransaction = DbContext.Database.BeginTransaction())
                //{
                //    try
                //    {
                //        /// save the changes to the database
                //        await DbContext.SaveChangesAsync().ConfigureAwait(false);

                //        foreach (oStore store in await DbContext.Stores.ToListAsync().ConfigureAwait(false))
                //        {
                //            await DbContext.StoreProducts.AddAsync(new oStoreProduct
                //            {
                //                ProductId = newProduct.Id,
                //                StoreId = store.Id,
                //                Quantity = 0,
                //                Status = false
                //            }).ConfigureAwait(false);
                //        }
                //        await DbContext.SaveChangesAsync().ConfigureAwait(false);
                //        dbContextTransaction.Commit();
                //    }
                //    catch (Exception e)
                //    {
                //        dbContextTransaction.Rollback();
                //        oAppFunc.DeleteImage(newProduct.ImagePath, WebHost.WebRootPath);
                //        throw;
                //    }
                //}
                try
                {
                    await DbContext.SaveChangesAsync().ConfigureAwait(false);
                }
                catch (Exception)
                {

                    oAppFunc.DeleteImage(newProduct.ImagePath, WebHost.WebRootPath);
                    throw;
                }
                newProduct.StoreProducts = null;
                /// return 201 created status with the new object
                /// and success message
                return Created("Success", newProduct);
            }
            catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
            {
                /// Add the error below to the error list and return bad request
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }


        /// <summary>
        ///     Create/ update a new Score
        /// </summary>
        #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
        [HttpPost("[action]/Score")]
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
                    oAppFunc.ExtractErrors(ModelState, ref ErrorsList);
                    /// return Unprocessable Entity with all the errors
                    return UnprocessableEntity(ErrorsList);
                }

                /// check the database to see if a Product with the same name exists
                if (!await DbContext.Products.AnyAsync(d => d.Name == modifiedProduct.Name).ConfigureAwait(false))
                {
                    /// extract the errors and return bad request containing the errors
                    oAppFunc.Error(ref ErrorsList, "Product already exists.");
                    return StatusCode(412, ErrorsList);
                }

                //TODO : Save Image Byte Into Media


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
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
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
                    oAppFunc.Error(ref ErrorsList, "Product not found");
                    return NotFound(ErrorsList);
                }

                /// If the Product is in use by any OrdersItems then do not allow delete
                if (await DbContext.OrdersItems.AnyAsync(c => c.StoreProduct.Product.Id == product.Id).ConfigureAwait(false))
                {
                    oAppFunc.Error(ref ErrorsList, "Product is in use by at least one Orders Items.");
                    return StatusCode(412, ErrorsList);
                }

                //TODO : Delete Image from Media API

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
                oAppFunc.Error(ref ErrorsList, oAppConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }
    }
}