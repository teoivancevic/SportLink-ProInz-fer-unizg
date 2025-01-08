﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SportLink.API.Data;

#nullable disable

namespace SportLink.API.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("OrganizationSport", b =>
                {
                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<int>("SportId")
                        .HasColumnType("int");

                    b.HasKey("OrganizationId", "SportId");

                    b.HasIndex("SportId");

                    b.ToTable("OrganizationSport");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.OTPCode", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ExpiresAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsUsed")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("OTPCode", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Organization", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ContactEmail")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ContactPhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.Property<string>("RejectionResponse")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("VerificationStatus")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(max)")
                        .HasDefaultValue("Unverified");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("Organization", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Review", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Rating")
                        .HasColumnType("int");

                    b.Property<string>("Response")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("UserId", "OrganizationId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("Review", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Role", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "AppAdmin"
                        },
                        new
                        {
                            Id = 2,
                            Name = "OrganizationOwner"
                        },
                        new
                        {
                            Id = 3,
                            Name = "User"
                        });
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.SocialNetwork", b =>
                {
                    b.Property<string>("Type")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Link")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Type", "OrganizationId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("SocialNetwork", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Sport", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Sport", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.SportCourt", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AvailableCourts")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("SportId")
                        .HasColumnType("int");

                    b.Property<int>("SportsObjectId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("maxHourlyPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<decimal>("minHourlyPrice")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("Id");

                    b.HasIndex("SportId");

                    b.HasIndex("SportsObjectId");

                    b.ToTable("SportCourt", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.SportsObject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.ToTable("SportsObject", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Tournament", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("EntryFee")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<int>("SportId")
                        .HasColumnType("int");

                    b.Property<DateTime>("TimeFrom")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("TimeTo")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.HasIndex("SportId");

                    b.ToTable("Tournament", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.TrainingGroup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AgeFrom")
                        .HasColumnType("int");

                    b.Property<int>("AgeTo")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("MonthlyPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<string>("Sex")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("SportId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.HasIndex("SportId");

                    b.ToTable("TrainingGroup", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.TrainingSchedule", b =>
                {
                    b.Property<int>("TrainingGroupId")
                        .HasColumnType("int");

                    b.Property<int>("DayOfWeek")
                        .HasColumnType("int");

                    b.Property<TimeOnly>("StartTime")
                        .HasColumnType("time");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<TimeOnly>("EndTime")
                        .HasColumnType("time");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("TrainingGroupId", "DayOfWeek", "StartTime");

                    b.ToTable("TrainingSchedule", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ExternalUserId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ExternalUserSource")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsEmailVerified")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<DateTime>("LastLoginAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("PasswordHash")
                        .HasColumnType("varbinary(max)");

                    b.Property<byte[]>("PasswordSalt")
                        .HasColumnType("varbinary(max)");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("RoleId");

                    b.ToTable("User", (string)null);
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.WorkTime", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("DaysOfWeek")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<TimeOnly>("OpenFrom")
                        .HasColumnType("time");

                    b.Property<TimeOnly>("OpenTo")
                        .HasColumnType("time");

                    b.Property<int>("SportsObjectId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("SportsObjectId");

                    b.ToTable("WorkTime", (string)null);
                });

            modelBuilder.Entity("OrganizationSport", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.Organization", null)
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SportLink.API.Data.Entities.Sport", null)
                        .WithMany()
                        .HasForeignKey("SportId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.OTPCode", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.User", "User")
                        .WithMany("OTPCodes")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Organization", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.User", "Owner")
                        .WithMany("Organizations")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Review", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.Organization", "Organization")
                        .WithMany("Reviews")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SportLink.API.Data.Entities.User", "User")
                        .WithMany("Reviews")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Organization");

                    b.Navigation("User");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.SocialNetwork", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.Organization", "Organization")
                        .WithMany("SocialNetworks")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.SportCourt", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.Sport", "Sport")
                        .WithMany("SportCourts")
                        .HasForeignKey("SportId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SportLink.API.Data.Entities.SportsObject", "SportsObject")
                        .WithMany("SportCourts")
                        .HasForeignKey("SportsObjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Sport");

                    b.Navigation("SportsObject");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.SportsObject", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.Organization", "Organization")
                        .WithMany("SportsObjects")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Tournament", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.Organization", "Organization")
                        .WithMany("Tournaments")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SportLink.API.Data.Entities.Sport", "Sport")
                        .WithMany("Tournaments")
                        .HasForeignKey("SportId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Organization");

                    b.Navigation("Sport");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.TrainingGroup", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.Organization", "Organization")
                        .WithMany("TrainingGroups")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SportLink.API.Data.Entities.Sport", "Sport")
                        .WithMany("TrainingGroups")
                        .HasForeignKey("SportId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Organization");

                    b.Navigation("Sport");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.TrainingSchedule", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.TrainingGroup", "TrainingGroup")
                        .WithMany("TrainingSchedules")
                        .HasForeignKey("TrainingGroupId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("TrainingGroup");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.User", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.WorkTime", b =>
                {
                    b.HasOne("SportLink.API.Data.Entities.SportsObject", "SportsObject")
                        .WithMany("WorkTimes")
                        .HasForeignKey("SportsObjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("SportsObject");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Organization", b =>
                {
                    b.Navigation("Reviews");

                    b.Navigation("SocialNetworks");

                    b.Navigation("SportsObjects");

                    b.Navigation("Tournaments");

                    b.Navigation("TrainingGroups");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Role", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.Sport", b =>
                {
                    b.Navigation("SportCourts");

                    b.Navigation("Tournaments");

                    b.Navigation("TrainingGroups");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.SportsObject", b =>
                {
                    b.Navigation("SportCourts");

                    b.Navigation("WorkTimes");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.TrainingGroup", b =>
                {
                    b.Navigation("TrainingSchedules");
                });

            modelBuilder.Entity("SportLink.API.Data.Entities.User", b =>
                {
                    b.Navigation("OTPCodes");

                    b.Navigation("Organizations");

                    b.Navigation("Reviews");
                });
#pragma warning restore 612, 618
        }
    }
}
