import base64

import bcrypt
from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from decouple import config

hkdf = HKDF(
    algorithm=hashes.SHA256(),  # You can swap this out for hashes.MD5()
    length=32,
    salt=None,  # You may be able to remove this line but I'm unable to test
    info=None,  # You may also be able to remove this line
    backend=default_backend()
)
derive = hkdf.derive(
    str.encode(config('BCRYPT_PASS', 'mypass'))
)
key = base64.urlsafe_b64encode(
    derive
)


def encrypt_string(string):
    fernet = Fernet(key)
    return fernet.encrypt(string.encode()).decode()


def decrypt_string(string):
    fernet = Fernet(key)
    return fernet.decrypt(string.encode()).decode()


def get_hashed_password(plain_text_password):
    # Hash a password for the first time
    # (Using bcrypt, the salt is saved into the hash itself)
    return bcrypt.hashpw(plain_text_password, bcrypt.gensalt())


def check_password(plain_text_password, hashed_password):
    # Check hashed password. Using bcrypt, the salt is saved into the hash itself
    return bcrypt.checkpw(plain_text_password, hashed_password)
