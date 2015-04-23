#This script handles commodity data population into the database
#takes a command line argument specifying which commodity
#commodity .csv files are stored in /data/commodities/

import psycopg2
import urllib2
import csv
import sys

conn = psycopg2.connect(database="nagaraj_weather", user="nagaraj", password="nagaraj", host="localhost", port="63333")
cur = conn.cursor() #used to perform ops on db
conn.autocommit = True  #used to automatically commit updates to db


def populateGold():
    print("Loading gold data from /data/commodities/gold_prices.csv")
    prequery = "SELECT * FROM commodity WHERE commodityname = 'gold'"
    cur.execute(prequery) 
    if cur.rowcount == 0:   #insert gold into the commodity database if not present
        print("Adding gold to the commodity table")
        cur.execute("""INSERT INTO commodity (commodityname,unit_measure) VALUES (%s,%s)""",('gold','troy ounce',))
    prequery = "SELECT * FROM commodity_price WHERE commodityname = 'gold' AND day = %s AND month = %s AND year = %s"
    with open('data/commodities/gold_prices.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        x = 0
        for row in spamreader:
            if x > 0:
                date = row[0]
                price = row[1]
                dateparams = date.split("-")
                year = dateparams[0]
                month = dateparams[1]
                day = dateparams[2]
                cur.execute(prequery, (day,month,year))
                # print(cur.rowcount)  
                # print(row)
                if cur.rowcount == 0:
                    try:
                        cur.execute("""INSERT INTO commodity_price \
                            (commodityname,month,year,price,day) \
                            VALUES (%s, %s, %s, %s, %s)""", \
                            ("gold",month,year,price,day,))
                    except Exception:
                        print("ERROR")
                        return ;
                        pass
            x += 1

def main():
    if(len(sys.argv) != 2):
        print("Please execute this script as:")
        print("python populate_commodity.py somecommodityname")
        return
    commodity = sys.argv[1].lower()
    if commodity == "gold":
        populateGold()
main()