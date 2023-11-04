import graphene

from senda.core.models.employees import EmployeeModel
from senda.core.schema.types import Employee
from utils.graphene import non_null_list_of

class Query(graphene.ObjectType):
    employees = non_null_list_of(Employee)

    def resolve_employees(self, info):
        return EmployeeModel.objects.all()
    
    employee_by_id = graphene.Field(Employee, id=graphene.ID(required=True))

    def resolve_employee_by_id(self, info, id: str):
        return EmployeeModel.objects.filter(id=id).first()