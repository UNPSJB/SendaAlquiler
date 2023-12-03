from typing import Any, List

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.clients import ClientModel, LocalityModel
from senda.core.models.offices import OfficeModel
from senda.core.models.rental_contracts import (
    RentalContractHistoryModel,
    RentalContractModel,
    RentalContractStatusChoices,
)
from senda.core.schema.custom_types import RentalContract
from utils.graphene import input_object_type_to_dict, non_null_list_of

from senda.core.decorators import employee_required, CustomInfo


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
    street_name = graphene.String(required=True)
    house_unit = graphene.String(required=False)
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
    rental_contract = graphene.Field(RentalContract)
    error = graphene.String()

    class Arguments:
        data = CreateRentalContractInput(required=True)

    def mutate(
        self, info: CustomInfo, data: CreateRentalContractInput
    ) -> "CreateRentalContract":
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


class BaseChangeContractStatus(graphene.Mutation):
    rental_contract = graphene.Field(RentalContract)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)

    @classmethod
    def get_contract(cls, id: str) -> RentalContractModel:
        rental_contract = RentalContractModel.objects.filter(id=id).first()

        if rental_contract is None:
            raise Exception("No existe contrato con ese ID")

        return rental_contract

    @classmethod
    def check_contract_status_is_one_of_and_update_status(
        cls,
        contract: RentalContractModel,
        status: List[RentalContractStatusChoices],
        new_status: RentalContractStatusChoices,
    ) -> None:
        if (
            not contract.current_history
            or contract.current_history.status not in status
        ):
            raise Exception("El contrato no esta en un estado valido")

        RentalContractHistoryModel.objects.create(
            rental_contract=contract, status=new_status
        )

    @classmethod
    def mutate(cls, self: "BaseChangeContractStatus", info: Any, id: str):
        raise NotImplementedError()


class PayContractDeposit(BaseChangeContractStatus):
    @classmethod
    def mutate(
        cls, self: "PayContractDeposit", info: Any, id: str
    ) -> BaseChangeContractStatus:
        try:
            contract = cls.get_contract(id)
            cls.check_contract_status_is_one_of_and_update_status(
                contract,
                [RentalContractStatusChoices.PRESUPUESTADO],
                RentalContractStatusChoices.CON_DEPOSITO,
            )

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))


class PayTotalContract(BaseChangeContractStatus):
    @classmethod
    def mutate(
        cls, self: "PayTotalContract", info: Any, id: str
    ) -> BaseChangeContractStatus:
        try:
            contract = cls.get_contract(id)
            cls.check_contract_status_is_one_of_and_update_status(
                contract,
                [RentalContractStatusChoices.CON_DEPOSITO],
                RentalContractStatusChoices.PAGADO,
            )

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))


class CancelContract(BaseChangeContractStatus):
    @classmethod
    def mutate(
        cls, self: "CancelContract", info: Any, id: str
    ) -> BaseChangeContractStatus:
        try:
            contract = cls.get_contract(id)
            cls.check_contract_status_is_one_of_and_update_status(
                contract,
                [
                    RentalContractStatusChoices.CON_DEPOSITO,
                    RentalContractStatusChoices.PAGADO,
                ],
                RentalContractStatusChoices.CANCELADO,
            )

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))


class StartContract(BaseChangeContractStatus):
    @classmethod
    def mutate(
        cls, self: "StartContract", info: Any, id: str
    ) -> BaseChangeContractStatus:
        try:
            contract = cls.get_contract(id)
            cls.check_contract_status_is_one_of_and_update_status(
                contract,
                [RentalContractStatusChoices.PAGADO],
                RentalContractStatusChoices.ACTIVO,
            )

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))


class ExpiredContract(BaseChangeContractStatus):
    @classmethod
    def mutate(
        cls, self: "ExpiredContract", info: Any, id: str
    ) -> BaseChangeContractStatus:
        try:
            contract = cls.get_contract(id)
            cls.check_contract_status_is_one_of_and_update_status(
                contract,
                [
                    RentalContractStatusChoices.CON_DEPOSITO,
                    RentalContractStatusChoices.PRESUPUESTADO,
                ],
                RentalContractStatusChoices.VENCIDO,
            )

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))


class FinishContract(BaseChangeContractStatus):
    @classmethod
    def mutate(
        cls, self: "FinishContract", info: Any, id: str
    ) -> BaseChangeContractStatus:
        try:
            contract = cls.get_contract(id)
            cls.check_contract_status_is_one_of_and_update_status(
                contract,
                [RentalContractStatusChoices.ACTIVO],
                RentalContractStatusChoices.FINALIZADO,
            )

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))


class FailedReturnContract(BaseChangeContractStatus):
    @classmethod
    def mutate(
        cls, self: "FailedReturnContract", info: Any, id: str
    ) -> BaseChangeContractStatus:
        try:
            contract = cls.get_contract(id)
            cls.check_contract_status_is_one_of_and_update_status(
                contract,
                [RentalContractStatusChoices.FINALIZADO],
                RentalContractStatusChoices.DEVOLUCION_FALLIDA,
            )

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))


class SuccessfulReturnContract(BaseChangeContractStatus):
    @classmethod
    def mutate(
        cls, self: "SuccessfulReturnContract", info: Any, id: str
    ) -> BaseChangeContractStatus:
        try:
            contract = cls.get_contract(id)
            cls.check_contract_status_is_one_of_and_update_status(
                contract,
                [RentalContractStatusChoices.FINALIZADO],
                RentalContractStatusChoices.DEVOLUCION_EXITOSA,
            )

            return BaseChangeContractStatus(rental_contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))


class DeleteRentalContract(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            rental_contract = RentalContractModel.objects.get(id=id)
            rental_contract.delete()
        except ObjectDoesNotExist:
            return DeleteRentalContract(success=False)

        return DeleteRentalContract(success=True)


class Mutation(graphene.ObjectType):
    create_rental_contract = CreateRentalContract.Field()
    pay_contract_deposit = PayContractDeposit.Field()
    pay_total_contract = PayTotalContract.Field()
    cancel_contract = CancelContract.Field()
    start_contract = StartContract.Field()
    expired_contract = ExpiredContract.Field()
    finish_contract = FinishContract.Field()
    failed_return_contract = FailedReturnContract.Field()
    successful_return_contract = SuccessfulReturnContract.Field()

    delete_rental_contract = DeleteRentalContract.Field()
