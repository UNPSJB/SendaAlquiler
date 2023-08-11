import graphene
from users.decorators import administrator_required


def non_null_list_of(model_type, **fields):
    return graphene.NonNull(graphene.List(graphene.NonNull(model_type)), **fields)


def get_all_objects(model):
    return model.objects.all()
