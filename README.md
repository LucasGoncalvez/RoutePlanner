# RoutePlanner
Planificador de rutas


# Pasos para levantar el backend
cd route-planner-backend
python3 -m venv venv
# para linux: 
source venv/bin/activate 
# para windows: 
.\venv\Scripts\activate
# continuar con lo siguiente
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver

# Pasos para levantar el frontend
cd route-planner-frontend
npm install
npm start

# ruta para ingresar desde el navegador: 
localhost:3000



# para ejecutar via docker-compose:
docker-compose up --build