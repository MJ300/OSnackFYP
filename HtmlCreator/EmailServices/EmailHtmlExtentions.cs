using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HtmlCreator.EmailServices
{
    public static class EmailHtmlExtentions
    {
        /// <summary>
        /// Add the logo Element to this instance
        /// </summary>
        /// <param name="emailHtml"></param>
        /// <param name="Herf"></param>
        /// <param name="Alt"></param>
        /// <param name="Src"></param>
        /// <returns></returns>
        public static EmailHtmlCreator AddLogo(
            this EmailHtmlCreator emailHtml,
            string Herf,
            string Alt,
            string Src = null)
        {
            if (Src == null)
                return emailHtml;

            var LogoHtml = "";
            foreach (var line in emailHtml.ReadFile("LogoImage"))
            {
                var L = line;
                if (line.ToString().Contains("@@LogoHref")) { L = L.Replace("@@LogoHref", Herf); }
                if (line.Contains("@@LogoAlt"))
                {
                    L = L.Replace("@@LogoAlt", Alt);
                }
                if (line.Contains("@@LogoSrc"))
                {
                    L = L.Replace("@@LogoSrc", Src);
                }
                LogoHtml += L;
            }
            emailHtml.BodyItems.Add(LogoHtml);

            return emailHtml;
        }
        public static EmailHtmlCreator HeaderText(this EmailHtmlCreator emailHtml, string Text)
        {
            var HeaderText = "";
            foreach (var line in emailHtml.ReadFile("HeaderText"))
            {
                if (line.Contains("@@HeaderText")) { HeaderText += line.Replace("@@HeaderText", Text); }
                else { HeaderText += line; }
            }
            emailHtml.BodyItems.Add(HeaderText);
            return emailHtml;

        }
        public static EmailHtmlCreator BodyText(this EmailHtmlCreator emailHtml, string Text)
        {
            var BodyText = "";
            foreach (var line in emailHtml.ReadFile("BodyText"))
            {
                if (line.Contains("@@BodyText")) { BodyText += line.Replace("@@BodyText", Text); }
                else { BodyText += line; }
            }
            emailHtml.BodyItems.Add(BodyText);
            return emailHtml;

        }
        public static EmailHtmlCreator BodyTextLight(this EmailHtmlCreator emailHtml, string Text)
        {
            var BodyText = "";
            foreach (var line in emailHtml.ReadFile("BodyTextLight"))
            {
                if (line.Contains("@@LightItalicBodyText")) { BodyText += line.Replace("@@LightItalicBodyText", Text); }
                else { BodyText += line; }
            }
            emailHtml.BodyItems.Add(BodyText);
            return emailHtml;

        }
        public static EmailHtmlCreator FinalTable(this EmailHtmlCreator emailHtml)
        {
            var FinalRows = "";
            foreach (var row in emailHtml.TableRows)
            {
                FinalRows += row;
            }

            var FinalTable = "";
            foreach (var line in emailHtml.ReadFile("Table"))
            {
                if (line.Contains("@@TableContent")) { FinalTable += line.Replace("@@TableContent", FinalRows); }
                else { FinalTable += line; }
            }
            emailHtml.BodyItems.Add(FinalTable);
            return emailHtml;

        }
        public static EmailHtmlCreator TableRow(this EmailHtmlCreator emailHtml, string LeftCol, string RightCol)
        {
            var finalTableRow = "";
            foreach (var line in emailHtml.ReadFile("TableRow"))
            {
                var L = line;
                if (line.Contains("@@LeftCol")) { L = L.Replace("@@LeftCol", LeftCol); }
                if (line.Contains("@@RightCol")) { L = L.Replace("@@RightCol", RightCol); }
                finalTableRow += L;
            }
            emailHtml.TableRows.Add(finalTableRow);
            return emailHtml;

        }
        public static EmailHtmlCreator TableRowEnd(this EmailHtmlCreator emailHtml, string LeftCol, string RightCol)
        {
            var finalTableRow = "";
            foreach (var line in emailHtml.ReadFile("TableRowEnd"))
            {
                var L = line;
                if (line.Contains("@@LeftCol")) { L = L.Replace("@@LeftCol", LeftCol); }
                if (line.Contains("@@RightCol")) { L = L.Replace("@@RightCol", RightCol); }
                finalTableRow += L;
            }
            emailHtml.TableRows.Add(finalTableRow);
            return emailHtml;

        }
        public static EmailHtmlCreator Button(this EmailHtmlCreator emailHtml, string Text, string Href)
        {
            var finalButton = "";
            foreach (var line in emailHtml.ReadFile("Button"))
            {
                var L = line;
                if (line.Contains("@@ButtonText")) { L = L.Replace("@@ButtonText", Text); }
                if (line.Contains("@@ButtonHref")) { L = L.Replace("@@ButtonHref", Href); }
                finalButton += L;
            }
            emailHtml.BodyItems.Add(finalButton);
            return emailHtml;

        }
        public static EmailHtmlCreator FooterFinal(this EmailHtmlCreator emailHtml, string Link, string Text)
        {
            Text += Link;

            var finalHtml = "";
            foreach (var line in emailHtml.ReadFile("Footer"))
            {
                if (line.Contains("@@FooterText")) { finalHtml += line.Replace("@@FooterText", Text); }
                else { finalHtml += line; }
            }

            emailHtml.BodyItems.Add(finalHtml);
            return emailHtml;

        }
    }
}
