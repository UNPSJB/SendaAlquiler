import graphene

import users.schema.queries
import users.schema.mutations


# As the app grows the Query and Mutation class will extend from more schemas
class Query(
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
