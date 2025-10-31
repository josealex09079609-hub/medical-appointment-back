import mysql from 'mysql2/promise';
import { Appointment } from '../../domain/entities/Appointment';

export class MySQLRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
      waitForConnections: true,
      connectionLimit: 5
    });
  }

  async insertAppointment(appointment: Appointment): Promise<void> {
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
