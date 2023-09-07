import client from "../config/db.js";
import { QueryResultRow } from "pg";

export class User {
  static async findExistingUser(username: string, email: string): Promise<QueryResultRow> {
    let user: QueryResultRow;
    if (username) {
      user = await client.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
      );
    } else {
      user = await client.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );
    }
    return user.rows[0];
  }
  
  static async doesEmailAlreadyExists(email: string): Promise<boolean> {
    const existingEmail = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return existingEmail.rowCount > 0 ? true : false;
  }

  static async doesUserAlreadyExists(
    username: string
  ): Promise<boolean> {
    const existingUser = await client.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    return existingUser.rowCount > 0 ? true : false;
  }

  static async registerNewUser(
    user_type: string,
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string
  ): Promise<QueryResultRow> {
    const query = `
      INSERT INTO users (user_type, first_name, last_name, username, email, password) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const user = await client.query(query, [user_type, first_name, last_name, username, email, password]);
    return user.rows[0];
  }

  static async getUserById(id: number): Promise<QueryResultRow> {
    const query = `SELECT * FROM users WHERE user_id = $1`;
    const user = await client.query(query, [id]);
    return user.rows[0];
  }
  
  static async updateCreator(id: number, created_by: number): Promise<void> {
    const query = `UPDATE users SET created_by = $2 WHERE user_id = $1`;
    await client.query(query, [id, created_by]);
  }
  
  static async updatePassword(userId: number, newPassword: string): Promise<void> {
    const query = `UPDATE users SET password = $2 WHERE user_id = $1`;
    await client.query(query, [userId, newPassword]);
  }
  
  static async updateEmailVerificationStatus(email: string): Promise<void> {
    await client.query(
      `UPDATE users SET email_verified = true WHERE email = $1`, 
    [email]);
  }
}
