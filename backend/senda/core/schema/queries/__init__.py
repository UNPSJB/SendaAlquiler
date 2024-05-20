import graphene

from .client import Query as ClientQuery
from .locality import Query as LocalityQuery
from .office import Query as OfficeQuery
from .order_internal import Query as InteralOrderQuery
from .product import Query as ProductQuery
from .sale import Query as SaleQuery
from .contract import Query as ContractQuery
from .supplier import Query as SupplierQuery
from .employee import Query as EmployeeQuery
from .order_supplier import Query as SupplierOrderQuery
from .dashboard import Query as DashboardQuery
from .report_sales import Query as SalesReportQuery
from .report_supplier_order import Query as SupplierOrderReportQuery
from .report_supplier_costs import Query as SupplierCostsReportQuery
from .report_internal_orders import Query as InternalOrdersReportQuery


class Query(
    ClientQuery,
    EmployeeQuery,
    LocalityQuery,
    OfficeQuery,
    ProductQuery,
    SaleQuery,
    SupplierQuery,
    SupplierOrderQuery,
    InteralOrderQuery,
    ContractQuery,
    DashboardQuery,
    SalesReportQuery,
    SupplierOrderReportQuery,
    SupplierCostsReportQuery,
    InternalOrdersReportQuery,
    graphene.ObjectType,
):
    pass
