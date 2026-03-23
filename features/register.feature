Feature: Register API

    Rule: Positive login

        Scenario: Successful registration
            # Given I have valid credentials:
            # """
            # {
            #     "email": "eve.holt@reqres.in",
            #     "password": "cityslicka"
            # }
            # """
            # When I register
            # Then the response status code should be 200
            # And the response should contain property "id"
            # And the response should contain property "token"


    Rule: Negative login

        Scenario: Registration with missing password
            Given I have email only
            When I register
            Then the response status code should be 400
            And the response should contain property "error"
