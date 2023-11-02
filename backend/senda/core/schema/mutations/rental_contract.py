import graphene
from senda.core.models.rental_contracts import RentalContractModel, RentalContractStatusChoices,RentalContractHistoryModel
from senda.core.models import ClientModel, OfficeModel, LocalityModel
from senda.core.schema.types import RentalContract

from django.core.exceptions import ValidationError, ObjectDoesNotExist
from utils.graphene import input_object_type_to_dict, non_null_list_of
from typing import List


class ErrorMessages:
    INVALID_OFFICE = "Debes especificar una sucursal"
    OFFICE_NOT_FOUND = "La sucursal no existe"
    INVALID_CLIENT = "Debes especificar un cliente"
    CLIENT_NOT_FOUND = "El cliente no existe"
    INVALID_PRODUCT = "No se ingreso ningun producto"
    LOCALITY_NOT_FOUND = "La localidad no existe"
    INVALID_LOCALITY = "No se ingreso ninguna localidad"


class RentalContractProductsItemInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    quantity = graphene.Int(required=True)
    service = graphene.String(Required=False)

class CreateRentalContractInput(graphene.InputObjectType):
    office_id = graphene.ID(required=True)
    client_id = graphene.ID(required=True)
    locality_id = graphene.ID(required=True)
    house_number = graphene.String(required=True)
    street_number = graphene.String(required=True)
    house_unit = graphene.String(required=True)
    contract_start_datetime = graphene.DateTime(required=True)
    contract_end_datetime = graphene.DateTime(required=True)
    products = non_null_list_of(RentalContractProductsItemInput)


def get_office(office_id: str):
    if office_id:
        try:
            return OfficeModel.objects.get(id=office_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.OFFICE_NOT_FOUND)
    else:
        return None


def get_client(client_id: str):
    if client_id:
        try:
            return ClientModel.objects.get(id=client_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.CLIENT_NOT_FOUND)
    else:
        return None
    
def get_locality(locality_id: str):
    if locality_id:
        try:
            return LocalityModel.objects.get(id=locality_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.LOCALITY_NOT_FOUND)
    else:
        return None



class CreateRentalContract(graphene.Mutation):
    rental_contract = graphene.Field(RentalContractModel)
    error = graphene.String()

    class Arguments:
        data = CreateRentalContractInput(required=True)

    def mutate(self, info, data: CreateRentalContractInput):
        data_dict = input_object_type_to_dict(data)

        try:
            office_id = data_dict.pop("office_id")
            office = get_office(office_id)
            if office is None:
                raise ValueError(ErrorMessages.INVALID_OFFICE)

            client_id = data_dict.pop("client_id")
            client = get_client(client_id)
            if client is None:
                raise ValueError(ErrorMessages.INVALID_CLIENT)
            
            locality_id = data_dict.pop("locality_id")
            locality = get_locality(locality_id)
            if locality is None:
                raise ValueError(ErrorMessages.INVALID_LOCALITY)

            rental_contract = RentalContractModel.objects.create_rental_contract(
                rental_contract=rental_contract,
                office=office,
                client=client,
                locality=locality,
                **data_dict,
            )
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateRentalContract(error=str(e))
        except Exception as e:
            return CreateRentalContract(error="Error desconocido")

        return CreateRentalContract(rental_contract=rental_contract)


class Mutation(graphene.ObjectType):
    CreateRentalContract = CreateRentalContract.Field()

class BaseChangeContractStatus(graphene.Mutation):
    rental_contract = graphene.Field(RentalContract)
    error = graphene.String()
    
    class Arguments:
        rental_contract_id = graphene.ID(required=True)

    @classmethod
    def get_contract(cls, id: str):
        rental_contract = RentalContractModel.objects.filter(id=id).first()
        
        if rental_contract is None:
            raise Exception("No existe contrato con ese ID")
        
        return rental_contract

    @classmethod
    def check_contract_status_is_one_of_and_update_status(cls, contract: RentalContractModel, status: List[RentalContractStatusChoices], new_status: RentalContractStatusChoices):
        if contract.current_history.status not in status:
            raise Exception("El contrato no esta en un estado valido")
        
        RentalContractHistoryModel.objects.create(
            rental_contract=contract,
            status=new_status
        )


class PayContractDeposit(BaseChangeContractStatus):
    @classmethod
    def mutate(cls, self, info, rental_contract_id: str):
        try:
            contract = cls.get_contract(rental_contract_id)
            cls.check_contract_status_is_one_of_and_update_status(contract, [
                RentalContractStatusChoices.PRESUPUESTADO
            ], RentalContractStatusChoices.CON_DEPOSITO)

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))

class PayTotalContract(BaseChangeContractStatus):
    @classmethod
    def mutate(cls, self, info, rental_contract_id: str):
        try:
            contract = cls.get_contract(rental_contract_id)
            cls.check_contract_status_is_one_of_and_update_status(contract, [
                RentalContractStatusChoices.CON_DEPOSITO
            ], RentalContractStatusChoices.PAGADO)

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))
        
class CancelContract(BaseChangeContractStatus):
    @classmethod
    def mutate(cls, self, info, rental_contract_id: str):
        try:
            contract = cls.get_contract(rental_contract_id)
            cls.check_contract_status_is_one_of_and_update_status(contract, [
                RentalContractStatusChoices.CON_DEPOSITO, RentalContractStatusChoices.PAGADO
            ], RentalContractStatusChoices.CANCELADO)

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))

class StartContract(BaseChangeContractStatus):
    @classmethod
    def mutate(cls, self, info, rental_contract_id: str):
        try:
            contract = cls.get_contract(rental_contract_id)
            cls.check_contract_status_is_one_of_and_update_status(contract, [
                RentalContractStatusChoices.PAGADO
            ], RentalContractStatusChoices.ACTIVO)

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))

class ExpiredContract(BaseChangeContractStatus):
    @classmethod
    def mutate(cls, self, info, rental_contract_id: str):
        try:
            contract = cls.get_contract(rental_contract_id)
            cls.check_contract_status_is_one_of_and_update_status(contract, [
                RentalContractStatusChoices.CON_DEPOSITO, RentalContractStatusChoices.PRESUPUESTADO
            ], RentalContractStatusChoices.VENCIDO)

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))

class FinishContract(BaseChangeContractStatus):
    @classmethod
    def mutate(cls, self, info, rental_contract_id: str):
        try:
            contract = cls.get_contract(rental_contract_id)
            cls.check_contract_status_is_one_of_and_update_status(contract, [
                RentalContractStatusChoices.ACTIVO
            ], RentalContractStatusChoices.FINALIZADO)

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))

class FailedReturnContract(BaseChangeContractStatus):
    @classmethod
    def mutate(cls, self, info, rental_contract_id: str):
        try:
            contract = cls.get_contract(rental_contract_id)
            cls.check_contract_status_is_one_of_and_update_status(contract, [
                RentalContractStatusChoices.FINALIZADO
            ], RentalContractStatusChoices.DEVOLUCION_FALLIDA)

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))

class SuccessfulReturnContract(BaseChangeContractStatus):
    @classmethod
    def mutate(cls, self, info, rental_contract_id: str):
        try:
            contract = cls.get_contract(rental_contract_id)
            cls.check_contract_status_is_one_of_and_update_status(contract, [
                RentalContractStatusChoices.FINALIZADO
            ], RentalContractStatusChoices.DEVOLUCION_EXITOSA)

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))