from flask_restx import Namespace, Resource, fields

api = Namespace("Users", description="Users related operations")


Register_success_model = api.model("RegisterSuccessModel", {
    "message": fields.String(default="User created successfully.")
})
Register_bad_request_model = api.model("RegisterBadRequestModel", {
    "message": fields.String(default="A user with that username already exists")
})


@api.route("/register")
class UserRegister(Resource):
    @api.doc("Users registration", responses={
        201: 'Successfully created user',
        400: 'Some problems with input values'
    })
    @api.marshal_with(Register_success_model, code=201)
    @api.marshal_with(Register_bad_request_model, code=400)
    @classmethod
    def post(cls):
        """Create new user or return error"""
        pass
