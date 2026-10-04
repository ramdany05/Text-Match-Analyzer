import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";

export async function seedDemoUser() {
  console.log("Seeding demo user...");
  const userRepository = AppDataSource.getRepository(User);

  const username = "tester";
  const passwordPlain = "inipasswordnya";

  // Cek apakah user sudah ada
  const existingUser = await userRepository.findOneBy({ username });
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(passwordPlain, 10);
    const user = userRepository.create({
      username,
      password: hashedPassword,
    });
    
    await userRepository.save(user);
    console.log(`Demo user created: username="${username}", password="${passwordPlain}"`);
  } else {
    // Pastikan password terupdate jika ada perubahan
    const hashedPassword = await bcrypt.hash(passwordPlain, 10);
    existingUser.password = hashedPassword;
    await userRepository.save(existingUser);
    console.log("Demo user updated with latest credentials.");
  }
}
