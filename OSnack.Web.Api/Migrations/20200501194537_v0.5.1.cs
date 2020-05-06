using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.Web.Api.Migrations
{
    public partial class v051 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Stores_Name",
                table: "Stores",
                column: "Name",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Stores_Name",
                table: "Stores");
        }
    }
}
