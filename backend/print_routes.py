from app.main import app
from fastapi.routing import APIRoute
from starlette.routing import Mount

def print_routes(routes, prefix=""):
    for route in routes:
        if isinstance(route, APIRoute):
            print(f"{route.methods} {prefix}{route.path}")
        elif isinstance(route, Mount):
            print_routes(route.routes, prefix + route.path)

print_routes(app.routes)
