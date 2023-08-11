import random
import string


def get_random_password() -> str:
    password = ''.join(random.SystemRandom().choice(string.digits) for _ in range(6))
    return password
