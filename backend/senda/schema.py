import graphene

import users.schema.queries
import users.schema.mutations

import senda.core.schema.queries
import senda.core.schema.mutations


# As the app grows the Query and Mutation class will extend from more schemas
class Query(
    senda.core.schema.queries.Query,
    users.schema.queries.Query,
    graphene.ObjectType,
):
    pass


class Mutation(
    users.schema.mutations.Mutation,
    senda.core.schema.mutations.Mutation,
    graphene.ObjectType,
):
    pass


# noinspection PyTypeChecker
schema = graphene.Schema(query=Query, mutation=Mutation)
