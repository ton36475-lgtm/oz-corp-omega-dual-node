import pymongo
from pymongo import MongoClient
from datetime import datetime
import random

# MongoDB connection details (assuming it's running via docker-compose)
MONGO_HOST = "localhost"
MONGO_PORT = 27017
MONGO_DB = "sirinx_db"
MONGO_COLLECTION = "aggregated_data"

def generate_sample_data(num_records=10):
    data = []
    for i in range(num_records):
        agent_id = f"agent-{random.randint(1, 47):02d}"
        data_type = random.choice(["pv_production", "battery_soc", "weather_temp", "lead_score"])
        value = round(random.uniform(10.0, 1000.0), 2)
        timestamp = datetime.now() - timedelta(minutes=random.randint(1, 60))
        data.append({
            "processedAt": timestamp,
            "agentId": agent_id,
            "dataType": data_type,
            "value": value
        })
    return data

def ingest_data(collection, data):
    if data:
        collection.insert_many(data)
        print(f"Ingested {len(data)} records into MongoDB.")

def aggregate_data(collection):
    print("\nPerforming aggregation query...")
    pipeline = [
        {
            "$group": {
                "_id": "$dataType",
                "totalValue": {"$sum": "$value"},
                "averageValue": {"$avg": "$value"},
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {"totalValue": -1}
        }
    ]
    results = list(collection.aggregate(pipeline))
    print("Aggregation Results:")
    for result in results:
        print(result)
    return results

if __name__ == "__main__":
    try:
        client = MongoClient(MONGO_HOST, MONGO_PORT)
        db = client[MONGO_DB]
        collection = db[MONGO_COLLECTION]
        
        # Clear existing data for a clean run
        collection.delete_many({})

        # Ingest sample data
        from datetime import timedelta # Import timedelta here
        sample_data = generate_sample_data(20)
        ingest_data(collection, sample_data)

        # Perform aggregation
        aggregate_data(collection)

        client.close()
        print("\nMongoDB operations completed successfully.")

    except pymongo.errors.ConnectionFailure as e:
        print(f"Could not connect to MongoDB: {e}")
        print("Please ensure MongoDB is running via docker-compose.")
    except Exception as e:
        print(f"An error occurred: {e}")
