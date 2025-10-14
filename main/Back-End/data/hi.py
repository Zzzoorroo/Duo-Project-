import sqlite3

# Path to your database file
db_path = './main/Back-End/data/duoproject.db'

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# List all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("📋 Tables:", tables)

# Loop through tables and print their contents
for table in tables:
    table_name = table[0]
    print(f"\n🔹 Contents of table '{table_name}':")
    
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    
    for row in rows:
        print(row)

# Close connection
conn.close()
