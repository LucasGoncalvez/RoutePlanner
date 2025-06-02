
# Imagen base
FROM python:3.12

# Variables de entorno para evitar errores de buffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto de Django
EXPOSE 8000

# Comando de inicio
CMD ["python3", "manage.py"]