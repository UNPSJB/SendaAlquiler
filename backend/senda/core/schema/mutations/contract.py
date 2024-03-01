from typing import Any, List

import graphene
from django.core.exceptions import ObjectDoesNotExist

from senda.core.models.contract import (
    ContractHistory,
    Contract,
    ContractStatusChoices,
    ContractDetailsDict,
    ContractItemDetailsDict,
    ContractItemProductAllocationDetailsDict,
    ContractItemServiceDetailsDict,
    ContractCreationError,
)
from senda.core.decorators import employee_or_admin_required, CustomInfo
from senda.core.schema.custom_types import ContractType

from senda.core.decorators import CustomInfo
from utils.graphene import non_null_list_of


class ErrorMessages:
    INVALID_OFFICE = "Debes especificar una sucursal"
    OFFICE_NOT_FOUND = "La sucursal no existe"
    INVALID_CLIENT = "Debes especificar un cliente"
    CLIENT_NOT_FOUND = "El cliente no existe"
    INVALID_PRODUCT = "No se ingreso ningun producto"
    LOCALITY_NOT_FOUND = "La localidad no existe"
    INVALID_LOCALITY = "No se ingreso ninguna localidad"


class ContractItemProductAllocationInput(graphene.InputObjectType):
    office_id = graphene.ID(required=True)
    quantity = graphene.Int(required=True)
    shipping_cost = graphene.Int()
    shipping_discount = graphene.Int()


class ContractItemServiceItemInput(graphene.InputObjectType):
    service_id = graphene.ID(required=True)
    discount = graphene.Int()


class ContractItemInput(graphene.InputObjectType):
    product_id = graphene.ID(required=True)
    allocations = graphene.List(ContractItemProductAllocationInput, required=True)
    product_discount = graphene.Int()
    service_items = graphene.List(ContractItemServiceItemInput)


class ContractInput(graphene.InputObjectType):
    client_id = graphene.ID(required=True)
    contract_start = graphene.DateTime(required=True)
    contract_end = graphene.DateTime(required=True)
    locality_id = graphene.ID(required=True)
    house_number = graphene.String(required=True)
    street_name = graphene.String(required=True)
    house_unit = graphene.String(required=False)
    expiration_date = graphene.DateTime(required=True)


class CreateContract(graphene.Mutation):
    class Arguments:
        contract_data = ContractInput(required=True)
        items_data = non_null_list_of(ContractItemInput)

    ok = graphene.Boolean()
    contract_id = graphene.ID()
    error = graphene.String()

    @employee_or_admin_required
    def mutate(
        self,
        info: CustomInfo,
        contract_data: ContractInput,
        items_data: List[ContractItemInput],
    ):
        office_id = info.context.office_id
        user = info.context.user

        items_data_dicts: List[ContractItemDetailsDict] = []
        for item in items_data:
            allocation_data_dicts: List[ContractItemProductAllocationDetailsDict] = []
            service_data_dics: List[ContractItemServiceDetailsDict] = []

            allocations: List[ContractItemProductAllocationInput] = item.allocations
            for allocation in allocations:
                allocation_data_dicts.append(
                    ContractItemProductAllocationDetailsDict(
                        office_id=allocation.office_id,
                        quantity=allocation.quantity,
                        shipping_cost=allocation.shipping_cost,
                        shipping_discount=allocation.shipping_discount,
                    )
                )

            services: List[ContractItemServiceItemInput] = item.service_items
            for service in services:
                service_data_dics.append(
                    ContractItemServiceDetailsDict(
                        service_id=service.service_id,
                        service_discount=service.discount,
                    )
                )

            items_data_dicts.append(
                ContractItemDetailsDict(
                    product_id=item.product_id,
                    allocations=allocation_data_dicts,
                    product_discount=item.product_discount,
                    services=service_data_dics,
                )
            )

        try:
            contract = Contract.objects.create_contract(
                created_by_user_id=int(user.pk),
                contract_data=ContractDetailsDict(
                    client_id=contract_data.client_id,
                    office_id=int(office_id),
                    contract_start=contract_data.contract_start,
                    contract_end=contract_data.contract_end,
                    locality_id=contract_data.locality_id,
                    house_number=contract_data.house_number,
                    street_name=contract_data.street_name,
                    house_unit=contract_data.house_unit,
                    expiration_date=contract_data.expiration_date,
                ),
                items_data=items_data_dicts,
            )
            return CreateContract(ok=True, contract_id=contract.id)
        except ContractCreationError as e:
            return CreateContract(ok=False, error=str(e))


class BaseChangeContractStatus(graphene.Mutation):
    contract = graphene.Field(ContractType)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)

    @classmethod
    def get_contract(cls, id: str) -> Contract:
        contract = Contract.objects.filter(id=id).first()

        if contract is None:
            raise Exception("No existe contrato con ese ID")

        return contract

    @classmethod
    def check_contract_status_is_one_of_and_update_status(
        cls,
        contract: Contract,
        status: List[ContractStatusChoices],
        new_status: ContractStatusChoices,
    ) -> None:
        if (
            not contract.latest_history_entry
            or contract.latest_history_entry.status not in status
        ):
            raise Exception("El contrato no esta en un estado valido")

        ContractHistory.objects.create(contract=contract, status=new_status)

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
                [ContractStatusChoices.PRESUPUESTADO],
                ContractStatusChoices.CON_DEPOSITO,
            )

            return BaseChangeContractStatus(contract=contract)
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
                [ContractStatusChoices.CON_DEPOSITO],
                ContractStatusChoices.PAGADO,
            )

            return BaseChangeContractStatus(contract=contract)
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
                    ContractStatusChoices.CON_DEPOSITO,
                    ContractStatusChoices.PAGADO,
                ],
                ContractStatusChoices.CANCELADO,
            )

            return BaseChangeContractStatus(contract=contract)
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
                [ContractStatusChoices.PAGADO],
                ContractStatusChoices.ACTIVO,
            )

            return BaseChangeContractStatus(contract=contract)
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
                    ContractStatusChoices.CON_DEPOSITO,
                    ContractStatusChoices.PRESUPUESTADO,
                ],
                ContractStatusChoices.VENCIDO,
            )

            return BaseChangeContractStatus(contract=contract)
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
                [ContractStatusChoices.ACTIVO],
                ContractStatusChoices.FINALIZADO,
            )

            return BaseChangeContractStatus(contract=contract)
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
                [ContractStatusChoices.FINALIZADO],
                ContractStatusChoices.DEVOLUCION_FALLIDA,
            )

            return BaseChangeContractStatus(contract=contract)
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
                [ContractStatusChoices.FINALIZADO],
                ContractStatusChoices.DEVOLUCION_EXITOSA,
            )

            return BaseChangeContractStatus(contract=contract)
        except Exception as e:
            return BaseChangeContractStatus(error=str(e))


class DeleteContract(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info: CustomInfo, id: str):
        try:
            contract = Contract.objects.get(id=id)
            contract.delete()
        except ObjectDoesNotExist:
            return DeleteContract(success=False)

        return DeleteContract(success=True)


class Mutation(graphene.ObjectType):
    create_contract = CreateContract.Field()
    pay_contract_deposit = PayContractDeposit.Field()
    pay_total_contract = PayTotalContract.Field()
    cancel_contract = CancelContract.Field()
    start_contract = StartContract.Field()
    expired_contract = ExpiredContract.Field()
    finish_contract = FinishContract.Field()
    failed_return_contract = FailedReturnContract.Field()
    successful_return_contract = SuccessfulReturnContract.Field()

    delete_contract = DeleteContract.Field()
