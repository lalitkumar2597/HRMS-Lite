from bson import ObjectId
from datetime import datetime
from app.database import db
from app.models import EmployeeModel, AttendanceModel
from app.schemas import EmployeeCreate, AttendanceCreate

class EmployeeCRUD:
    @staticmethod
    async def create_employee(employee: EmployeeCreate):
        employee_dict = employee.dict()
        employee_dict["created_at"] = datetime.utcnow()
        
        result = await db.db.employees.insert_one(employee_dict)
        new_employee = await db.db.employees.find_one({"_id": result.inserted_id})
        return EmployeeModel(**new_employee)

    @staticmethod
    async def get_all_employees():
        employees = []
        async for employee in db.db.employees.find().sort("created_at", -1):
            employees.append(EmployeeModel(**employee))
        return employees

    @staticmethod
    async def get_employee_by_id(employee_id: str):
        employee = await db.db.employees.find_one({"employee_id": employee_id})
        if employee:
            return EmployeeModel(**employee)
        return None

    @staticmethod
    async def get_employee_by_email(email: str):
        employee = await db.db.employees.find_one({"email": email})
        if employee:
            return EmployeeModel(**employee)
        return None

    @staticmethod
    async def delete_employee(employee_id: str):
        # Delete employee and their attendance records
        result = await db.db.employees.delete_one({"employee_id": employee_id})
        if result.deleted_count > 0:
            # Also delete all attendance records for this employee
            await db.db.attendance.delete_many({"employee_id": employee_id})
        return result.deleted_count > 0

class AttendanceCRUD:
    @staticmethod
    async def create_attendance(attendance: AttendanceCreate):
        attendance_dict = {
            "employee_id": attendance.employee_id,
            "date": attendance.date,
            "status": attendance.status,
            "created_at": datetime.utcnow()
        }
        
        try:
            result = await db.db.attendance.insert_one(attendance_dict)
            new_attendance = await db.db.attendance.find_one({"_id": result.inserted_id})
            return AttendanceModel(**new_attendance)
        except Exception as e:
            logger.error(f"Error in create_attendance: {str(e)}")
            raise e

    @staticmethod
    async def get_attendance_by_employee(employee_id: str):
        attendance_records = []
        async for record in db.db.attendance.find({"employee_id": employee_id}).sort("date", -1):
            attendance_records.append(AttendanceModel(**record))
        return attendance_records

    @staticmethod
    async def get_all_attendance():
        attendance_records = []
        async for record in db.db.attendance.find().sort("date", -1):
            attendance_records.append(AttendanceModel(**record))
        return attendance_records

    @staticmethod
    async def update_attendance(attendance_id: str, status: str):
        result = await db.db.attendance.update_one(
            {"_id": ObjectId(attendance_id)},
            {"$set": {"status": status}}
        )
        return result.modified_count > 0

    @staticmethod
    async def get_attendance_summary(employee_id: str = None):
        pipeline = []
        
        if employee_id:
            pipeline.append({"$match": {"employee_id": employee_id}})
        
        pipeline.extend([
            {
                "$group": {
                    "_id": "$employee_id",
                    "total_present": {
                        "$sum": {"$cond": [{"$eq": ["$status", "Present"]}, 1, 0]}
                    },
                    "total_absent": {
                        "$sum": {"$cond": [{"$eq": ["$status", "Absent"]}, 1, 0]}
                    },
                    "total_records": {"$sum": 1}
                }
            },
            {
                "$lookup": {
                    "from": "employees",
                    "localField": "_id",
                    "foreignField": "employee_id",
                    "as": "employee"
                }
            },
            {"$unwind": "$employee"},
            {
                "$project": {
                    "employee_id": "$_id",
                    "full_name": "$employee.full_name",
                    "total_present": 1,
                    "total_absent": 1,
                    "attendance_percentage": {
                        "$multiply": [
                            {"$divide": ["$total_present", "$total_records"]},
                            100
                        ]
                    }
                }
            }
        ])
        
        results = []
        async for result in db.db.attendance.aggregate(pipeline):
            results.append(result)
        
        return results
    @staticmethod
    async def get_all_attendance():
        attendance_records = []
        async for record in db.db.attendance.find().sort("date", -1):
            attendance_records.append(AttendanceModel(**record))
        return attendance_records