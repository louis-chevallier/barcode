

import os, gc, sys
import shutil
from utillc import *
import cherrypy
import threading
import queue
import json, pickle

import time
import time as _time
from time import gmtime, strftime
from datetime import timedelta
import PIL
from PIL import Image
import os
fileDir = os.path.dirname(os.path.abspath(__file__))
rootDir = os.path.join(fileDir, 'www')
EKOX(rootDir)

port = 8081
if "PORT" in os.environ :
        port = int(os.environ["PORT"])
OK="OK"
FAILED="FAILED"
config = {
    '/' : {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': rootDir,
        #      'tools.staticdir.dir': '/mnt/hd2/users/louis/dev/git/three.js/examples/test',
        
    },
    'global' : {
        'server.socket_host' : '0.0.0.0', #192.168.1.5', #'127.0.0.1',
        'server.socket_port' : port,
        'server.thread_pool' : 8,
        'log.screen': False, #True,
        'log.error_file': './error.log',
        'log.access_file': './access.log'
    }
}

class App:
    """
    the Webserver
    """
    def __init__(self, args) :
        EKOT("app init")
        self.args = args
        EKOT("listenning to %d" % port)
        
    def info(self) : return "info" #self.args.gitinfo
        
    @cherrypy.expose
    def index(self):
        EKOT("REQ main")
        with open('www/main.html', 'r') as file:
            data = file.read()
            data = data.replace("INFO", self.info())
            return data
    @cherrypy.expose
            
    def uploadPhoto(self, ufile):
        '''receive a picture
        '''
        EKOT("REQ uploadPhoto")
        try :
            body = cherrypy.request.body
            EKOX(body)
            filename = ufile.filename
            EKOX(filename)
            destination = os.path.join(tmpphotos, filename)
            EKOX(destination)
            ext = os.path.splitext(filename)[1]
            size = 0
            with open(destination, 'wb') as out:
                while True:
                    data = ufile.file.read(8192)
                    #EKOX(len(data))
                    if not data:
                        break
                    out.write(data)
                    size += len(data)
            EKOX("done %d" % size)
            image = Image.open(destination)
            EKOT("good image")
            rep = { STATUS : OK }
            
        except Exception as e :
            EKOX(e)
            rep = { STATUS : FAILED }
        EKOX(rep)
        return json.dumps(rep)

if __name__ == '__main__':

    app = App(sys.argv)
    cherrypy.log.error_log.propagate = False
    cherrypy.log.access_log.propagate = False
    EKO()
    cherrypy.quickstart(app, '/', config)
    EKOT("end server", n=LOG)

    
