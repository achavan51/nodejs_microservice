import { Pool, Client } from "pg";
const connectionString = process.env.POSTGRES_URI;

// console.log("POSTGRES_UR ", connectionString)

const pool = new Pool({
  connectionString,
});
pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res.rows);
});
//   // const client = new Client({
//   //   connectionString,
//   // });
//   // client.connect();
//   // client.query("SELECT NOW()", (err, res) => {
//   //   console.log(err, res);
//   //   client.end();
//   // });

//   console.log("Connected to Postgres");
// } catch (err) {
//   console.error(err);
// }

export { pool };
