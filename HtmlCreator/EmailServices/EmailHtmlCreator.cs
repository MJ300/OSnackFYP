using DinkToPdf;
using System;
using System.Collections.Generic;
using System.IO;

namespace HtmlCreator.EmailServices
{
    public class EmailHtmlCreator
    {
        /// <summary>
        /// Used to hold the entire body content of the Email in memory. 
        /// </summary>
        internal ICollection<string> BodyItems { get; set; } = new List<string>();

        /// <summary>
        ///     This property is used to add table rows to the HTML element 
        /// e.g Table to show the invoice of the purchase 
        /// </summary>
        internal ICollection<string> TableRows { get; set; } = new List<string>();
        /// <summary>
        /// This property is used to hold the final version 
        /// of the dynamic html creator in order to be sent
        /// </summary>
        internal string FinalHtml { get; set; }

        /// <summary>
        /// This method is used to read the content of a specific template file
        /// </summary>
        /// <param name="FileName">Provide file name (must be located in 
        /// HtmlTemplate folder).
        /// </param>
        /// <returns>An IEnumerable of string which can be iterated through by line</returns>
        internal IEnumerable<string> ReadFile(string FileName)
        {
            return File.ReadLines(string.Format("{0}{1}.txt",
                Path.Combine(
                    AppDomain.CurrentDomain.BaseDirectory
                    , @"EmailServices\HtmlTemplates\") 
                , FileName));
        }

        public string FooterLinks(string Text, string Href)
        {
            var FinalLink = "";
            foreach (var line in ReadFile("FooterLink"))
            {
                var L = line;
                if (line.Contains("@@LinkText")) { L = L.Replace("@@LinkText", Text); }
                if (line.Contains("@@LinkHref")) { L = L.Replace("@@LinkHref", Href); }
                FinalLink += L;
            }
            return FinalLink;
        }

        /// <summary>
        ///     This method must be called at the end of creation of the dynamic HTML
        /// to finalize the result 
        /// </summary>
        /// <returns></returns>
        public string GetFinalHtml()
        {

            var finalBody = "";
            foreach (var item in BodyItems)
            {
                finalBody += item;
            }

            FinalHtml = "";
            foreach (var line in ReadFile("HtmlAndHead"))
            {
                if (line.Contains("@@BodyTag"))
                {
                    FinalHtml += line.Replace("@@BodyTag", finalBody);
                }
                else { FinalHtml += line; }
            }
            return FinalHtml;
        }
        public byte[] GetPdf()
        {

            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings =
                {
                    ColorMode = ColorMode.Color,
                    Orientation = Orientation.Portrait,
                    PaperSize = PaperKind.A4Small,
                    Margins =  new MarginSettings(){ Top = 10}
                },
                Objects =
                {   new ObjectSettings()
                    {
                        PagesCount = true,
                        HtmlContent = FinalHtml,
                        WebSettings = {DefaultEncoding = "utf-8"}
                    }
                }
            };

            return new BasicConverter(new PdfTools()).Convert(doc);
        }
    }
}
