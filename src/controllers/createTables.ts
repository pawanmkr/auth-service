import { User } from "../models/user.model.js";

export class Tables {
  static async createTables() {
    try {
      await User.createUserTable();
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create tables");
    }
  }
}
