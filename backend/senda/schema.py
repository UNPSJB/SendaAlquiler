import graphene

import users.schema.queries
import users.schema.mutations

import senda.products.schema.queries
import senda.locality.schema.queries

# As the app grows the Query and Mutation class will extend from more schemas
class Query(
    senda.products.schema.queries.Query,
    senda.locality.schema.queries.Query,
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
