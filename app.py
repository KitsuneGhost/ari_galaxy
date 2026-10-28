from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from functools import partial

if __name__ == '__main__':
    directory = Path(__file__).parent / 'dist'
    server = ThreadingHTTPServer(('127.0.0.1', 8000), partial(SimpleHTTPRequestHandler, directory=str(directory)))
    print('A universe for Ari: http://localhost:8000', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
