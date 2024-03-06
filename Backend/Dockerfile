FROM python:3.8

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /Backend

COPY requirements.txt /Backend/
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y build-essential python3-dev default-libmysqlclient-dev && pip install -r requirements.txt


COPY . /Backend/

RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
