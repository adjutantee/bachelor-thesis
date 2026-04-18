using Ballista.Application.Data;
using Ballista.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Ballista.Application.Services
{
    public class IdentityInitializer
    {
        public static void Initialize(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
        {
            var adminEmail = "admin@gmail.com";
            var adminPassword = "_Admin1";
            var adminName = "Админ";
            var adminLastName = "Админ";

            if (roleManager.FindByNameAsync(Constants.AdminRoleName).Result == null)
            {
                roleManager.CreateAsync(new IdentityRole<Guid>(Constants.AdminRoleName)).Wait();
            }
            if (roleManager.FindByNameAsync(Constants.UserRoleName).Result == null)
            {
                roleManager.CreateAsync(new IdentityRole<Guid>(Constants.UserRoleName)).Wait();
            }
            if (userManager.FindByNameAsync(adminEmail).Result == null)
            {
                var admin = new User
                {
                    Email = adminEmail,
                    UserName = adminEmail,
                    FirstName = adminName,
                    LastName = adminLastName
                };

                var result = userManager.CreateAsync(admin, adminPassword).Result;

                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(admin, Constants.AdminRoleName).Wait();
                }
            }
        }
    }
}
