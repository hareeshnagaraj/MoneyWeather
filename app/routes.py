# CS421 Project
# Hareesh Nagaraj, Thomas Gill, Joe Soultanis
# Routes file for web app
from flask import Flask, render_template
import psycopg2


#THIS IS THE CONNECTION TO THE CS COMP DATABASE ASSUMING LOCAL PORT
#PORT VALUE NEEDS TO BE CHANGED FOR DEPLOYMENT
conn = psycopg2.connect(database="nagaraj_weather", user="nagaraj", password="nagaraj", host="localhost", port="63333")
cur = conn.cursor() #used to perform ops on db

app = Flask(__name__)      
 
@app.route('/')
def home():
  print("hi")
  return render_template('index.html')

if __name__ == '__main__':
  app.run(debug=True)