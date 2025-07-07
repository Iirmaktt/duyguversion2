import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '2521326992',
  database: 'mychatapp',
  connectionLimit: 5
});

// Veritabanı bağlantısını test et
(async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("✅ Veritabanına başarıyla bağlanıldı!");
  } catch (err) {
    console.error("❌ Veritabanı bağlantı hatası:", err);
  } finally {
    if (conn) conn.release();
  }
})();

export default pool;
