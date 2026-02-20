from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List
from datetime import datetime

class EmployeeBase(BaseModel):
    employee_id: str = Field(..., min_length=3, max_length=20)
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=2, max_length=50)

class EmployeeCreate(EmployeeBase):
    @validator('employee_id')
    def validate_employee_id(cls, v):
        if not v.isalnum():
            raise ValueError('Employee ID must be alphanumeric')
        return v.upper()

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    department: Optional[str] = Field(None, min_length=2, max_length=50)

class EmployeeResponse(EmployeeBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    employee_id: str
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    status: str = Field(..., pattern=r"^(Present|Absent)$")

class AttendanceCreate(AttendanceBase):
    @validator('date')
    def validate_date(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')

class AttendanceUpdate(BaseModel):
   status: str = Field(..., pattern=r"^(Present|Absent)$")

class AttendanceResponse(AttendanceBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class EmployeeAttendanceSummary(BaseModel):
    employee_id: str
    full_name: str
    total_present: int
    total_absent: int
    attendance_percentage: float