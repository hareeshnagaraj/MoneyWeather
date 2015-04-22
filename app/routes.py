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
  print("home page rendering")
  return render_template('index.html')

# This grabs the data necessary for the gold page, averages it monthly
@app.route('/gold')
def tool():
  print("tool page rendering")
  queryOne = "SELECT zip FROM location WHERE commodityName = 'gold'";
  cur = conn.cursor()
  cur.execute(queryOne)
  print(cur.fetchall())
  return render_template('gold.html')

if __name__ == '__main__':
  app.run(debug=True)