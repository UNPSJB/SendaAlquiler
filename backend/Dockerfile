FROM python:3.8.10
# LABEL saas-api

# Setting PYTHONUNBUFFERED to a non empty value ensures that the python
# output is sent straight to terminal (e.g. your container log) 
ENV PYTHONUNBUFFERED 1

RUN mkdir /docker_api
WORKDIR /docker_api
COPY requirements.txt ./

RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip install -r requirements.txt
# RUN pip install  -i  https://pypi.python.org/simple/  -r requirements.txt

COPY . ./
