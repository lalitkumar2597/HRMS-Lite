from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class EmployeeModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    employee_id: str = Field(..., unique=True)
    full_name: str = Field(...)
    email: str = Field(...)
    department: str = Field(...)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "full_name": "John Doe",
                "email": "john.doe@company.com",
                "department": "Engineering"
            }
        }

class AttendanceModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    employee_id: str = Field(...)
    date: str = Field(...)  # Format: YYYY-MM-DD
    status: str = Field(..., regex="^(Present|Absent)$")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "date": "2024-01-15",
                "status": "Present"
            }
        }