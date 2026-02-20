from fastapi import APIRouter, HTTPException, status
from app.schemas import AttendanceCreate, AttendanceResponse, EmployeeAttendanceSummary
from app.crud import AttendanceCRUD, EmployeeCRUD
from typing import List

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: AttendanceCreate):
    # Check if employee exists
    employee = await EmployeeCRUD.get_employee_by_id(attendance.employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {attendance.employee_id} not found"
        )
    
    try:
        new_attendance = await AttendanceCRUD.create_attendance(attendance)
        return AttendanceResponse(
            id=str(new_attendance.id),
            employee_id=new_attendance.employee_id,
            date=new_attendance.date,
            status=new_attendance.status,
            created_at=new_attendance.created_at
        )
    except Exception as e:
        if "duplicate key" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Attendance for employee {attendance.employee_id} on {attendance.date} already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error marking attendance: {str(e)}"
        )

@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
async def get_employee_attendance(employee_id: str):
    # Check if employee exists
    employee = await EmployeeCRUD.get_employee_by_id(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    try:
        attendance_records = await AttendanceCRUD.get_attendance_by_employee(employee_id)
        return [
            AttendanceResponse(
                id=str(record.id),
                employee_id=record.employee_id,
                date=record.date,
                status=record.status,
                created_at=record.created_at
            )
            for record in attendance_records
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching attendance: {str(e)}"
        )

@router.get("/summary", response_model=List[EmployeeAttendanceSummary])
async def get_attendance_summary(employee_id: str = None):
    try:
        summaries = await AttendanceCRUD.get_attendance_summary(employee_id)
        return summaries
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating attendance summary: {str(e)}"
        )

@router.get("/filter")
async def filter_attendance_by_date(start_date: str, end_date: str):
    try:
        # This is a simple filter - you might want to enhance this
        all_attendance = await AttendanceCRUD.get_all_attendance()
        filtered = [
            record for record in all_attendance
            if start_date <= record.date <= end_date
        ]
        return filtered
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error filtering attendance: {str(e)}"
        )

@router.get("/all", response_model=List[AttendanceResponse])
async def get_all_attendance():
    try:
        attendance_records = await AttendanceCRUD.get_all_attendance()
        return [
            AttendanceResponse(
                id=str(record.id),
                employee_id=record.employee_id,
                date=record.date,
                status=record.status,
                created_at=record.created_at
            )
            for record in attendance_records
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching attendance: {str(e)}"
        )    