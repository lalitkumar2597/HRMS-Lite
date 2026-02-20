from fastapi import APIRouter, HTTPException, status
from app.schemas import EmployeeCreate, EmployeeResponse
from app.crud import EmployeeCRUD
from typing import List

router = APIRouter(prefix="/employees", tags=["employees"])

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    # Check if employee ID already exists
    existing_employee = await EmployeeCRUD.get_employee_by_id(employee.employee_id)
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with ID {employee.employee_id} already exists"
        )
    
    # Check if email already exists
    existing_email = await EmployeeCRUD.get_employee_by_email(employee.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with email {employee.email} already exists"
        )
    
    try:
        new_employee = await EmployeeCRUD.create_employee(employee)
        return EmployeeResponse(
            id=str(new_employee.id),
            employee_id=new_employee.employee_id,
            full_name=new_employee.full_name,
            email=new_employee.email,
            department=new_employee.department,
            created_at=new_employee.created_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating employee: {str(e)}"
        )

@router.get("/", response_model=List[EmployeeResponse])
async def get_all_employees():
    try:
        employees = await EmployeeCRUD.get_all_employees()
        return [
            EmployeeResponse(
                id=str(emp.id),
                employee_id=emp.employee_id,
                full_name=emp.full_name,
                email=emp.email,
                department=emp.department,
                created_at=emp.created_at
            )
            for emp in employees
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching employees: {str(e)}"
        )

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    deleted = await EmployeeCRUD.delete_employee(employee_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    return None