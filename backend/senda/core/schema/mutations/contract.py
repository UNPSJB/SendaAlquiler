from typing import List

import graphene
from django.core.exceptions import ObjectDoesNotExist

from senda.core.models.contract import (
    Contract,
    ContractDetailsDict,
    ContractItemDetailsDict,
    ContractItemServiceDetailsDict,
    ContractCreationError,
    ContractItemDevolutionDetailsDict,
)
from senda.core.decorators import employee_or_admin_required, CustomInfo
from senda.core.schema.custom_types import (
    ContractType,
)

from senda.core.services.mail_service import MailService

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


class ContractItemServiceItemInput(graphene.InputObjectType):
    service_id = graphene.ID(required=True)
    discount = graphene.Int()


class ContractItemInput(graphene.InputObjectType):
    product_id = graphene.ID(required=True)
    product_discount = graphene.Int()
    quantity = graphene.Int(required=True)
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
            service_data_dics: List[ContractItemServiceDetailsDict] = []

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
                    product_discount=item.product_discount,
                    services=service_data_dics,
                    quantity=item.quantity,
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

            MailService.send_contract_proposal_email(contract.pk)

            return CreateContract(ok=True, contract_id=contract.id)
        except ContractCreationError as e:
            return CreateContract(ok=False, error=str(e))


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


class ContractItemDevolutionInput(graphene.InputObjectType):
    item_id = graphene.ID(required=True)
    quantity = graphene.Int(required=True)


class ChangeContractStatus(graphene.Mutation):
    contract = graphene.Field(ContractType)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        cash_payment = graphene.Int()
        devolutions = graphene.List(graphene.NonNull(ContractItemDevolutionInput))
        status = graphene.String(required=True)
        note = graphene.String()

    @classmethod
    def get_contract(cls, id: str) -> Contract:
        contract = Contract.objects.filter(id=id).first()

        if contract is None:
            raise Exception("No existe contrato con ese ID")

        return contract

    @classmethod
    def mutate(
        cls,
        self: "ChangeContractStatus",
        info: CustomInfo,
        id: str,
        status: str,
        cash_payment: int = None,
        devolutions: List[ContractItemDevolutionInput] = None,
        note: str = None,
    ):
        contract = cls.get_contract(id)
        contract.set_status(
            cash_payment=cash_payment,
            devolutions=(
                [
                    ContractItemDevolutionDetailsDict(
                        item_id=int(devolution.item_id), quantity=devolution.quantity
                    )
                    for devolution in devolutions
                ]
                if devolutions
                else []
            ),
            note=note,
            responsible_user=info.context.user,
            status=status,
        )

        return ChangeContractStatus(contract=contract, error=None)


class Mutation(graphene.ObjectType):
    create_contract = CreateContract.Field()
    change_contract_status = ChangeContractStatus.Field()
    delete_contract = DeleteContract.Field()
