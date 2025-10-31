"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLRepository = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
class MySQLRepository {
    constructor() {
        this.pool = promise_1.default.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DB,
            waitForConnections: true,
            connectionLimit: 5
        });
    }
    async insertAppointment(appointment) {
        const sql = `INSERT INTO appointments (appointment_id, insured_id, schedule_id, country_iso, status, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)`;
        await this.pool.execute(sql, [
            appointment.appointmentId,
            appointment.insuredId,
            appointment.scheduleId,
            appointment.countryISO,
            appointment.status,
            appointment.createdAt
        ]);
    }
}
exports.MySQLRepository = MySQLRepository;
