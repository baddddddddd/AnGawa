from common import *
from account import *
from quiz import *
from task import *
from notes import *


@app.route("/api/ping", methods=["GET"])
def ping():
    return jsonify(msg="I'm alive!")


if __name__ == '__main__':
    app.run(debug=True)
