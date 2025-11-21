import pickle
from multiprocessing import Process
from time import gmtime, strftime
import os
import threading
import prometheus_client
from prometheus_client.core import CollectorRegistry
from prometheus_client import Gauge
from py2neo import Graph
import urllib3
from flask import Response, Flask

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

CONTENT_TYPE_LATEST = str('text/plain; version=0.0.4; charset=utf-8')
SERVICE_ADDRESS = os.environ.get('NEO4J_ADDRESS')
SERVICE_HOST, SERVICE_PORT = SERVICE_ADDRESS.split(':')
SERVICE_USER = os.environ.get('NEO4J_USER')
SERVICE_PASS = os.environ.get('NEO4J_PASSWORD')
PREFIX = "neo4j_"
PROM_OUTPUT = []
BACKGROUND_CHECK = False
FLASK_FIRST_LAUNCH = True
NEO4J_REQUEST = []

app = Flask(import_name=__name__)

def background_collector():
    """Collecting Neo4j metrics in the background"""
    global FLASK_FIRST_LAUNCH

    if FLASK_FIRST_LAUNCH is True:
        print(strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [INFO] Waiting for the web-server to start')
        FLASK_FIRST_LAUNCH = False
        threading.Timer(60, background_collector).start()
        print(strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [INFO] The task of background collection of metrics has been successfully created')
    else:
        global BACKGROUND_CHECK
        if BACKGROUND_CHECK is True:
            print(strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [WARN] Another background collector is already running, skipping the current run')
        else:
            active_addresses = [] # Aca voy a guardar las direcciones de las instancias vivas que devuelva la query de status
            BACKGROUND_CHECK = True
            print(strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [INFO] Start background collecting Prometheus metrics')
            lst = []
            registry = CollectorRegistry()

            ### Database statuses ###
            neo4j_db_status = Gauge('neo4j_db_status', 'List of all databases with their status. 1 – online, 0 – all other statuses', ['name', 'address', 'currentStatus'], registry=registry)
            print (strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [INFO] [-] Getting the statuses of all tables in the cluster')
            try:
                global NEO4J_REQUEST
                NEO4J_REQUEST = Graph("bolt://"+SERVICE_ADDRESS, auth=(SERVICE_USER, SERVICE_PASS))
                def neo_query_1():
                    global NEO4J_REQUEST
                    f_file = open('/tmp/result', 'wb')
                    f_file.close()
                    neo4j_request_result = NEO4J_REQUEST.run('SHOW DATABASES YIELD name, address, currentStatus').data()
                    f_file = open('/tmp/result', 'wb')
                    pickle.dump(neo4j_request_result,f_file)
                    f_file.close()
                    print (strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [INFO] [+] Done')
                p_1 = Process(target=neo_query_1, name='Process_request_1')
                p_1.start()
                p_1.join(timeout=10)
                p_1.terminate()
                f_file = open('/tmp/result', 'rb')
                neo4j_request_result = pickle.load(f_file)
                f_file.close()
            except:
                neo4j_request_result = []
                print (strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [ERROR] Error connecting to the database to get statuses')
            for db_list in neo4j_request_result:
                print ('Collected status: ' + db_list['name'] + ' = ' + db_list['currentStatus'])
                if db_list['currentStatus'] == 'online':
                    active_addresses.append(db_list['address'])
                    db_status = 1
                else:
                    db_status = 0
                neo4j_db_status.labels(name=db_list['name'], address=db_list['address'].split('.')[0], currentStatus=db_list['currentStatus']).set(db_status)
            lst.append(prometheus_client.generate_latest(neo4j_db_status))

            ### Long-running queries ###
            neo4j_db_queries = Gauge('neo4j_db_query', 'Queries that have been running', ['database', 'transactionId', 'currentQueryId', 'status', 'activeLockCount', 'pageHits', 'cpuTimeMillis', 'waitTimeMillis', 'idleTimeSeconds', 'address'], registry=registry)
            neo4j_db_queries_page_hits = Gauge('neo4j_db_query_page_hits', 'Page hits amount of queries that have been running', ['database', 'transactionId', 'currentQueryId', 'status', 'activeLockCount', 'cpuTimeMillis', 'waitTimeMillis', 'idleTimeSeconds', 'address'], registry=registry)
            for addr in active_addresses:
                db_address = SERVICE_ADDRESS if addr == SERVICE_ADDRESS.replace(SERVICE_HOST, "localhost") else addr
                print (strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [INFO] [-] Getting queries from ' + db_address.lower())
                try:
                    NEO4J_REQUEST = Graph("bolt://"+db_address, auth=(SERVICE_USER, SERVICE_PASS))
                    def neo_query_2():
                        global NEO4J_REQUEST
                        f_file = open('/tmp/result', 'wb')
                        f_file.close()
                        neo4j_request_result = NEO4J_REQUEST.run('SHOW TRANSACTIONS YIELD database, transactionId, currentQueryId, status, activeLockCount, pageHits, elapsedTime, cpuTime, waitTime, idleTime RETURN database, transactionId, currentQueryId, status, activeLockCount, pageHits, elapsedTime.milliseconds AS elapsedTimeMillis, cpuTime.milliseconds AS cpuTimeMillis, waitTime.milliseconds AS waitTimeMillis, idleTime.seconds AS idleTimeSeconds').data()
                        f_file = open('/tmp/result', 'wb')
                        pickle.dump(neo4j_request_result,f_file)
                        f_file.close()
                        print (strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [INFO] [+] Done')
                    p_2 = Process(target=neo_query_2, name='Process_request_2')
                    p_2.start()
                    p_2.join(timeout=10)
                    p_2.terminate()
                    f_file = open('/tmp/result', 'rb')
                    neo4j_request_result = pickle.load(f_file)
                    f_file.close()
                except:
                    neo4j_request_result = []
                    print (strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [ERROR] Error connecting to the ' + db_address.lower() + ' to get queries')
                for db_list in neo4j_request_result:
                    print ('Collected transaction metrics from ' + db_list['database'])
                    neo4j_db_queries.labels(database=db_list['database'], transactionId=db_list['transactionId'], currentQueryId=db_list['currentQueryId'], status=db_list['status'], activeLockCount=db_list['activeLockCount'], pageHits=db_list['pageHits'], cpuTimeMillis=db_list['cpuTimeMillis'], waitTimeMillis=db_list['waitTimeMillis'], idleTimeSeconds=db_list['idleTimeSeconds'], address=db_address.lower()).set(db_list['elapsedTimeMillis'])
                    neo4j_db_queries_page_hits.labels(database=db_list['database'], transactionId=db_list['transactionId'], currentQueryId=db_list['currentQueryId'], status=db_list['status'], activeLockCount=db_list['activeLockCount'], cpuTimeMillis=db_list['cpuTimeMillis'], waitTimeMillis=db_list['waitTimeMillis'], idleTimeSeconds=db_list['idleTimeSeconds'], address=db_address.lower()).set(db_list['pageHits'])
            lst.append(prometheus_client.generate_latest(neo4j_db_queries))
            lst.append(prometheus_client.generate_latest(neo4j_db_queries_page_hits))

            ### Final set of metrics ###
            global PROM_OUTPUT
            PROM_OUTPUT = lst
            print(strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' [INFO] Prometheus metrics have been successfully collected in the background')

            BACKGROUND_CHECK = False

        threading.Timer(240, background_collector).start()

background_collector()

@app.route("/")
def hello():
    """Displaying the root page"""
    return "This is a Prometheus Exporter. Go to the /metrics page to get metrics"

@app.route('/metrics', methods=['GET'])
def metrics():
    """Displaying the Prometheus Metrics page"""
    return Response(PROM_OUTPUT,mimetype=CONTENT_TYPE_LATEST)

if __name__ == "__main__":
    app.run(debug=True)
