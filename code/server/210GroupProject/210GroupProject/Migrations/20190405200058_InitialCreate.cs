using Microsoft.EntityFrameworkCore.Migrations;

namespace _210GroupProject.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DbOfUsers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbOfUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DbOfLists",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbOfLists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DbOfLists_DbOfUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "DbOfUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Place",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true),
                    Rating = table.Column<int>(nullable: false),
                    PriceRange = table.Column<string>(nullable: true),
                    URL = table.Column<string>(nullable: true),
                    ImageURL = table.Column<string>(nullable: true),
                    ListOfPlacesId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Place", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Place_DbOfLists_ListOfPlacesId",
                        column: x => x.ListOfPlacesId,
                        principalTable: "DbOfLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DbOfLists_UserId",
                table: "DbOfLists",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Place_ListOfPlacesId",
                table: "Place",
                column: "ListOfPlacesId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Place");

            migrationBuilder.DropTable(
                name: "DbOfLists");

            migrationBuilder.DropTable(
                name: "DbOfUsers");
        }
    }
}
