import { Role } from "../models/role";
import { ROLE_PERMISSIONS, UserRole } from "./rbacConfig";

export const seedRoles = async () => {
  try {
    for (const role of Object.values(UserRole)) {
      await Role.findOneAndUpdate(
        { name: role }, // find by name
        { name: role, permissions: ROLE_PERMISSIONS[role] }, // update permissions
        { upsert: true, new: true }, // create if not exists
      );
    }
    console.log("✓ Roles seeded successfully");
  } catch (err) {
    console.error("Roles seeding failed:", err);
  }
};
