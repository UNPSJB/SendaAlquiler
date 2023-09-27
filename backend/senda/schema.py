import graphene

import users.schema.queries
import users.schema.mutations

import senda.office.schema.queries
import senda.products.schema.queries
import senda.locality.schema.queries
import senda.client.schema.queries


# As the app grows the Query and Mutation class will extend from more schemas
class Query(
    senda.products.schema.queries.Query,
    senda.locality.schema.queries.Query,
    senda.office.schema.queries.Query,
    senda.client.schema.queries.Query,
    users.schema.queries.Query,
    graphene.ObjectType,
):
    pass


class Mutation(
    users.schema.mutations.Mutation,
    graphene.ObjectType,
):
    pass


# noinspection PyTypeChecker
schema = graphene.Schema(query=Query, mutation=Mutation)
