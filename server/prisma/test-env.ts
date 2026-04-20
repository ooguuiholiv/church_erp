import 'dotenv/config';
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL value starts with:", process.env.DATABASE_URL?.substring(0, 10));
