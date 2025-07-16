/*import type { Request, Response } from "express";
import { knex } from "../db/knex"; 

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
console.log("POST /register İstek:", { name, email, password });
  try {
    await knex("users").insert({ name, email, password });
    res.status(201).json({ message: "Kayıt başarılı!" });
  } catch (err) {
    console.error("POST /register HATASI:", err);
    res.status(500).json({ error: "Kayıt başarısız." });
  }
};
*/
import type { Request, Response } from "express";
import axios from "axios";

// Ortak ayarlar
const KEYCLOAK_URL = "http://localhost:8080";
const REALM = "Duygu";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // 1️⃣ Admin token al
    const tokenRes = await axios.post(
      `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: "password",
        client_id: "admin-cli",
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const adminToken = tokenRes.data.access_token;
    console.log("Keycloak: Admin token alındı", adminToken);
    // 2️⃣ Kullanıcı oluştur
    await axios.post(
      `${KEYCLOAK_URL}/admin/realms/${REALM}/users`,
      {
        username: username,
        email: email,
        enabled: true,
        credentials: [
          {
            type: "password",
            value: password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Keycloak: Kullanıcı oluşturuldu:", username);
    res.status(201).json({ message: "Kayıt başarılı! Keycloak'a gönderildi." });
  } catch (error) {
    console.error("Keycloak register error:", (error as any).response?.data || (error as any).message);
    res.status(500).json({ error: "Kayıt başarısız." });
  }
};
