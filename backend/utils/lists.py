from typing import List, Any, TypeVar

T = TypeVar("T")


def unique(list1: List[T]) -> List[T]:
    # initialize a null list
    unique_list = []

    # traverse for all elements
    for x in list1:
        # check if exists in unique_list or not
        if x not in unique_list:
            unique_list.append(x)

    return unique_list
