import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";

export async function seedDemoUser() {
  console.log("Seeding demo user...");
  const userRepository = AppDataSource.getRepository(User);

  const username = "penguji";
  const passwordPlain = "password123";

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
    console.log("Demo user already exists, skipping seed.");
  }
}
