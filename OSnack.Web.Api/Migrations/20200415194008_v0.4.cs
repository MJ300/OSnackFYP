using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.Web.Api.Migrations
{
    public partial class v04 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tokens_Users_UserId",
                table: "Tokens");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Tokens",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "EmailId",
                table: "Tokens",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmailId",
                table: "NewsletterSubscriptions",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_NewsletterSubscriptions_EmailId",
                table: "NewsletterSubscriptions",
                column: "EmailId");

            migrationBuilder.AddForeignKey(
                name: "FK_NewsletterSubscriptions_Tokens_EmailId",
                table: "NewsletterSubscriptions",
                column: "EmailId",
                principalTable: "Tokens",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tokens_Users_UserId",
                table: "Tokens",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NewsletterSubscriptions_Tokens_EmailId",
                table: "NewsletterSubscriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_Tokens_Users_UserId",
                table: "Tokens");

            migrationBuilder.DropIndex(
                name: "IX_NewsletterSubscriptions_EmailId",
                table: "NewsletterSubscriptions");

            migrationBuilder.DropColumn(
                name: "EmailId",
                table: "Tokens");

            migrationBuilder.DropColumn(
                name: "EmailId",
                table: "NewsletterSubscriptions");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Tokens",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Tokens_Users_UserId",
                table: "Tokens",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
