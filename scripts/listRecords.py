# This script will list out all rows in the points.db file
import sqlite3

# Connect
con = sqlite3.connect("../database.db")
cur = con.cursor()

# See all rows
cur.execute("SELECT * FROM points")
rows = cur.fetchall()
for row in rows:
    print(row)

con.close()