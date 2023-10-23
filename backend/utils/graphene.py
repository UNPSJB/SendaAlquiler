import graphene


def non_null_list_of(model_type, **fields):
    return graphene.NonNull(graphene.List(graphene.NonNull(model_type)), **fields)


def get_all_objects(model):
    return model.objects.all()


def input_object_type_to_dict(data: graphene.InputObjectType):
    """Converts InputObjectType to dictionary."""
    return {field: getattr(data, field) for field in data._meta.fields}
