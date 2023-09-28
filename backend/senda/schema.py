import graphene

import users.schema.queries
import users.schema.mutations

import senda.core.schema.queries


# As the app grows the Query and Mutation class will extend from more schemas
class Query(
    senda.core.schema.queries.Query,
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
